import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useGetTestByIdQuery, useSubmitMcqMutation } from "../../../../services/testApi";

export default function QuizTaking() {
    const { courseId, quizId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const numCourseId = Number(courseId);
    const numQuizId = Number(quizId);

    const { data, isLoading } = useGetTestByIdQuery({ courseId: numCourseId, testId: numQuizId });
    const [submitMcq, { isLoading: submitting }] = useSubmitMcqMutation();

    const questions = data?.data ?? [];
    const overview = data?.overview;

    const [answers, setAnswers] = useState<Record<number, number | null>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    // Timer
    useEffect(() => {
        if (overview?.time) setTimeLeft(overview.time * 60);
    }, [overview]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const t = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const handleSelect = (questionId: number, optionId: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        setShowSubmitDialog(false);
        const payload = {
            answers: questions.map((q) => ({
                question_id: q.id!,
                option_id: answers[q.id!] ?? null,
            })),
            time_taken: (overview?.time ?? 0) * 60 - timeLeft,
        };
        try {
            await submitMcq({ courseId: numCourseId, testId: numQuizId, body: payload }).unwrap();
            navigate(PATH.LEARNING_CANVAS.QUIZ.REVIEW.ROOT(numCourseId, numQuizId));
        } catch {
            // Error handling
        }
    };

    if (isLoading) {
        return <div className="h-64 flex items-center justify-center"><CircularProgress /></div>;
    }

    return (
        <div className="h-full overflow-auto">
            {/* Header */}
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, bgcolor: "background.default", zIndex: 10 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button variant="text" size="small" onClick={() => navigate(-1)} sx={{ textTransform: "none" }}>
                        ← Back
                    </Button>
                    <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{overview?.name || "Quiz"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        Due: {overview?.end_datetime ? new Date(overview.end_datetime).toLocaleDateString() : "—"}
                    </Typography>
                    <Box sx={{ bgcolor: "error.light", px: 2, py: 0.5, borderRadius: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: "error.main" }}>
                            {formatTime(timeLeft)}
                        </Typography>
                    </Box>
                    <Button variant="contained" size="small">Full Screen</Button>
                </Box>
            </Box>

            {/* Questions */}
            <Box sx={{ maxWidth: 800, mx: "auto", px: 3, py: 4 }}>
                {questions.map((q, idx) => (
                    <Box key={q.id} sx={{ mb: 4, pb: 3, borderBottom: idx < questions.length - 1 ? `1px solid ${theme.palette.divider}` : "none" }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2 }}>
                            {idx + 1}. {q.question}
                        </Typography>
                        <RadioGroup value={answers[q.id!] ?? ""} onChange={(e) => handleSelect(q.id!, Number(e.target.value))}>
                            {q.options.map((opt) => (
                                <FormControlLabel
                                    key={opt.id}
                                    value={opt.id}
                                    control={<Radio size="small" />}
                                    label={<Typography sx={{ fontSize: 13 }}>{opt.option}</Typography>}
                                    sx={{
                                        mb: 0.5, mx: 0, py: 0.5, px: 1.5, borderRadius: 1,
                                        border: `1px solid ${answers[q.id!] === opt.id ? theme.palette.primary.main : "transparent"}`,
                                        bgcolor: answers[q.id!] === opt.id ? "primary.light" : "transparent",
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                ))}

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={() => setShowSubmitDialog(true)} disabled={submitting}>
                        Submit
                    </Button>
                    <Button variant="outlined">Save as Draft</Button>
                </Box>
            </Box>

            {/* Submit confirmation dialog */}
            <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
                <DialogTitle sx={{ textAlign: "center", pt: 4 }}>
                    <Typography sx={{ fontSize: 40, mb: 1 }}>✓</Typography>
                    Are you sure you want to submit?
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ textAlign: "center", color: "text.secondary", fontSize: 13 }}>
                        Will take some time to review for your result.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Submit Quiz</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
