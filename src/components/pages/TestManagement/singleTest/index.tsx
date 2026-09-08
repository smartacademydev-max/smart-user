import { Box, Button, Divider, Typography } from "@mui/material";
import { ArrowLeft, Lock } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PATH } from "../../../../routes/PATH";
import {
    useGetTestByIdQuery,
    useSubmitMcqMutation,
} from "../../../../services/testApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";

import type {
    Answers,
    McqSubmissionData,
    QuestionProps,
} from "../../../../types/question";

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
import QuestionListView from "./QuestionListView";
import QuestionView from "./QuestionView";
import TwoMinAudio from "/audios/mcq-2-min-warning.mp3";
import FiveMinAudio from "/audios/mcq-5-min-warning.mp3";
/* ---------------- Skeletons ---------------- */

const HeaderSkeleton = () => (
    <div className="animate-pulse space-y-3">
        <div className="h-10 w-40 bg-gray-200 rounded" />
        <div className="h-8 w-3/5 bg-gray-200 rounded" />
    </div>
);

const SidebarSkeleton = () => (
    <div className="animate-pulse space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
        ))}
    </div>
);

const QuestionSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-6 w-4/5 bg-gray-200 rounded" />
        <div className="h-6 w-full bg-gray-200 rounded" />
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
        </div>
    </div>
);


