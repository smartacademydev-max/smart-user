import { Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { isAnswered } from "../../../types/question";
import type { Answers, QuestionProps } from "../../../types/question";

interface Props {
    questions: QuestionProps[];
    currentQuestion: QuestionProps | null;
    setCurrentQuestion: (newValue: QuestionProps) => void;
    setCurrentQuestionIndex: (newValue: number) => void;
    attendedQuestion: Answers[];
}

export default function QuestionSlider({
    questions,
    currentQuestion,
    setCurrentQuestion,
    setCurrentQuestionIndex,
    attendedQuestion
}: Props) {
    const theme = useTheme();
    const containerRef = useRef<HTMLUListElement>(null);
    const buttonRefs = useRef<(HTMLLIElement | null)[]>([]);
    const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

    const isCurrent = (question: QuestionProps) => {
        return currentQuestion?.id === question.id;
    };

    const isAttended = (question: QuestionProps) => {
        return attendedQuestion.some(
            (q) => q.question_id === question.id && isAnswered(q)
        );
    };

    // Calculate drag constraints
    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            const maxScroll = container.scrollWidth - container.clientWidth;
            setDragConstraints({ left: -maxScroll, right: 0 });
        }
    }, [questions]);

    // Scroll to current question when it changes
    useEffect(() => {
        const currentIndex = questions.findIndex(
            (q) => q.id === currentQuestion?.id
        );

        if (currentIndex === -1 || !containerRef.current) return;

        const currentButton = buttonRefs.current[currentIndex];
        if (!currentButton) return;

        const container = containerRef.current;
        const buttonRect = currentButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Check if button is out of view
        const isOutOfView =
            buttonRect.left < containerRect.left ||
            buttonRect.right > containerRect.right;

        if (isOutOfView) {
            // Calculate scroll position to center the button
            const scrollLeft =
                currentButton.offsetLeft -
                container.offsetWidth / 2 +
                currentButton.offsetWidth / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: "smooth"
            });
        }
    }, [currentQuestion, questions]);

    return (
        <div className="flex items-center">
            <motion.ul
                ref={containerRef}
                className="flex w-full overflow-x-auto gap-2 mt-5.5 mb-8 scrollbar-hide cursor-grab active:cursor-grabbing"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={dragConstraints}
                dragElastic={0.1}
                dragMomentum={false}
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {questions.map((question, index) => (
                    <motion.li
                        key={question.id}
                        ref={(el: HTMLLIElement | null) => {
                            buttonRefs.current[index] = el;
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ flexShrink: 0 }}
                    >
                        <Button
                            sx={{
                                padding: 0,
                                background: isCurrent(question)
                                    ? "#0EA5E9"
                                    : isAttended(question)
                                        ? theme.palette.icon.dark
                                        : theme.palette.separator.darkest,
                                color: theme.palette.primary.contrastText,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: isCurrent(question)
                                        ? "#0284C7"
                                        : isAttended(question)
                                            ? theme.palette.icon.dark
                                            : theme.palette.separator.dark,
                                },
                                pointerEvents: "auto"
                            }}
                            className="flex justify-center items-center min-w-12! max-w-12! h-12! aspect-square! rounded-full!"
                            onClick={() => {
                                setCurrentQuestion(question);
                                setCurrentQuestionIndex(index);
                            }}
                        >
                            {index + 1}
                        </Button>
                    </motion.li>
                ))}
            </motion.ul>
            <Button
                sx={{
                    padding: 0,
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    transition: "all 0.3s ease",

                    pointerEvents: "auto"
                }}
                className="flex justify-center items-center min-w-12! max-w-12! h-12! aspect-square! rounded-full!"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="#303188" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Button>
        </div>
    );
}