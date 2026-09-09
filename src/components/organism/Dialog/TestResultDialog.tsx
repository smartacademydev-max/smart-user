import { Box, Button, Dialog, DialogContent, Typography, useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import type { McqSubmissionData } from "../../../types/question";

interface Props {
    open: boolean;
    result: McqSubmissionData | null;
    onReview?: () => void;
    onClose?: () => void;
    onBack?: () => void;
}

export default function TestResultDialog({ open, result, onReview, onClose, onBack }: Props) {
    const theme = useTheme();

    const percentage = result?.percentage ?? 0;

    const chartOptions = {
        chart: {
            type: "radialBar",
            sparkline: { enabled: true }
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: { size: "60%" },
                track: {
                    background: theme.palette.grey[200],
                },
                dataLabels: {
                    name: { show: false },
                    value: {
                        fontSize: "26px",
                        fontWeight: 700,
                        offsetY: 6,
                        color: theme.palette.primary.main,
                        /**
                         * The ring still fills by percentage, but the marks are
                         * what a student is actually looking for.
                         */
                        formatter: () => (result?.full_mark ?? 0) > 0
                            ? `${result?.score ?? 0}/${result?.full_mark}`
                            : `${result?.score ?? 0}`
                    }
                }
            }
        },
        colors: [theme.palette.primary.main],
    };

    const getScoreMessage = (score: number) => {
        if (score < 40) {
            return "Don't be discouraged — every expert was once a beginner. Review your mistakes and try again!";
        }
        if (score < 60) {
            return "You're improving! With a little more practice, you'll achieve even better results.";
        }
        if (score < 80) {
            return "Good job! You're getting close to mastery. Keep pushing forward!";
        }
        return "Congratulations on your excellent score! Your dedication and hard work are truly paying off.";
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent className="flex flex-col items-center">

                {/* Circular Chart */}
                <div className="w-40 mt-6 mb-2">
                    <ReactApexChart type="radialBar" series={[percentage]} options={chartOptions as any} height={180} />
                </div>

                {/* Test Title */}
                <Typography variant="h4" fontWeight={600} className="mt-2">
                    {result?.test_name}
                </Typography>

                <Typography
                    className="text-center mt-2 mb-4 px-4"
                    color="text.middle"
                    variant="subtitle1"
                >
                    {/* Percentage bands, so they take the percentage — fed raw
                        marks, a 3.2/8 always fell into the lowest band. */}
                    {result ? getScoreMessage(result.percentage) : ""}
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-2">

                    {/* Correct */}
                    <Box
                        className="rounded-xl p-4"
                        sx={{
                            border: `1px solid ${theme.palette.success.main}`,
                            background: theme.palette.success.light,
                        }}
                    >
                        <Typography color="success.main" variant="subtitle2">
                            Correct answers
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="success.main">
                            {result?.correct}/{result?.total_questions}
                        </Typography>
                    </Box>

                    {/* Incorrect */}
                    <Box
                        className="rounded-xl p-4"
                        sx={{
                            border: `1px solid ${theme.palette.error.main}`,
                            background: theme.palette.error.light,
                        }}
                    >
                        <Typography color="error.main" variant="subtitle2">
                            Incorrect answers
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="error.main">
                            {result?.incorrect}/{result?.total_questions}
                        </Typography>
                    </Box>

                    {/* Time Taken */}
                    <Box
                        className="rounded-xl p-4"
                        sx={{
                            border: `1px solid ${theme.palette.warning.main}`,
                            background: theme.palette.warning.light,
                        }}
                    >
                        <Typography color="warning.main" variant="subtitle2">
                            Total Time Taken
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="warning.main">
                            {result?.time_taken}
                        </Typography>
                    </Box>

                    {/* Attempted */}
                    <Box
                        className="rounded-xl p-4"
                        sx={{
                            border: `1px solid ${theme.palette.primary.main}`,
                            background: theme.palette.primary.light,
                        }}
                    >
                        <Typography color="primary.main" variant="subtitle2">
                            Questions Attempted
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="primary.main">
                            {result?.attempted}/{result?.total_questions}
                        </Typography>
                    </Box>

                </div>

                {/* Marks — the same two rows the review aside shows, so the
                    figures a student sees on submitting are the figures they
                    find again when they come back to review. */}
                {result?.negative_marking_enabled && (
                    <div className="flex flex-col gap-4 w-full mt-4">
                        <Box
                            className="rounded-xl p-4 flex items-center justify-between gap-4"
                            sx={{
                                border: `1px solid ${theme.palette.warning.main}`,
                                background: theme.palette.warning.light,
                            }}
                        >
                            <Typography color="warning.main" variant="subtitle2" fontWeight={600}>
                                Negative marking
                            </Typography>
                            <Typography color="warning.main" variant="body2" fontWeight={700}>
                                -{result?.negative_marks_deducted ?? 0}
                            </Typography>
                        </Box>

                        <Box
                            className="rounded-xl p-4 flex items-center justify-between gap-4"
                            sx={{
                                border: `1px solid ${theme.palette.error.main}`,
                                background: theme.palette.error.light,
                            }}
                        >
                            <Typography color="error.main" variant="subtitle2" fontWeight={600}>
                                Net score
                            </Typography>
                            {/* The submit response carries no full marks, so the
                                score stands alone rather than reading "x / 0". */}
                            <Typography color="error.main" variant="body2" fontWeight={700}>
                                {(result?.full_mark ?? 0) > 0
                                    ? `${result?.score ?? 0} / ${result?.full_mark}`
                                    : `${result?.score ?? 0}`}
                            </Typography>
                        </Box>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="w-full mt-6 flex gap-4">
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                        onClick={onReview}
                    >
                        Review Answers
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                        onClick={onBack}
                    >
                        Go to Home Page
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