export default function SingleTestRoot() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { courseId, testId } = useParams<{
        courseId: string;
        testId: string;
    }>();

    // This screen is mounted on both `/courses/:courseId/test/:testId` and the
    // standalone `/test/:testId`. Keep courseId undefined (not NaN) on the
    // standalone route so path builders pick the right variant.
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
    const [activeTab, setActiveTab] = useState("questions")
    // Test window already closed when the page was opened -> questions are
    // browsable but nothing can be answered or submitted.
    const [viewOnly, setViewOnly] = useState(false);

    const initialTimeRef = useRef<number | null>(null);
    const fiveMinPlayedRef = useRef(false);
    const twoMinPlayedRef = useRef(false);

    const fiveMinAudioRef = useRef<HTMLAudioElement | null>(null);
    const twoMinAudioRef = useRef<HTMLAudioElement | null>(null);


    useEffect(() => {
        fiveMinAudioRef.current = new Audio(FiveMinAudio);
        twoMinAudioRef.current = new Audio(TwoMinAudio);
    }, []);


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
        // Window has not opened. Seed nothing — no timer, no saved progress —
        // so a direct URL visit cannot start an attempt early.
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

        const parsed = JSON.parse(saved);
        const index = parsed.currentQuestionIndex ?? 0;

        setAttendedQuestion(parsed.attendedQuestion || []);
        setCurrentIndex(index);
        setCurrentQuestion(data.data[index]);

        const diff = Date.now() - parsed.lastUpdated;
        setTimeLeft(Math.max(parsed.timeLeft - diff, 0));
    }, [data, STORAGE_KEY, dispatch, navigate]);


    useEffect(() => {
        if (timeLeft === undefined || timerPaused) return;

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                attendedQuestion,
                currentQuestionIndex: currentIndex,
                timeLeft,
                lastUpdated: Date.now(),
            })
        );
    }, [attendedQuestion, currentIndex, timeLeft, timerPaused, STORAGE_KEY]);


    useEffect(() => {
        if (timeLeft === undefined || timerPaused || timeLeft <= 0) return;

        const id = setInterval(
            () => setTimeLeft(t => Math.max((t ?? 0) - 1000, 0)),
            1000
        );

        return () => clearInterval(id);
        // timeLeft intentionally excluded — functional update keeps the callback fresh.
        // timeLeft !== undefined triggers this once when the timer is first initialized.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerPaused, timeLeft !== undefined]);


    useEffect(() => {
        if (timeLeft === undefined || timerPaused) return;

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
    }, [timeLeft, timerPaused]);


    useEffect(() => {
        if (timeLeft === 0 && !timerPaused) {
            setTimerPaused(true);
            // Only auto-submit a live attempt. A test opened after its window
            // closed has nothing to submit.
            if (!viewOnly) {
                handleSubmit("timer");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, timerPaused, viewOnly]);


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

    const handleSubmit = async (type: SubmissionType) => {
        console.log(type);
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


    const isReady = !!data && !isLoading && !isFetching;
    const isMCQ = data?.overview?.test_type === "mcq";
    // The card gates the Start button, but this route is reachable by URL, so the
    // start window has to be enforced here too.
    const notStarted = isReady && isTestNotStarted(data?.overview);
    const questions = data?.data ?? [];
    // Answering is locked either because the test window closed before the
    // attempt started (viewOnly) or because the timer just ran out.
    const isLocked = viewOnly || timeLeft === 0;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === questions.length - 1;



    if (!isReady) {
        return (
            <div className="single__test__wrapper">
                <HeaderSkeleton />
                <Divider className="my-4!" />
                <div className="flex flex-col gap-6 w-full">
                    <SidebarSkeleton />
                    <QuestionSkeleton />
                </div>
            </div>
        );
    }

    if (notStarted) {
        return (
            <div className="single__test__wrapper">
                <Button startIcon={<ArrowLeft />} onClick={() => navigate(exitPath)}>
                    Back to Test
                </Button>

                <Divider className="my-4!" />

                <Box
                    className="flex items-start gap-2 rounded-lg p-3"
                    sx={{
                        bgcolor: "warning.light",
                        border: "1px solid",
                        borderColor: "warning.main",
                        color: "warning.main",
                    }}
                >
                    <Lock variant="Bold" size={18} />
                    <div>
                        <Typography variant="subtitle2" fontWeight={600} color="warning.main">
                            This test has not started yet
                            {data?.overview?.start_datetime
                                ? ` — it opens on ${formatDateTime(data.overview.start_datetime)}`
                                : ""}
                        </Typography>
                        <Typography variant="caption" color="warning.main">
                            The questions become available once the scheduled start time
                            arrives. Please come back then.
                        </Typography>
                    </div>
                </Box>
            </div>
        );
    }

    if (!isMCQ) {
        return (
            <div className="subject__test_view h-full flex flex-col overflow-hidden">
                <WaterMark />
                <div className="text-left">
                    <Button startIcon={<ArrowLeft />} onClick={() => navigate(-1)}>
                        Back to Test
                    </Button>
                </div>

                <Divider className="my-4!" />
                <div className="mb-4">
                    <TabController
                        currentActive={activeTab}
                        setActiveTab={setActiveTab}
                        options={[
                            { label: "Questions", value: "questions" },
                            { label: "Feedback", value: "feedback" }
                        ]}
                    />
                </div>
                {
                    activeTab === "questions" ? !questions.length ? <EmptyList title="No Questions Found" description="No Questions added to this test yet!" /> : <Box className="h-full overflow-auto">
                        {questions.map((q, index) => (
                            <Box key={q.question} className="flex gap-4 mb-4">
                                <Typography>{index + 1}.</Typography>
                                <Typography variant="h6">
                                    {renderHtml(q.question)}
                                </Typography>
                            </Box>
                        ))}
                    </Box> : ""
                }
                {activeTab === "feedback" ? <TestSample id={Number(testId)} /> : ""}
            </div>
        );
    }

    return (
        <div className="single__test__wrapper overflow-auto">
            <Button
                startIcon={<ArrowLeft />}
                onClick={() => (viewOnly ? navigate(exitPath) : setCancelModal(true))}
            >
                Back to Test
            </Button>

            <Divider className="my-4!" />

            {viewOnly && (
                <Box
                    className="flex items-start gap-2 rounded-lg p-3 mb-6"
                    sx={{
                        bgcolor: "error.light",
                        border: "1px solid",
                        borderColor: "error.main",
                        color: "error.main",
                    }}
                >
                    <Lock variant="Bold" size={18} />
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

            <QuestionListView
                timeLeft={timeLeft}
                initialTime={initialTimeRef.current ?? undefined}
                questions={questions}
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentIndex}
                totalQuestions={questions.length}
                setCurrentQuestion={setCurrentQuestion}
                setCurrentQuestionIndex={setCurrentIndex}
                attendedQuestion={attendedQuestion}
            />

            <QuestionView
                currentQuestion={currentQuestion}
                attendedQuestion={attendedQuestion}
                setAttendedQuestion={handleAnswer}
                disabled={isLocked}
            />

            <div className="flex justify-between my-6">
                <Button
                    disabled={isFirst}
                    onClick={() => {
                        const next = currentIndex - 1;
                        setCurrentIndex(next);
                        setCurrentQuestion(questions[next]);
                    }}
                >
                    Previous
                </Button>

                <Button
                    variant="contained"
                    onClick={() =>
                        isLast
                            ? !isLocked && setSubmitModal({ open: true, type: "submit" })
                            : (() => {
                                const next = currentIndex + 1;
                                setCurrentIndex(next);
                                setCurrentQuestion(questions[next]);
                            })()
                    }
                    disabled={isLast && isLocked}
                >
                    {isLast ? (viewOnly ? "Test Expired" : "Submit") : "Next"}
                </Button>
            </div>

            <TestSubmissionDialog
                open={submitModal.open}
                handleClose={() =>
                    setSubmitModal({ open: false, type: "submit" })
                }
                onSubmit={() => handleSubmit(submitModal.type)}
                type={submitModal.type}
                loading={submitting}
            />

            <TestCancelDialog
                open={cancelModal}
                handleClose={() => setCancelModal(false)}
                onSubmit={() => navigate(PATH.TEST.ROOT)}
            />

            <TestResultDialog
                open={resultOpen}
                result={result}
                onReview={() => {
                    localStorage.removeItem(RESULT_KEY);
                    navigate(reviewPath);
                }}
                onBack={() => {
                    localStorage.removeItem(RESULT_KEY);
                    navigate(exitPath);
                }}
            />
        </div>
    );
}