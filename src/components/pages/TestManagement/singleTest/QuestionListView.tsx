import {
    Box,
    Button,
    ClickAwayListener,
    Divider,
    Grow,
    IconButton,
    Paper,
    Popper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { Timer1 } from "iconsax-reactjs";
import { useRef, useState } from "react";
import type { Answers, QuestionProps } from "../../../../types/question";

interface Props {
    timeLeft?: number;
    initialTime?: number;
    questions: QuestionProps[];
    currentQuestion: QuestionProps | null;
    currentQuestionIndex: number;
    totalQuestions: number;
    setCurrentQuestion: (newValue: QuestionProps) => void;
    attendedQuestion: Answers[];
    setCurrentQuestionIndex: (newValue: number) => void;
}

export default function QuestionListView({
    timeLeft,
    initialTime,
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    setCurrentQuestion,
    attendedQuestion,
    setCurrentQuestionIndex
}: Props) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    // Responsive visible questions count
    const isXs = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600-900px
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900-1200px

    const visibleQuestions = isXs ? 8 : isSm ? 10 : isMd ? 13 : 25;
    const hasMoreQuestions = questions.length > visibleQuestions;

    const isCurrent = (question: QuestionProps) => {
        return currentQuestion?.id === question.id;
    };

    const isAttended = (question: QuestionProps) => {
        return attendedQuestion.some(
            (q) => q.question_id === question.id && q.option_id !== null
        );
    };

    const formatTime = (ms: number | undefined) => {
        if (ms === undefined) return "--:--";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const getTimerColor = () => {
        const fiveMinutesInMs = 5 * 60 * 1000; // 300000ms

        if (timeLeft !== undefined && timeLeft <= fiveMinutesInMs) {
            return {
                bg: "rgba(255, 200, 200, 0.2)",
                border: "rgb(255, 80, 80)",
                color: "rgb(255, 50, 50)",
            };
        }

        return {
            bg: theme.palette.success.light,
            border: theme.palette.success.main,
            color: theme.palette.success.main,
        };
    };

    const timerColors = getTimerColor();

    const handleToggle = () => setOpen((prev) => !prev);

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        setOpen(false);
    };

    const handleQuestionClick = (question: QuestionProps, index: number) => {
        setCurrentQuestion(question);
        setCurrentQuestionIndex(index);
        setOpen(false);
    };

    return (
        <>
            <Box className="flex justify-between items-center">
                <Typography
                    color="text.dark"
                    variant="subtitle1"
                    sx={{
                        position: "relative",
                        display: "inline-block",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: "-2px",
                            height: "2px",
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                    fontWeight={600}
                >
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </Typography>

                {initialTime !== undefined && (
                    <Typography
                        className="py-1.5 px-3 rounded-2xl flex gap-1 items-center"
                        sx={{
                            background: timerColors.bg,
                            color: timerColors.color,
                            border: `1px solid ${timerColors.border}`,
                            fontWeight: 600,
                            transition: "all 0.4s ease",
                        }}
                    >
                        <Timer1 variant="Bold" />
                        {formatTime(timeLeft)} mins
                    </Typography>
                )}
            </Box>

            {/* Question Navigation */}
            <Box className="flex items-center gap-2 mt-5.5 mb-8">
                <Box className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide">
                    {questions.slice(0, visibleQuestions).map((question, index) => (
                        <Button
                            key={question.id}
                            sx={{
                                padding: 0,
                                minWidth: "48px",
                                maxWidth: "48px",
                                height: "48px",
                                flexShrink: 0,
                                background: isCurrent(question)
                                    ? "#0EA5E9"
                                    : isAttended(question)
                                        ? theme.palette.icon.dark
                                        : theme.palette.separator.darkest,
                                color: theme.palette.primary.contrastText,
                                transition: "all 0.3s ease",
                                borderRadius: "50%",
                                "&:hover": {
                                    background: isCurrent(question)
                                        ? "#0284C7"
                                        : isAttended(question)
                                            ? theme.palette.icon.dark
                                            : theme.palette.separator.dark,
                                },
                            }}
                            onClick={() => handleQuestionClick(question, index)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </Box>

                {hasMoreQuestions && (
                    <>
                        <Button
                            ref={anchorRef}
                            onClick={handleToggle}
                            sx={{
                                padding: 0,
                                minWidth: "48px",
                                maxWidth: "48px",
                                height: "48px",
                                flexShrink: 0,
                                background: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                transition: "all 0.3s ease",
                                borderRadius: "50%",
                                "&:hover": {
                                    background: theme.palette.primary.main,
                                },
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14 2V8H20M16 13H8M16 17H8M10 9H8M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Button>

                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            placement="bottom-end"
                            disablePortal
                            sx={{ zIndex: 1300 }}
                        >
                            {({ TransitionProps }) => (
                                <Grow {...TransitionProps}>
                                    <Paper
                                        elevation={8}
                                        sx={{
                                            maxWidth: { xs: "320px", sm: "400px", md: "671px" },
                                            maxHeight: "700px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <Box sx={{ p: 3 }}>
                                                <div className="flex justify-between items-center">
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        sx={{ mb: 2, color: theme.palette.text.primary }}
                                                    >
                                                        All Questions
                                                    </Typography>

                                                    <IconButton>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="#EF4444" />
                                                        </svg>
                                                    </IconButton>
                                                </div>
                                                <Divider className="mt-2! mb-5!" />

                                                <Box className="flex gap-2 flex-wrap">
                                                    {questions.map((question, index) => (
                                                        <Button
                                                            key={question.id}
                                                            sx={{
                                                                padding: 0,
                                                                minWidth: "48px",
                                                                maxWidth: "48px",
                                                                height: "48px",
                                                                background: isCurrent(question)
                                                                    ? "#0EA5E9"
                                                                    : isAttended(question)
                                                                        ? theme.palette.icon.dark
                                                                        : theme.palette.separator.darkest,
                                                                color: theme.palette.primary.contrastText,
                                                                transition: "all 0.3s ease",
                                                                borderRadius: "50%",
                                                                "&:hover": {
                                                                    background: isCurrent(question)
                                                                        ? "#0284C7"
                                                                        : isAttended(question)
                                                                            ? theme.palette.icon.dark
                                                                            : theme.palette.separator.dark,
                                                                },
                                                            }}
                                                            onClick={() => handleQuestionClick(question, index)}
                                                        >
                                                            {index + 1}
                                                        </Button>
                                                    ))}
                                                </Box>

                                                {/* Legend */}
                                                <Stack
                                                    sx={{
                                                        mt: 2,
                                                        pt: 2,
                                                        borderTop: `1px solid ${theme.palette.divider}`
                                                    }}
                                                    gap={2}
                                                    alignItems={"center"}
                                                >
                                                    <Box className="flex items-center gap-3">
                                                        <Box
                                                            sx={{
                                                                width: "24px",
                                                                height: "24px",
                                                                borderRadius: "4px",
                                                                background: theme.palette.icon.dark
                                                            }}
                                                        />
                                                        <Typography variant="subtitle1" color="text.secondary">
                                                            Attended Questions
                                                        </Typography>
                                                    </Box>
                                                    <Box className="flex items-center gap-3">
                                                        <Box
                                                            sx={{
                                                                width: "24px",
                                                                height: "24px",
                                                                borderRadius: "4px",
                                                                background: theme.palette.separator.darkest
                                                            }}
                                                        />
                                                        <Typography variant="subtitle1" color="text.secondary">
                                                            Not Attended
                                                        </Typography>
                                                    </Box>
                                                    <Box className="flex items-center gap-3">
                                                        <Box
                                                            sx={{
                                                                width: "24px",
                                                                height: "24px",
                                                                borderRadius: "4px",
                                                                background: "#0EA5E9"
                                                            }}
                                                        />
                                                        <Typography variant="subtitle1" color="text.secondary">
                                                            Current Question
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </>
                )}
            </Box>
        </>
    );
}