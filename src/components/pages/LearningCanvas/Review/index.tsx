import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useReviewTestResultQuery } from "../../../../services/testApi";

export default function ReviewPage() {
    const { courseId, quizId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const numCourseId = Number(courseId);
    const numQuizId = Number(quizId);

    const { data, isLoading } = useReviewTestResultQuery({ courseId: numCourseId, testId: numQuizId });
    const report = data?.data;

    if (isLoading) {
        return <div className="h-64 flex items-center justify-center"><CircularProgress /></div>;
    }

    const totalQuestions = report?.total_questions ?? 0;
    const correctCount = report?.correct_answers?.length ?? 0;
    const grade = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const allQuestions = [
        ...(report?.correct_answers?.map((q) => ({ ...q, is_correct: true })) ?? []),
        ...(report?.incorrect_answers?.map((q) => ({ ...q, is_correct: false })) ?? []),
        ...(report?.skipped_answers?.map((q) => ({ ...q, is_correct: false, skipped: true })) ?? []),
    ];

    return (
        <div className="h-full overflow-auto">
            {/* Header */}
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button variant="text" size="small" onClick={() => navigate(-1)} sx={{ textTransform: "none" }}>
                        ← Back
                    </Button>
                    <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{report?.test_name || "Quiz Review"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        {report?.timer ?? "—"}
                    </Typography>
                    <Button variant="contained" size="small" onClick={() => navigate(PATH.LEARNING_CANVAS.CONTENT_VIEWER.ROOT(numCourseId, 1))}>
                        Back to Content
                    </Button>
                </Box>
            </Box>

            <Box sx={{ maxWidth: 800, mx: "auto", px: 3, py: 4 }}>
                {/* Grade summary */}
                <Box sx={{
                    p: 3, borderRadius: 2, mb: 4,
                    bgcolor: grade >= 80 ? "#EDFDF5" : "#FFF0F1",
                    border: `1px solid ${grade >= 80 ? "#059467" : "#E21D48"}`,
                }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 24, color: grade >= 80 ? "#059467" : "#E21D48" }}>
                                Your grade: {grade}%
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
                                {grade >= 80
                                    ? "Congratulations! You passed the quiz."
                                    : "To pass you need at least 80%. We keep your highest score."
                                }
                            </Typography>
                        </Box>
                        {grade < 80 && (
                            <Button variant="contained" size="small"
                                onClick={() => navigate(PATH.LEARNING_CANVAS.QUIZ.ROOT(numCourseId, numQuizId))}>
                                Retry
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Questions */}
                {allQuestions.map((q, idx) => (
                    <Box key={idx} sx={{ mb: 4, pb: 3, borderBottom: idx < allQuestions.length - 1 ? `1px solid ${theme.palette.divider}` : "none" }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2 }}>
                            {idx + 1}. {q.question}
                        </Typography>

                        {q.options?.map((opt) => {
                            const isSelected = opt.id === q.your_answer_id;
                            const isCorrectOption = opt.is_correct;

                            let bgColor = "transparent";
                            let borderColor = "transparent";
                            if (isCorrectOption) {
                                bgColor = "#EDFDF5";
                                borderColor = "#059467";
                            } else if (isSelected && !isCorrectOption) {
                                bgColor = "#FFF0F1";
                                borderColor = "#E21D48";
                            }

                            return (
                                <Box key={opt.id} sx={{
                                    display: "flex", alignItems: "center", gap: 1.5, py: 1, px: 1.5,
                                    mb: 0.5, borderRadius: 1, border: `1px solid ${borderColor}`, bgcolor: bgColor,
                                }}>
                                    <Box sx={{
                                        width: 18, height: 18, borderRadius: "50%",
                                        border: `2px solid ${isCorrectOption ? "#059467" : isSelected ? "#E21D48" : theme.palette.divider}`,
                                        bgcolor: isSelected ? (isCorrectOption ? "#059467" : "#E21D48") : "transparent",
                                        flexShrink: 0,
                                    }} />
                                    <Typography sx={{ fontSize: 13 }}>{opt.option}</Typography>
                                </Box>
                            );
                        })}

                        {/* Feedback */}
                        <Box sx={{ mt: 1.5, px: 1.5 }}>
                            {q.is_correct ? (
                                <Typography sx={{ fontSize: 12, color: "#059467", fontWeight: 500 }}>
                                    ✓ Correct! This answer certainly meets your results.
                                </Typography>
                            ) : (
                                <Typography sx={{ fontSize: 12, color: "#E21D48", fontWeight: 500 }}>
                                    ✗ Incorrect! while not a bad decision. You can still retry the test to improve your strength.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
        </div>
    );
}
