import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { requestDocumentFullscreen } from "../../../hooks/useFullscreen";
import { PATH } from "../../../routes/PATH";
import { setPurchase } from "../../../slice/purchaseSlice";
import { openTest } from "../../../slice/testRunnerSlice";
import type { TestProps } from "../../../types/question";
import { formatDateTime } from "../../../utils/dateFormat";
import {
    COUNTDOWN_WINDOW_MS,
    formatCountdown,
    msUntilTestStart,
} from "../../../utils/testSchedule";


const TestActionButton = ({ test, havePurchased, id, isExpired: isExpiredProp }: { test: TestProps, status?: any; havePurchased: boolean; id?: number; isExpired?: boolean }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Milliseconds until the test opens; null once it is open (or unscheduled).
    // Seeded synchronously so the very first paint is already gated — deriving
    // it in the effect alone left the enabled button clickable for one frame.
    const [msToStart, setMsToStart] = useState<number | null>(() =>
        msUntilTestStart(test)
    );

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        // Ticks once a second while the countdown is on screen; further out it
        // just naps until the countdown window opens, so a page full of cards
        // scheduled weeks ahead does not re-render every second. Either way the
        // button unlocks on its own the moment the start time passes.
        const schedule = () => {
            const diff = msUntilTestStart(test);
            setMsToStart(diff);
            if (diff === null) return;

            const delay =
                diff <= COUNTDOWN_WINDOW_MS
                    ? 1000
                    : Math.min(diff - COUNTDOWN_WINDOW_MS, 60 * 60 * 1000);

            timer = setTimeout(schedule, delay);
        };

        schedule();

        return () => clearTimeout(timer);
    }, [test.start_datetime, test.is_scheduled]);

    const handleStartOrRetake = () => {
        if (!havePurchased) {
            dispatch(setPurchase({ courseId: Number(id), open: true }));
            return;
        }

        if (test.test_type === "mcq") {
            // This click is the only user gesture the browser will accept a
            // full-screen request from, so it is spent here rather than a moment
            // later on the test screen. Deliberately not awaited, so the request
            // and the dispatch stay in the same tick as the gesture.
            void requestDocumentFullscreen();
            dispatch(openTest({
                testId: Number(test?.id),
                courseId: id ? Number(id) : undefined,
            }));
            return;
        }

        let path;

        if (id) {
            path = PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.SUBJECTIVE_TEST.ROOT({
                courseId: Number(id),
                testId: Number(test?.id),
            });
        } else {
            path = PATH.TEST.VIEW_TEST.SUBJECTIVE_TEST.ROOT({
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


    const isExpired = !!test.has_expired || !!isExpiredProp;

    if (test.has_taken_test) {
        // A closed test can't be retaken, only reviewed.
        if (test.is_scheduled || isExpired) {
            return (
                <Button variant="outlined" color="primary" onClick={handleViewResult}>
                    {test.is_graded ? "View Result" : "Result Pending"}
                </Button>
            )
        }
        else {
            return (
                <Stack flexDirection={"column"} gap={1}>
                    <Button variant="contained" color="primary" onClick={handleStartOrRetake}>
                        Retake Test
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleViewResult}>
                        View Result
                    </Button>
                </Stack>
            )
        }
    }


    if (isExpired) {
        return (
            <Button
                variant="outlined"
                color="primary"
                // Reading a closed paper is not sitting it, so this one opens the
                // runner without taking the screen full.
                onClick={() => dispatch(openTest({
                    testId: Number(test?.id),
                    courseId: id ? Number(id) : undefined,
                }))}
            >
                View Questions
            </Button>
        )
    }

    // Scheduled and not open yet. Gate on the clock alone — the countdown window
    // only decides which label to show, never whether the test can be started.
    if (msToStart !== null) {
        return (
            <Button variant="contained" color="primary" disabled>
                {msToStart <= COUNTDOWN_WINDOW_MS
                    ? `Starts in ${formatCountdown(msToStart)}`
                    : `Test Starts at ${formatDateTime(test.start_datetime)}`}
            </Button>
        );
    }

    return <Button variant="contained" color="primary" onClick={handleStartOrRetake}>
        Start Now
    </Button>;
};

export default TestActionButton;
