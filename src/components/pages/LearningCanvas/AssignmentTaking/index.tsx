import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type AnswerType = "text" | "file" | "both";
type MockQuestion = { id: number; question: string; points: number; answer_type: AnswerType };

// Static mock data — will be dynamic once backend has assignment-specific endpoints
const MOCK_QUESTIONS: MockQuestion[] = [
    { id: 1, question: "Analyze a real-world engineering problem and propose a structured solution using core engineering principles learned in this module.", points: 25, answer_type: "both" },
    { id: 2, question: "Analyze a real-world engineering problem and propose a structured solution using core engineering principles learned in this module.", points: 25, answer_type: "file" },
    { id: 3, question: "Analyze a real-world engineering problem and propose a structured solution using core engineering principles learned in this module.", points: 25, answer_type: "both" },
    { id: 4, question: "Analyze a real-world engineering problem and propose a structured solution using core engineering principles learned in this module.", points: 25, answer_type: "both" },
];

export default function AssignmentTaking() {
    const navigate = useNavigate();
    const theme = useTheme();

    const [answers, setAnswers] = useState<Record<number, { text: string; file: File | null }>>({});
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    const handleTextChange = (qId: number, text: string) => {
        setAnswers((p) => ({ ...p, [qId]: { ...p[qId], text, file: p[qId]?.file ?? null } }));
    };

    const handleFileChange = (qId: number, file: File | null) => {
        setAnswers((p) => ({ ...p, [qId]: { text: p[qId]?.text ?? "", file } }));
    };

    const handleSubmit = () => {
        setShowSubmitDialog(false);
        // Will call submitAssignment mutation when API is ready
        navigate(-1);
    };

    return (
        <div className="h-full overflow-auto">
            {/* Header */}
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, bgcolor: "background.default", zIndex: 10 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button variant="text" size="small" onClick={() => navigate(-1)} sx={{ textTransform: "none" }}>
                        ← Back
                    </Button>
                    <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Engineering</Typography>
                </Box>
                <Button variant="contained" size="small">Full Screen</Button>
            </Box>

            {/* Questions */}
            <Box sx={{ maxWidth: 800, mx: "auto", px: 3, py: 4 }}>
                {MOCK_QUESTIONS.map((q, idx) => (
                    <Box key={q.id} sx={{ mb: 4, pb: 3, borderBottom: idx < MOCK_QUESTIONS.length - 1 ? `1px solid ${theme.palette.divider}` : "none" }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                            <Box sx={{
                                width: 28, height: 28, borderRadius: "6px", bgcolor: "primary.main",
                                color: "primary.contrastText", display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0,
                            }}>
                                {idx + 1}
                            </Box>
                            <Typography sx={{ fontSize: 13, lineHeight: 1.6 }}>
                                {q.question} <Typography component="span" sx={{ color: "error.main" }}>*</Typography>
                            </Typography>
                        </Box>

                        {/* Rich text editor placeholder */}
                        {(q.answer_type === "text" || q.answer_type === "both") && (
                            <Box sx={{ mb: 2 }}>
                                {/* Toolbar */}
                                <Box sx={{
                                    display: "flex", gap: 0.5, px: 1.5, py: 1,
                                    borderTopLeftRadius: 8, borderTopRightRadius: 8,
                                    border: `1px solid ${theme.palette.divider}`, borderBottom: "none",
                                    bgcolor: "action.hover",
                                }}>
                                    {["B", "I", "U", "S", "≡", "•", "1.", "⇔", "🔗", "📷"].map((btn) => (
                                        <Box key={btn} sx={{
                                            width: 28, height: 28, display: "flex", alignItems: "center",
                                            justifyContent: "center", borderRadius: 1, cursor: "pointer",
                                            fontSize: 13, fontWeight: btn === "B" ? 700 : 400,
                                            "&:hover": { bgcolor: "action.selected" },
                                        }}>
                                            {btn}
                                        </Box>
                                    ))}
                                </Box>
                                <textarea
                                    placeholder="Write your answer here"
                                    value={answers[q.id]?.text ?? ""}
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    style={{
                                        width: "100%", minHeight: 120, padding: "12px",
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
                                        resize: "vertical", fontFamily: "inherit", fontSize: 13,
                                        outline: "none", background: "transparent",
                                        color: theme.palette.text.primary,
                                    }}
                                />
                            </Box>
                        )}

                        {/* File upload */}
                        {(q.answer_type === "file" || q.answer_type === "both") && (
                            <Box sx={{
                                border: `2px dashed ${theme.palette.divider}`, borderRadius: 2,
                                p: 3, textAlign: "center", cursor: "pointer",
                                "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                            }}
                                onClick={() => document.getElementById(`file-${q.id}`)?.click()}
                            >
                                <Typography sx={{ fontSize: 24, mb: 1 }}>☁️</Typography>
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                    Click on button to upload file
                                </Typography>
                                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                                    Supporting file up to 300 MB
                                </Typography>
                                {answers[q.id]?.file && (
                                    <Typography sx={{ fontSize: 12, fontWeight: 600, mt: 1, color: "success.main" }}>
                                        {answers[q.id].file!.name}
                                    </Typography>
                                )}
                                <Button variant="outlined" size="small" sx={{ mt: 1.5 }}>Upload File</Button>
                                <input
                                    type="file"
                                    id={`file-${q.id}`}
                                    hidden
                                    onChange={(e) => handleFileChange(q.id, e.target.files?.[0] ?? null)}
                                />
                            </Box>
                        )}
                    </Box>
                ))}

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={() => setShowSubmitDialog(true)}>Submit</Button>
                    <Button variant="outlined">Save as Draft</Button>
                </Box>
            </Box>

            {/* Submit confirmation */}
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
                    <Button variant="contained" onClick={handleSubmit}>Submit Assignment</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
