import { Box, Button, Divider, Typography } from "@mui/material";
import { ArrowLeft } from "iconsax-reactjs";
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

import { renderHtml } from "../../../../utils/renderHtml";

import TestCancelDialog from "../../../organism/Dialog/TestCancelDialog";
import TestResultDialog from "../../../organism/Dialog/TestResultDialog";
import TestSubmissionDialog, {
    type SubmissionType,
} from "../../../organism/Dialog/TestSubmissionDialog";

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

    const numericCourseId = Number(courseId);
    const numericTestId = Number(testId);

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
        { skip: !numericCourseId || !numericTestId }
    );

    const [submitMcq, { isLoading: submitting }] =
        useSubmitMcqMutation();


    useEffect(() => {
        if (!data || data.overview?.test_type !== "mcq") return;

        const endTime = data.overview.end_datetime ? new Date(data.overview.end_datetime).getTime() : null;
        const currentTime = Date.now();
        const timeRemainingFromEnd = endTime ? Math.max(endTime - currentTime, 0) : null;

        if (timeRemainingFromEnd !== null && timeRemainingFromEnd <= 0) {
            dispatch(
                showToast({
                    message: "This test has already ended.",
                    severity: "error",
                })
            );
            localStorage.removeItem(STORAGE_KEY);
            navigate(PATH.TEST.ROOT);
            return;
        }

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
    }, [timeLeft, timerPaused]);


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
            handleSubmit("timer");
        }
    }, [timeLeft, timerPaused]);


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
    const questions = data?.data ?? [];

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

    if (!isMCQ) {
        return (
            <div className="subject__test_view h-full flex flex-col overflow-hidden">
                <Button startIcon={<ArrowLeft />} onClick={() => navigate(-1)}>
                    Back to Test
                </Button>

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
        <div className="single__test__wrapper">
            <Button startIcon={<ArrowLeft />} onClick={() => setCancelModal(true)}>
                Back to Test
            </Button>

            <Divider className="my-4!" />

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
                            ? setSubmitModal({ open: true, type: "submit" })
                            : (() => {
                                const next = currentIndex + 1;
                                setCurrentIndex(next);
                                setCurrentQuestion(questions[next]);
                            })()
                    }
                >
                    {isLast ? "Submit" : "Next"}
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
                onReview={() =>
                    navigate(
                        PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.REVIEW_TEST.ROOT({
                            courseId: numericCourseId,
                            testId: numericTestId,
                        })
                    )
                }
                onBack={() =>
                    navigate(
                        PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(
                            numericCourseId
                        )
                    )
                }
            />
        </div>
    );
}