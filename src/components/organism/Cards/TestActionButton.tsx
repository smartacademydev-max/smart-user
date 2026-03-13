import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import { setPurchase } from "../../../slice/purchaseSlice";
import type { TestProps } from "../../../types/question";
import { formatDateTime } from "../../../utils/dateFormat";


const TestActionButton = ({ test, havePurchased, id }: { test: TestProps, status?: any; havePurchased: boolean; id: number }) => {


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!test.is_scheduled) return;

        const startTime = new Date(test.start_datetime).getTime();
        const now = Date.now();
        const diff = startTime - now;

        // Only start countdown if less than 24 hours
        if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
            setTimeLeft(diff);

            const interval = setInterval(() => {
                const newDiff = startTime - Date.now();

                if (newDiff <= 0) {
                    clearInterval(interval);
                    setTimeLeft(null);
                } else {
                    setTimeLeft(newDiff);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [test.start_datetime, test.is_scheduled]);

    const formatCountdown = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h ${minutes}m ${seconds}s`;
    };


    const handleStartOrRetake = () => {
        if (!havePurchased) {
            dispatch(setPurchase({ courseId: Number(id), open: true }));
            return;
        }

        let path;

        if (id) {
            path =
                test.test_type === "mcq"
                    ? PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.ROOT({
                        courseId: Number(id),
                        testId: Number(test?.id),
                    })
                    : PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.SUBJECTIVE_TEST.ROOT({
                        courseId: Number(id),
                        testId: Number(test?.id),
                    });
        } else {
            // standalone test
            path =
                test.test_type === "mcq"
                    ? PATH.TEST.VIEW_TEST.ROOT({
                        testId: Number(test?.id),
                    })
                    : PATH.TEST.VIEW_TEST.SUBJECTIVE_TEST.ROOT({
                        testId: Number(test?.id),
                    });
        }

        navigate(path);
    };

    const handleViewResult = () => {
        let path;

        if (id) {
            path =
                test.test_type === "mcq"
                    ? PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.REVIEW_TEST.ROOT({
                        courseId: Number(id),
                        testId: Number(test?.id),
                    })
                    : PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.REVIEW_TEST.REVIEW_SUBJECTIVE_TEST.ROOT({
                        courseId: Number(id),
                        testId: Number(test?.id),
                    });
        } else {
            path =
                test.test_type === "mcq"
                    ? PATH.TEST.VIEW_TEST.REVIEW_TEST.ROOT({
                        testId: Number(test?.id),
                    })
                    : PATH.TEST.VIEW_TEST.REVIEW_TEST.REVIEW_SUBJECTIVE_TEST.ROOT({
                        testId: Number(test?.id),
                    });
        }

        navigate(path);
    };


    if (test.has_taken_test) {
        if (test.is_scheduled) {
            return (
                <Button variant="outlined" color="primary" fullWidth onClick={handleViewResult}>
                    {test.is_graded ? "View Result" : "Result Pending"}
                </Button>
            )
        }
        else {
            return (
                <Stack flexDirection={"column"} gap={1}>
                    <Button variant="contained" color="primary" fullWidth onClick={handleStartOrRetake}>
                        Retake Test
                    </Button>
                    <Button variant="outlined" color="primary" fullWidth onClick={handleViewResult}>
                        View Result
                    </Button>
                </Stack>
            )
        }
    }


    if (test.has_expired && !test.has_taken_test) {
        return (
            <Button variant="contained" color="primary" fullWidth onClick={() => id ? navigate(PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.ROOT({
                courseId: Number(id),
                testId: Number(test?.id),
            })) : navigate(PATH.TEST.VIEW_TEST.ROOT({
                testId: Number(test?.id),
            }))}>
                View Questions
            </Button>
        )
    }

    if (test.is_scheduled) {
        const startTime = new Date(test.start_datetime).getTime();
        const initialDiff = startTime - Date.now();

        const shouldShowCountdown =
            initialDiff > 0 && initialDiff <= 24 * 60 * 60 * 1000;

        const hasStarted = !shouldShowCountdown || timeLeft === null || timeLeft <= 0;

        if (!hasStarted) {
            return (
                <Button variant="contained" color="primary" disabled fullWidth>
                    {timeLeft
                        ? `Starts in ${formatCountdown(timeLeft)}`
                        : `Test Starts at ${formatDateTime(test.start_datetime)}`
                    }
                </Button>
            );
        }
    }

    return <Button variant="contained" color="primary" fullWidth onClick={handleStartOrRetake}>
        Start Test
    </Button>;
};

export default TestActionButton;
