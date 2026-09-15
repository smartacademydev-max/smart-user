import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";

import { useQuizTokens } from "../../pages/TestManagement/singleTest/quizTokens";
import type { McqSubmissionData } from "../../../types/question";
import { getScoreMessage, ResultRow, resolvePercentage, ScoreRing } from "../ResultScreen/parts";

interface Props {
    open: boolean;
    result: McqSubmissionData | null;
    onReview?: () => void;
    onClose?: () => void;
    onBack?: () => void;
}

/**
 * What the attempt came to, the moment it is submitted. Built from the same
 * pieces as the summary beside the review, so the figures a student sees here
 * are the figures they find again when they come back to it.
 */
export default function TestResultDialog({ open, result, onReview, onClose, onBack }: Props) {
    const t = useQuizTokens();

    const fullMark = result?.full_mark ?? 0;
    const total = result?.total_questions ?? 0;
    const score = result?.score ?? 0;
    const percentage = resolvePercentage(result?.percentage ?? 0, score, fullMark);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        backgroundColor: t.surface,
                        backgroundImage: "none",
                    },
                },
            }}
        >
            <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
                <ScoreRing
                    percentage={percentage}
                    score={score}
                    fullMark={fullMark}
                    animateKey={open}
                />

                <Box className="mt-4 text-center">
                    <Typography fontSize={18} fontWeight={700} sx={{ color: t.foreground }}>
                        {result?.test_name}
                    </Typography>
                    <Typography fontSize={13} lineHeight={1.7} sx={{ color: t.muted, mt: 0.5 }}>
                        {getScoreMessage(percentage)}
                    </Typography>
                </Box>

                <Box component="dl" sx={{ mt: 3, mb: 0, borderTop: "1px solid", borderColor: t.border }}>
                    <ResultRow label="Correct" value={`${result?.correct ?? 0} of ${total}`} tone={t.success} />
                    <ResultRow label="Incorrect" value={`${result?.incorrect ?? 0} of ${total}`} tone={t.danger} />
                    <ResultRow label="Unanswered" value={`${result?.skipped ?? 0} of ${total}`} />
                    {result?.time_taken && <ResultRow label="Time taken" value={result.time_taken} />}
                    {/* The arithmetic behind the ring, and only where there
                        is any: earned, less the deduction, leaves the score. */}
                    {result?.negative_marking_enabled && (
                        <>
                            <ResultRow
                                label="Marks earned"
                                value={
                                    fullMark > 0
                                        ? `${result?.correct_score ?? 0} of ${fullMark}`
                                        : (result?.correct_score ?? 0)
                                }
                                tone={t.success}
                            />
                            <ResultRow
                                label="Negative marking"
                                value={`−${result?.negative_marks_deducted ?? 0}`}
                                tone={t.warning}
                            />
                        </>
                    )}
                </Box>

                <Box className="mt-6 flex flex-col gap-2">
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={onReview}
                        sx={{ fontWeight: 600 }}
                    >
                        Review answers
                    </Button>
                    <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        color="primary"
                        onClick={onBack}
                        sx={{ fontWeight: 600 }}
                    >
                        Done
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
