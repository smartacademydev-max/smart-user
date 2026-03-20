import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import type { OptionProps, QuestionProps } from "../../../types/question";

// ─── Static quiz data ────────────────────────────────────────────────────────
// Replace with API call (e.g. GET /daily-quiz) when the endpoint is ready.
// Shape matches QuestionProps from src/types/question.ts
const DAILY_QUIZ: QuestionProps = {
    id: 1,
    points: 1,
    question_type: "mcq",
    megacategory_id: null,
    question: "नेपाल राष्ट्र बैंकको स्थापना कुन वर्षमा भएको थियो?",
    options: [
        { id: 1, option: "A.  2013 BS", is_correct: false },
        { id: 2, option: "B.  2016 BS", is_correct: false },
        { id: 3, option: "C.  2022 BS", is_correct: true },
        { id: 4, option: "D.  2025 BS", is_correct: false },
    ],
};
const QUIZ_CATEGORY = "Economics";

// ─── Streak helpers (localStorage) ───────────────────────────────────────────
const STREAK_KEY = "dq_streak";
const DATE_KEY = "dq_last_date";

function readStreak(): number {
    return parseInt(localStorage.getItem(STREAK_KEY) ?? "0", 10);
}

function bumpStreak(): number {
    const today = new Date().toDateString();
    const last = localStorage.getItem(DATE_KEY);
    if (last === today) return readStreak(); // already answered today
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    const next = last === yesterday ? readStreak() + 1 : 1;
    localStorage.setItem(STREAK_KEY, String(next));
    localStorage.setItem(DATE_KEY, today);
    return next;
}

function alreadyAnsweredToday(): boolean {
    return localStorage.getItem(DATE_KEY) === new Date().toDateString();
}

