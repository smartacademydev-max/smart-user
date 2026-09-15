import { Box, IconButton, Typography } from "@mui/material";
import { CloseCircle, Flag } from "iconsax-reactjs";

import type { QuestionProps } from "../../../../types/question";

import { useQuizTokens } from "./quizTokens";

interface NavigatorProps {
    questions: QuestionProps[];
    /** Ids of questions carrying an answer, in any format. */
    answered: Set<number>;
    flagged: Set<number>;
    currentId: number | null;
    onSelect: (question: QuestionProps, index: number) => void;
    /** The sheet is wider than the sidebar, so it fits more per row. */
    variant?: "sidebar" | "sheet";
}

/**
 * The whole paper at a glance: which questions are answered, which the student
 * marked to come back to, and where they are now. Answered is a solid fill
 * because it is the state being counted towards; the flag sits on the corner so
 * a question can be both at once.
 */
export function QuestionNavigator({
    questions,
    answered,
    flagged,
    currentId,
    onSelect,
    variant = "sidebar"
}: NavigatorProps) {
    const t = useQuizTokens();

    return (
        <Box>
            <Box
                className="grid gap-1.5"
                sx={{
                    gridTemplateColumns:
                        variant === "sheet"
                            ? { xs: "repeat(6, 1fr)", sm: "repeat(8, 1fr)" }
                            : "repeat(5, 1fr)"
                }}
            >
                {questions.map((question, index) => {
                    const id = question.id;
                    const isAnswered = id !== null && answered.has(id);
                    const isFlagged = id !== null && flagged.has(id);
                    const isCurrent = id !== null && currentId === id;

                    return (
                        <Box
                            key={id ?? index}
                            component="button"
                            type="button"
                            aria-current={isCurrent ? "step" : undefined}
                            aria-label={`Question ${index + 1}${isAnswered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}`}
                            onClick={() => onSelect(question, index)}
                            className="relative flex items-center justify-center rounded-lg tabular-nums"
                            sx={{
                                height: 38,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                border: "1px solid",
                                borderColor: isAnswered ? "transparent" : t.border,
                                backgroundColor: isAnswered ? t.primary : t.surface,
                                color: isAnswered ? t.primaryForeground : t.muted,
                                transition: "background-color .15s ease, border-color .15s ease, box-shadow .15s ease",
                                // A ring rather than another fill, so "where I am"
                                // never competes with "what I have answered".
                                boxShadow: isCurrent ? `0 0 0 2px ${t.surface}, 0 0 0 4px ${t.ring}` : "none",
                                "&:hover": {
                                    borderColor: isAnswered ? "transparent" : t.borderStrong
                                }
                            }}
                        >
                            {index + 1}
                            {isFlagged && (
                                <Box
                                    aria-hidden
                                    className="absolute"
                                    sx={{ top: -5, right: -5, lineHeight: 0 }}
                                >
                                    <Flag size={13} variant="Bold" color={t.accent} />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>

            <Box
                className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3"
                sx={{ borderTop: "1px solid", borderColor: t.border }}
            >
                <Legend swatch={<Swatch color={t.primary} />} label="Answered" />
                <Legend
                    swatch={<Swatch color={t.surface} borderColor={t.border} />}
                    label="Not answered"
                />
                <Legend
                    swatch={<Flag size={11} variant="Bold" color={t.accent} />}
                    label="Flagged"
                />
            </Box>
        </Box>
    );
}

function Swatch({ color, borderColor }: { color: string; borderColor?: string }) {
    return (
        <Box
            sx={{
                width: 11,
                height: 11,
                borderRadius: "3px",
                backgroundColor: color,
                border: borderColor ? `1px solid ${borderColor}` : "none"
            }}
        />
    );
}

function Legend({ swatch, label }: { swatch: React.ReactNode; label: string }) {
    const t = useQuizTokens();

    return (
        <Box className="flex items-center gap-1.5">
            {swatch}
            <Typography fontSize={11.5} sx={{ color: t.muted }}>
                {label}
            </Typography>
        </Box>
    );
}

interface SheetProps extends NavigatorProps {
    open: boolean;
    onClose: () => void;
}

/**
 * Below `lg` the sidebar is gone, so the same grid arrives from the bottom of
 * the screen instead. It lives inside the quiz root for the same reason the
 * gate does — a portal to `body` is invisible while the root is full screen.
 */
export function QuestionNavigatorSheet({ open, onClose, ...navigator }: SheetProps) {
    const t = useQuizTokens();

    if (!open) return null;

    return (
        <Box className="fixed inset-0 z-40" sx={{ display: { lg: "none" } }}>
            <Box
                aria-hidden
                onClick={onClose}
                className="absolute inset-0"
                sx={{
                    backgroundColor: "rgba(0,0,0,.45)",
                    animation: "quizFade .15s ease-out",
                    "@keyframes quizFade": { from: { opacity: 0 }, to: { opacity: 1 } }
                }}
            />

            <Box
                role="dialog"
                aria-modal="true"
                aria-label="Question navigator"
                className="absolute inset-x-0 bottom-0 p-5"
                sx={{
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    backgroundColor: t.surface,
                    borderTop: "1px solid",
                    borderColor: t.border,
                    maxHeight: "72vh",
                    overflowY: "auto",
                    animation: "quizSlideUp .18s ease-out",
                    "@keyframes quizSlideUp": {
                        from: { transform: "translateY(12px)", opacity: 0 },
                        to: { transform: "translateY(0)", opacity: 1 }
                    }
                }}
            >
                <Box className="mb-4 flex items-center justify-between">
                    <Typography fontSize={14} fontWeight={700} sx={{ color: t.foreground }}>
                        Questions
                    </Typography>
                    <IconButton aria-label="Close" size="small" onClick={onClose}>
                        <CloseCircle size={20} color={t.muted} />
                    </IconButton>
                </Box>

                <QuestionNavigator {...navigator} variant="sheet" />
            </Box>
        </Box>
    );
}
