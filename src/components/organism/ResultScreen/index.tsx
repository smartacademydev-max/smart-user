import { Box, Button, Typography } from "@mui/material";

import { useQuizTokens } from "../../pages/TestManagement/singleTest/quizTokens";
import type { McqSubmissionData } from "../../../types/question";
import { getScoreMessage, ResultRow, resolvePercentage, ScoreRing } from "./parts";

interface Props extends Partial<McqSubmissionData> {
    testName?: string;
    /** Re-sit the test. The button only appears when a handler is passed. */
    onRetake?: () => void;
    /** Leave the result behind. The button only appears when a handler is passed. */
    onBackToDashboard?: () => void;
}

/**
 * The attempt's result, as it sits beside the review. The same shape the runner
 * shows on submitting, so a student meets one summary twice rather than two
 * summaries of one thing.
 */
export default function TestResultSummary({
    testName,
    percentage = 0,
    score = 0,
    correct = 0,
    incorrect = 0,
    time_taken = "",
    attempted = 0,
    total_questions = 0,
    negative_marking_enabled = false,
    negative_marks_deducted = 0,
    correct_score = 0,
    full_mark = 0,
    onRetake,
    onBackToDashboard,
}: Props) {
    const t = useQuizTokens();
    const scorePercentage = resolvePercentage(percentage, score, full_mark);

    return (
        <Box
            className="rounded-2xl p-5"
            sx={{
                backgroundColor: t.surface,
                border: "1px solid",
                borderColor: t.border,
            }}
        >
            <Typography
                className="text-center"
                fontSize={11}
                fontWeight={700}
                letterSpacing="0.12em"
                textTransform="uppercase"
                sx={{ color: t.muted, mb: 2 }}
            >
                Your score
            </Typography>

            <ScoreRing
                percentage={scorePercentage}
                score={score}
                fullMark={full_mark}
                animateKey={`${score}-${scorePercentage}`}
            />

            <Box className="mt-4 text-center">
                {testName && (
                    <Typography fontSize={16} fontWeight={700} sx={{ color: t.foreground }}>
                        {testName}
                    </Typography>
                )}

                <Typography fontSize={13} lineHeight={1.7} sx={{ color: t.muted, mt: 0.5 }}>
                    {getScoreMessage(scorePercentage)}
                </Typography>
            </Box>

            <Box component="dl" sx={{ mt: 3, mb: 0, borderTop: "1px solid", borderColor: t.border }}>
                <ResultRow label="Correct" value={`${correct} of ${total_questions}`} tone={t.success} />
                <ResultRow label="Incorrect" value={`${incorrect} of ${total_questions}`} tone={t.danger} />
                <ResultRow label="Attempted" value={`${attempted} of ${total_questions}`} />
                {time_taken && <ResultRow label="Time taken" value={time_taken} />}
                {/*
                  * Only where marks can be lost. Without a deduction the marks
                  * earned and the final score are the same number, and the ring
                  * has already said it — with one, these two rows are the
                  * arithmetic behind the ring: earned, less the deduction,
                  * leaves what it shows.
                  */}
                {negative_marking_enabled && (
                    <>
                        <ResultRow
                            label="Marks earned"
                            value={full_mark > 0 ? `${correct_score} of ${full_mark}` : correct_score}
                            tone={t.success}
                        />
                        <ResultRow
                            label="Negative marking"
                            value={`−${negative_marks_deducted}`}
                            tone={t.warning}
                        />
                    </>
                )}
            </Box>

            {(onRetake || onBackToDashboard) && (
                <Box className="mt-5 flex flex-col gap-2">
                    {onRetake && (
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={onRetake}
                            sx={{ fontWeight: 600 }}
                        >
                            Try again
                        </Button>
                    )}

                    {onBackToDashboard && (
                        <Button
                            fullWidth
                            size="large"
                            variant="outlined"
                            color="primary"
                            onClick={onBackToDashboard}
                            sx={{ fontWeight: 600 }}
                        >
                            Back to dashboard
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
}
