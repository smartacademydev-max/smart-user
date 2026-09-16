import { Box, Button, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import { CloseCircle, Lock } from "iconsax-reactjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PATH } from "../../../../routes/PATH";
import {
    useGetTestByIdQuery,
    useSubmitMcqMutation,
} from "../../../../services/testApi";
import { closeTest } from "../../../../slice/testRunnerSlice";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";

import { isAnswered } from "../../../../types/question";
import type {
    Answers,
    McqSubmissionData,
    QuestionProps,
} from "../../../../types/question";

import { useFullscreen } from "../../../../hooks/useFullscreen";
import { formatDateTime } from "../../../../utils/dateFormat";
import { renderHtml } from "../../../../utils/renderHtml";
import { isTestNotStarted } from "../../../../utils/testSchedule";

import TestCancelDialog from "../../../organism/Dialog/TestCancelDialog";
import TestResultDialog from "../../../organism/Dialog/TestResultDialog";
import TestSubmissionDialog, {
    type SubmissionType,
} from "../../../organism/Dialog/TestSubmissionDialog";

import WaterMark from "../../../../Watermark";
import { EmptyList } from "../../../molecules/EmptyList";
import TabController from "../../../molecules/TabController";
import TestSample from "../reviewTest/TestSample";
import QuestionPager from "./QuestionPager";
import { QuestionNavigator, QuestionNavigatorSheet } from "./QuestionNavigator";
import QuestionView from "./QuestionView";
import QuizGate from "./QuizGate";
import QuizHeader from "./QuizHeader";
import { useQuizTokens } from "./quizTokens";
import TwoMinAudio from "/audios/mcq-2-min-warning.mp3";
import FiveMinAudio from "/audios/mcq-5-min-warning.mp3";

/** What a saved attempt keeps between refreshes. */
interface SavedProgress {
    attendedQuestion: Answers[];
    flaggedQuestionIds: number[];
    currentQuestionIndex: number;
    timeLeft: number;
    lastUpdated: number;
}

/**
 * Sitting a test is not a page — it is a mode the app enters. Mounted once and
 * high in the tree, it opens over whatever the student was looking at when they
 * pressed Start and hands them back to it afterwards, so nothing is navigated
 * away from and nothing underneath them is unmounted.
 *
 * Every piece of the attempt's state lives in the inner component, keyed by test
 * id, so opening a different paper starts genuinely fresh instead of inheriting
 * the last one's clock and answers.
 */
export default function TestRunner() {
    const { testId, courseId } = useAppSelector((state) => state.testRunner);
    const user = useAppSelector((state) => state.auth.user);

    if (!testId || !user) return null;

    return <TestScreen key={testId} testId={testId} courseId={courseId} />;
}

function TestScreen({ testId, courseId }: { testId: number; courseId?: number }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const t = useQuizTokens();

    const numericCourseId = courseId ? Number(courseId) : undefined;
    const numericTestId = Number(testId);

    const reviewPath = numericCourseId
        ? PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.REVIEW_TEST.ROOT({
            courseId: numericCourseId,
            testId: numericTestId,
        })
        : PATH.TEST.VIEW_TEST.REVIEW_TEST.ROOT({ testId: numericTestId });

    const exitPath = numericCourseId
        ? PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(numericCourseId)
        : PATH.TEST.MY_TEST.ROOT;

    const STORAGE_KEY = `mcq_test_progress_${courseId}_${testId}`;
    const RESULT_KEY = `mcq_test_result_${courseId}_${testId}`;

    const [attendedQuestion, setAttendedQuestion] = useState<Answers[]>([]);
    const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<number[]>([]);
    const [currentQuestion, setCurrentQuestion] =
        useState<QuestionProps | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [timeLeft, setTimeLeft] = useState<number | undefined>();
    const [timerPaused, setTimerPaused] = useState(false);

    const [cancelModal, setCancelModal] = useState(false);
    const [submitModal, setSubmitModal] = useState<{
        open: boolean;
        type: SubmissionType;
    }>({ open: false, type: "submit" });

    const [result, setResult] = useState<McqSubmissionData | null>(null);
    const [resultOpen, setResultOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("questions");
    // The window had already closed when the paper was opened -> questions are
    // browsable but nothing can be answered or submitted.
    const [viewOnly, setViewOnly] = useState(false);

    /** False until the student passes the start gate — the attempt is not live
     *  before that, so neither the clock nor the autosave may run. */
    const [started, setStarted] = useState(false);
    const [gateBusy, setGateBusy] = useState(false);
    const [gateError, setGateError] = useState<string | null>(null);
    const [navigatorOpen, setNavigatorOpen] = useState(false);

    const initialTimeRef = useRef<number | null>(null);
    const fiveMinPlayedRef = useRef(false);
    const twoMinPlayedRef = useRef(false);

    const fiveMinAudioRef = useRef<HTMLAudioElement | null>(null);
    const twoMinAudioRef = useRef<HTMLAudioElement | null>(null);

    const { isFullscreen, isSupported: fullscreenSupported, enter, exit } =
        useFullscreen();

    useEffect(() => {
        fiveMinAudioRef.current = new Audio(FiveMinAudio);
        twoMinAudioRef.current = new Audio(TwoMinAudio);
    }, []);

    /** The page behind must not scroll under the attempt. */
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    /**
     * Closing the attempt by any route — submitting, leaving, a session ending —
     * must not strand the browser in full screen.
     *
     * The guard is for React's dev StrictMode, which mounts this screen, tears it
     * down and mounts it again within the same commit. That teardown lands before
     * the request made on the test card has even resolved, and exiting there
     * silently undid the full screen the student had just asked for. No timeout
     * can have run by then, so a screen that has survived one turn of the event
     * loop is one the student is genuinely on.
     */
    const settledRef = useRef(false);

    useEffect(() => {
        const id = setTimeout(() => { settledRef.current = true; }, 0);

        return () => {
            clearTimeout(id);
            if (!settledRef.current) return;
            settledRef.current = false;
            void exit();
        };
    }, [exit]);

    const {
        data,
        isLoading,
        isFetching,
    } = useGetTestByIdQuery(
        { courseId: numericCourseId, testId: numericTestId },
        { skip: !numericTestId }
    );

    const [submitMcq, { isLoading: submitting }] =
        useSubmitMcqMutation();


    useEffect(() => {
        if (!data || data.overview?.test_type !== "mcq") return;
        // The window has not opened. Seed nothing — no timer, no saved progress —
        // so opening it early cannot start an attempt.
        if (isTestNotStarted(data.overview)) return;

        const endTime = data.overview.end_datetime ? new Date(data.overview.end_datetime).getTime() : null;
        const currentTime = Date.now();
        const timeRemainingFromEnd = endTime ? Math.max(endTime - currentTime, 0) : null;

        if (timeRemainingFromEnd !== null && timeRemainingFromEnd <= 0) {
            localStorage.removeItem(STORAGE_KEY);
            setViewOnly(true);
            setCurrentQuestion(data.data[0]);
            setTimeLeft(0);
            return;
        }

        setViewOnly(false);

        const actualTimeLeft = timeRemainingFromEnd !== null
            ? Math.min(data.overview.time, timeRemainingFromEnd)
            : data.overview.time;

        initialTimeRef.current = actualTimeLeft;

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            setCurrentQuestion(data.data[0]);
            setTimeLeft(actualTimeLeft);
            return;
        }

        const parsed: SavedProgress = JSON.parse(saved);
        const index = parsed.currentQuestionIndex ?? 0;

        setAttendedQuestion(parsed.attendedQuestion || []);
        setFlaggedQuestionIds(parsed.flaggedQuestionIds || []);
        setCurrentIndex(index);
        setCurrentQuestion(data.data[index]);

        const diff = Date.now() - parsed.lastUpdated;
        setTimeLeft(Math.max(parsed.timeLeft - diff, 0));
    }, [data, STORAGE_KEY]);


    /** Only a live attempt writes. Saving from behind the gate would keep
     *  refreshing `lastUpdated` and quietly stop the clock. */
    useEffect(() => {
        if (timeLeft === undefined || timerPaused || !started || viewOnly) return;

        const snapshot: SavedProgress = {
            attendedQuestion,
            flaggedQuestionIds,
            currentQuestionIndex: currentIndex,
            timeLeft,
            lastUpdated: Date.now(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    }, [
        attendedQuestion,
        flaggedQuestionIds,
        currentIndex,
        timeLeft,
        timerPaused,
        started,
        viewOnly,
        STORAGE_KEY,
    ]);


    useEffect(() => {
        if (timeLeft === undefined || timerPaused || timeLeft <= 0 || !started) return;

        const id = setInterval(
            () => setTimeLeft(value => Math.max((value ?? 0) - 1000, 0)),
            1000
        );

        return () => clearInterval(id);
        // timeLeft intentionally excluded — functional update keeps the callback fresh.
        // timeLeft !== undefined triggers this once when the timer is first initialized.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerPaused, started, timeLeft !== undefined]);


    useEffect(() => {
        if (timeLeft === undefined || timerPaused || !started) return;

        const fiveMinutesInMs = 5 * 60 * 1000;
        const twoMinutesInMs = 2 * 60 * 1000;

        if (timeLeft <= fiveMinutesInMs && timeLeft > fiveMinutesInMs - 1000 && !fiveMinPlayedRef.current) {
            fiveMinPlayedRef.current = true;
            if (fiveMinAudioRef.current) {
                fiveMinAudioRef.current.play().catch((error) => {
                    console.error("Failed to play 5-minute warning audio:", error);
                });
            }
        }

        if (timeLeft <= twoMinutesInMs && timeLeft > twoMinutesInMs - 1000 && !twoMinPlayedRef.current) {
            twoMinPlayedRef.current = true;
            if (twoMinAudioRef.current) {
                twoMinAudioRef.current.play().catch((error) => {
                    console.error("Failed to play 2-minute warning audio:", error);
                });
            }
        }
    }, [timeLeft, timerPaused, started]);


    useEffect(() => {
        if (timeLeft === 0 && !timerPaused && started) {
            setTimerPaused(true);
            // Only auto-submit a live attempt. A paper opened after its window
            // closed has nothing to submit.
            if (!viewOnly) {
                handleSubmit("timer");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, timerPaused, viewOnly, started]);


    const handleAnswer = (value: Answers) => {
        setAttendedQuestion(prev => {
            const index = prev.findIndex(
                v => v.question_id === value.question_id
            );

            if (index !== -1) {
                const copy = [...prev];
                copy[index] = value;
                return copy;
            }
            return [...prev, value];
        });
    };

    /** Hands the screen back to whatever the student opened the test from. */
    const dismiss = () => {
        void exit();
        dispatch(closeTest());
    };

    const handleSubmit = async (type: SubmissionType) => {
        if (!data) return;

        try {
            setTimerPaused(true);

            const timeTaken =
                (initialTimeRef.current ?? 0) - (timeLeft ?? 0);

            const res = await submitMcq({
                courseId: numericCourseId,
                testId: numericTestId,
                body: {
                    answers: attendedQuestion,
                    time_taken: timeTaken,
                },
            }).unwrap();

            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem(RESULT_KEY, JSON.stringify(res.data));

            setSubmitModal({ open: false, type });
            setResult(res.data);
            setResultOpen(true);

            dispatch(
                showToast({
                    message: res.message || "Test submitted successfully",
                    severity: "success",
                })
            );
        } catch {
            dispatch(
                showToast({
                    message: "Unable to submit test",
                    severity: "error",
                })
            );
        }
    };

    /**
     * The gate's button is a user gesture, which is what the Fullscreen API
     * insists on after the click that opened the test is over. The clock is
     * already running by the time this can be pressed, so there is nothing to
     * start here — only a screen to take back.
     */
    const handleEnterQuiz = async () => {
        setGateBusy(true);
        setGateError(null);

        const entered = await enter();

        setGateBusy(false);

        if (!entered) {
            setGateError("Your browser would not switch to full screen. You can carry on, but please stay on this tab.");
        }
    };

    const goToQuestion = (index: number) => {
        if (index < 0 || index >= questions.length) return;
        setCurrentIndex(index);
        setCurrentQuestion(questions[index]);
    };

    const toggleFlag = () => {
        const id = currentQuestion?.id;
        if (id === null || id === undefined) return;

        setFlaggedQuestionIds((prev) =>
            prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
        );
    };

    const isReady = !!data && !isLoading && !isFetching;
    const isMCQ = data?.overview?.test_type === "mcq";
    const notStarted = isReady && isTestNotStarted(data?.overview);
    const questions = useMemo(() => data?.data ?? [], [data]);
    // Answering is locked either because the window closed before the attempt
    // started (viewOnly) or because the timer just ran out.
    const isLocked = viewOnly || timeLeft === 0;

    const answeredIds = useMemo(() => {
        const ids = new Set<number>();
        attendedQuestion.forEach((answer) => {
            if (answer.question_id !== null && isAnswered(answer)) {
                ids.add(answer.question_id);
            }
        });
        return ids;
    }, [attendedQuestion]);

    const flaggedIds = useMemo(() => new Set(flaggedQuestionIds), [flaggedQuestionIds]);

    /**
     * Opening the runner is starting the attempt. Pressing Start on the test
     * card was the decision; asking again on arrival only put a card between the
     * student and a clock that had not yet begun.
     *
     * A resumed attempt needs no adjustment either — the clock was read off the
     * saved snapshot as the paper loaded, a moment ago.
     */
    useEffect(() => {
        if (started || !isReady || !isMCQ || notStarted || viewOnly) return;
        setStarted(true);
    }, [started, isReady, isMCQ, notStarted, viewOnly]);

    /**
     * The one thing that interrupts a live attempt: being out of full screen.
     * Deliberately absent while a dialog is open — a student confirming a
     * submission has not wandered off.
     */
    const dialogOpen = submitModal.open || cancelModal || resultOpen;
    const needsFullscreenGate =
        started && fullscreenSupported && !isFullscreen && !dialogOpen && !viewOnly && timeLeft !== 0;

    return (
        <Overlay>
            {!isReady && (
                <Centered>
                    <CircularProgress size={22} sx={{ color: t.primary }} />
                    <Typography fontSize={13} sx={{ color: t.muted, mt: 2 }}>
                        Loading test…
                    </Typography>
                </Centered>
            )}

            {isReady && notStarted && (
                <Centered>
                    <CloseButton onClick={dismiss} />
                    <Box
                        className="w-full max-w-md rounded-2xl p-6 text-left"
                        sx={{
                            backgroundColor: t.surface,
                            border: "1px solid",
                            borderColor: t.warning,
                        }}
                    >
                        <Box className="mb-3 flex items-center gap-2">
                            <Lock variant="Bold" size={18} color={t.warning} />
                            <Typography fontSize={16} fontWeight={700} sx={{ color: t.warning }}>
                                This test has not started yet
                            </Typography>
                        </Box>
                        <Typography fontSize={13} lineHeight={1.7} sx={{ color: t.muted }}>
                            {data?.overview?.start_datetime
                                ? `It opens on ${formatDateTime(data.overview.start_datetime)}. `
                                : ""}
                            The questions become available once the scheduled start time
                            arrives. Please come back then.
                        </Typography>
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={dismiss}
                            sx={{ mt: 3, fontWeight: 600 }}
                        >
                            Close
                        </Button>
                    </Box>
                </Centered>
            )}

            {isReady && !notStarted && !isMCQ && (
                <Box className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
                    <WaterMark />
                    <Box className="flex items-center justify-between gap-3">
                        <Typography fontSize={16} fontWeight={700} sx={{ color: t.foreground }}>
                            {data?.overview?.name ?? "Test"}
                        </Typography>
                        <Button variant="outlined" color="primary" size="small" onClick={dismiss}>
                            Close
                        </Button>
                    </Box>

                    <Divider className="my-4!" />

                    <div className="mb-4">
                        <TabController
                            currentActive={activeTab}
                            setActiveTab={setActiveTab}
                            options={[
                                { label: "Questions", value: "questions" },
                                { label: "Feedback", value: "feedback" },
                            ]}
                        />
                    </div>

                    {activeTab === "questions" && (
                        !questions.length
                            ? <EmptyList title="No Questions Found" description="No Questions added to this test yet!" />
                            : (
                                <Box>
                                    {questions.map((question, index) => (
                                        <Box key={question.question} className="flex gap-4 mb-4">
                                            <Typography>{index + 1}.</Typography>
                                            <Typography variant="h6">
                                                {renderHtml(question.question)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )
                    )}

                    {activeTab === "feedback" && <TestSample id={numericTestId} />}
                </Box>
            )}

            {isReady && !notStarted && isMCQ && (
                <Box
                    className="relative flex min-h-full flex-col select-none"
                    onDragStart={(event: React.DragEvent) => {
                        /**
                         * Question text and images must not be draggable out of
                         * the paper — but drag-into-text and bow-tie are answered
                         * *by* dragging, and their tiles carry `draggable`.
                         * Cancelling every drag here killed those outright.
                         */
                        const target = event.target as HTMLElement | null;
                        if (!target?.closest?.("[draggable='true']")) {
                            event.preventDefault();
                        }
                    }}
                >
                    <QuizHeader
                        title={data?.overview?.name ?? "Test"}
                        questionCount={questions.length}
                        totalMarks={data?.overview?.full_mark}
                        answered={answeredIds.size}
                        remainingMs={timeLeft}
                        locked={isLocked}
                        fullscreen={isFullscreen}
                        onOpenNavigator={() => setNavigatorOpen(true)}
                        onSubmit={() => setSubmitModal({ open: true, type: "submit" })}
                        onExit={() => (viewOnly ? dismiss() : setCancelModal(true))}
                    />

                    <Box className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-6 md:px-6 md:py-8 lg:grid-cols-[1fr_16rem]">
                        <Box className="min-w-0">
                            {viewOnly && (
                                <Box
                                    className="flex items-start gap-2 rounded-lg p-3 mb-6"
                                    sx={{
                                        bgcolor: t.dangerSoft,
                                        border: "1px solid",
                                        borderColor: t.danger,
                                    }}
                                >
                                    <Lock variant="Bold" size={18} color={t.danger} />
                                    <div>
                                        <Typography variant="subtitle2" fontWeight={600} color="error.main">
                                            This test has expired
                                            {data?.overview?.end_datetime
                                                ? ` on ${formatDateTime(data.overview.end_datetime)}`
                                                : ""}
                                        </Typography>
                                        <Typography variant="caption" color="error.main">
                                            You can read through the questions, but options are disabled and
                                            answers can no longer be submitted.
                                        </Typography>
                                    </div>
                                </Box>
                            )}

                            <Box
                                className="rounded-2xl p-4 md:p-6"
                                sx={{
                                    backgroundColor: t.surface,
                                    border: "1px solid",
                                    borderColor: t.border,
                                }}
                            >
                                <QuestionView
                                    currentQuestion={currentQuestion}
                                    questionIndex={currentIndex}
                                    attendedQuestion={attendedQuestion}
                                    setAttendedQuestion={handleAnswer}
                                    disabled={isLocked}
                                />

                                <QuestionPager
                                    index={currentIndex}
                                    total={questions.length}
                                    flagged={currentQuestion?.id !== null && currentQuestion?.id !== undefined
                                        ? flaggedIds.has(currentQuestion.id)
                                        : false}
                                    locked={isLocked}
                                    onPrev={() => goToQuestion(currentIndex - 1)}
                                    onNext={() => goToQuestion(currentIndex + 1)}
                                    onToggleFlag={toggleFlag}
                                    onSubmit={() => setSubmitModal({ open: true, type: "submit" })}
                                />
                            </Box>
                        </Box>

                        <Box component="aside" sx={{ display: { xs: "none", lg: "block" } }}>
                            <Box
                                className="sticky rounded-2xl p-4"
                                sx={{
                                    top: 80,
                                    backgroundColor: t.surface,
                                    border: "1px solid",
                                    borderColor: t.border,
                                }}
                            >
                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    letterSpacing="0.12em"
                                    textTransform="uppercase"
                                    sx={{ color: t.muted, mb: 1.5 }}
                                >
                                    Questions
                                </Typography>

                                <QuestionNavigator
                                    questions={questions}
                                    answered={answeredIds}
                                    flagged={flaggedIds}
                                    currentId={currentQuestion?.id ?? null}
                                    onSelect={(_, index) => goToQuestion(index)}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <QuestionNavigatorSheet
                        open={navigatorOpen}
                        onClose={() => setNavigatorOpen(false)}
                        questions={questions}
                        answered={answeredIds}
                        flagged={flaggedIds}
                        currentId={currentQuestion?.id ?? null}
                        onSelect={(_, index) => {
                            goToQuestion(index);
                            setNavigatorOpen(false);
                        }}
                    />

                    {needsFullscreenGate && (
                        <QuizGate
                            remainingMs={timeLeft}
                            busy={gateBusy}
                            error={gateError}
                            onContinue={handleEnterQuiz}
                            // Confirmed, not immediate: the attempt is live and
                            // its answers are only submitted deliberately.
                            onBack={() => setCancelModal(true)}
                        />
                    )}

                    {timeLeft === 0 && !viewOnly && submitting && (
                        <Box
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 px-6 text-center"
                            sx={{ backgroundColor: t.background }}
                        >
                            <CircularProgress size={22} sx={{ color: t.primary }} />
                            <Typography fontSize={15} fontWeight={600} sx={{ color: t.foreground }}>
                                Time is up — submitting your answers
                            </Typography>
                            <Typography fontSize={13} sx={{ color: t.muted, maxWidth: 360 }}>
                                Everything you entered is saved.
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            <TestSubmissionDialog
                open={submitModal.open}
                handleClose={() => setSubmitModal({ open: false, type: "submit" })}
                onSubmit={() => handleSubmit(submitModal.type)}
                type={submitModal.type}
                loading={submitting}
            />

            <TestCancelDialog
                open={cancelModal}
                handleClose={() => setCancelModal(false)}
                onSubmit={() => {
                    setCancelModal(false);
                    dismiss();
                }}
            />

            <TestResultDialog
                open={resultOpen}
                result={result}
                onReview={() => {
                    localStorage.removeItem(RESULT_KEY);
                    dismiss();
                    navigate(reviewPath);
                }}
                onBack={() => {
                    localStorage.removeItem(RESULT_KEY);
                    dismiss();
                    navigate(exitPath);
                }}
            />
        </Overlay>
    );
}

/**
 * The attempt's own surface, over the app rather than inside it. It sits just
 * below MUI's modal layer, so the submission, cancel and result dialogs — and
 * the toast — still come out on top of it, while the sidebar and app header stay
 * covered.
 */
function Overlay({ children }: { children: React.ReactNode }) {
    const t = useQuizTokens();

    return (
        <Box
            className="fixed inset-0"
            sx={{
                zIndex: t.theme.zIndex.modal - 1,
                backgroundColor: t.background,
                overflowY: "auto",
                overscrollBehavior: "contain",
            }}
        >
            {children}
        </Box>
    );
}

function Centered({ children }: { children: React.ReactNode }) {
    return (
        <Box className="flex min-h-full flex-col items-center justify-center px-6 text-center">
            {children}
        </Box>
    );
}

function CloseButton({ onClick }: { onClick: () => void }) {
    const t = useQuizTokens();

    return (
        <IconButton
            aria-label="Close test"
            onClick={onClick}
            sx={{ position: "absolute", top: 12, right: 12 }}
        >
            <CloseCircle size={22} color={t.muted} />
        </IconButton>
    );
}