// ─── Option button ────────────────────────────────────────────────────────────
function QuizOption({
    option,
    answered,
    selectedId,
    onSelect,
}: {
    option: OptionProps;
    answered: boolean;
    selectedId: number | null;
    onSelect: (o: OptionProps) => void;
}) {
    const theme = useTheme();

    // Compute state-driven styles after answering
    let bg = "rgba(255,255,255,0.08)";
    let border = "1px solid rgba(255,255,255,0.18)";
    let color = "rgba(255,255,255,0.88)";
    let fontWeight: number = 500;
    let cursor = "pointer";

    if (answered) {
        cursor = "default";
        if (option.is_correct) {
            bg = theme.palette.success.light;
            border = `1.5px solid ${theme.palette.success.main}`;
            color = theme.palette.success.main;
            fontWeight = 700;
        } else if (option.id === selectedId) {
            bg = theme.palette.error.light;
            border = `1.5px solid ${theme.palette.error.main}`;
            color = theme.palette.error.main;
            fontWeight = 600;
        } else {
            bg = "rgba(255,255,255,0.04)";
            color = "rgba(255,255,255,0.35)";
            border = "1px solid rgba(255,255,255,0.08)";
        }
    }

    return (
        <Box
            component="button"
            onClick={() => !answered && onSelect(option)}
            sx={{
                width: "100%",
                textAlign: "left",
                fontFamily: theme.typography.fontFamily,
                fontSize: "13px",
                fontWeight,
                px: 1.75,
                py: 1,
                border,
                borderRadius: 1.5,
                color,
                bgcolor: bg,
                cursor,
                transition: "all 0.18s",
                outline: "none",
                "&:hover": !answered
                    ? { bgcolor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.38)" }
                    : {},
            }}
        >
            {option.option}
        </Box>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DashboardDailyQuiz() {
    const theme = useTheme();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [skipped, setSkipped] = useState(false);
    const [streak, setStreak] = useState(readStreak());

    useEffect(() => {
        if (alreadyAnsweredToday()) setAnswered(true);
    }, []);

    const handleSelect = (option: OptionProps) => {
        if (answered || option.id === null) return;
        setSelectedId(option.id);
        setAnswered(true);
        setStreak(bumpStreak());
    };

    if (skipped) return null;

    const navyMid = "#2D3F6F"; // mid-stop between secondary.main and secondary.light

    return (
        <Box>
            {/* ── Section header ── */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: "14.5px" }}>
                    Daily Quiz
                </Typography>
                <Box component="span" sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                    bgcolor: theme.palette.info.light,
                    color: theme.palette.info.main,
                    px: "10px",
                    py: "3px",
                    borderRadius: "99px",
                    border: `1px solid ${theme.palette.info.main}`,
                }}>
                    Today's Challenge
                </Box>
            </Box>

            {/* ── Streak stat bar ── */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                mb: 1.5,
            }}>
                <Box sx={{
                    p: "13px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    bgcolor: "background.paper",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                }}>
                    <Box sx={{
                        width: 38, height: 38, borderRadius: 1.5, flexShrink: 0,
                        bgcolor: theme.palette.info.light,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "20px",
                    }}>
                        🔥
                    </Box>
                    <Box>
                        <Typography fontWeight={800} sx={{ fontSize: "18px", lineHeight: 1, color: theme.palette.info.main }}>
                            {streak}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: "2px", display: "block" }}>
                            Day Streak
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{
                    p: "13px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    bgcolor: "background.paper",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                }}>
                    <Box sx={{
                        width: 38, height: 38, borderRadius: 1.5, flexShrink: 0,
                        bgcolor: theme.palette.success.light,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px",
                    }}>
                        ✅
                    </Box>
                    <Box>
                        <Typography fontWeight={800} sx={{ fontSize: "18px", lineHeight: 1, color: theme.palette.success.main }}>
                            {answered ? "Done" : "—"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: "2px", display: "block" }}>
                            Today's Quiz
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{
                    p: "13px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    bgcolor: "background.paper",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                }}>
                    <Box sx={{
                        width: 38, height: 38, borderRadius: 1.5, flexShrink: 0,
                        bgcolor: theme.palette.primary.light,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px",
                    }}>
                        🏆
                    </Box>
                    <Box>
                        <Typography fontWeight={800} sx={{ fontSize: "18px", lineHeight: 1, color: theme.palette.primary.main }}>
                            {streak > 0 ? `${streak}×` : "0×"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: "2px", display: "block" }}>
                            Best Streak
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* ── Quiz card ── */}
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 60%, ${navyMid} 100%)`,
                borderRadius: 2,
                p: 2.5,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-40px", right: "-40px",
                    width: "140px", height: "140px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                    pointerEvents: "none",
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-28px", left: "38%",
                    width: "110px", height: "110px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.03)",
                    pointerEvents: "none",
                },
            }}>
                {/* Category label */}
                <Typography variant="caption" sx={{
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    display: "block",
                    mb: 1,
                }}>
                    Daily Quiz · {QUIZ_CATEGORY}
                </Typography>

                {/* Question */}
                <Typography variant="subtitle1" fontWeight={600} sx={{
                    color: "#fff",
                    lineHeight: 1.55,
                    mb: 2,
                }}>
                    {DAILY_QUIZ.question}
                </Typography>

                {/* Options */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", mb: 2 }}>
                    {DAILY_QUIZ.options.map((option) => (
                        <QuizOption
                            key={option.id}
                            option={option}
                            answered={answered}
                            selectedId={selectedId}
                            onSelect={handleSelect}
                        />
                    ))}
                </Box>

                {/* Bottom row: result message or streak + skip */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {answered ? (
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
                            {selectedId !== null && DAILY_QUIZ.options.find(o => o.id === selectedId)?.is_correct
                                ? "🎉 Correct! Come back tomorrow."
                                : "Nice try! Come back tomorrow for the next one."}
                        </Typography>
                    ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <Typography sx={{ fontSize: "15px" }}>🔥</Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                                {streak}-day streak
                            </Typography>
                        </Box>
                    )}

                    {!answered && (
                        <Box
                            component="button"
                            onClick={() => setSkipped(true)}
                            sx={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "rgba(255,255,255,0.45)",
                                fontFamily: theme.typography.fontFamily,
                                fontSize: "12px",
                                fontWeight: 500,
                                p: 0,
                                "&:hover": { color: "rgba(255,255,255,0.8)" },
                                transition: "color 0.15s",
                            }}
                        >
                            Skip →
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
