import { Box, Button, Typography, useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import type { McqSubmissionData } from "../../../types/question";



interface Props extends Partial<McqSubmissionData> {
    testName?: string;
    /** Re-sit the test. The button only appears when a handler is passed. */
    onRetake?: () => void;
    /** Leave the result behind. The button only appears when a handler is passed. */
    onBackToDashboard?: () => void;
};

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
    const theme = useTheme();
    const getScoreMessage = (score: number) => {
        if (Number(score) < 40) {
            return "Don't be discouraged — every expert was once a beginner. Review your mistakes and try again!";
        }
        if (Number(score) < 60) {
            return "You're improving! With a little more practice, you'll achieve even better results.";
        }
        if (Number(score) < 80) {
            return "Good job! You're getting close to mastery. Keep pushing forward!";
        }
        return "Congratulations on your excellent score! Your dedication and hard work are truly paying off.";
    };

    /**
     * The API derives `percentage` from the sum of each question's own `points`,
     * which is null on any test marked with a flat `marks_per_question` — so a
     * whole class of results arrives as 0% however well they were scored. The
     * marks against the paper's full marks are the same figure, so fall back to
     * them rather than showing an empty ring beside a passing score.
     */
    const scorePercentage = percentage > 0
        ? Number(percentage)
        : full_mark > 0
            ? Math.min(100, Math.round((score / full_mark) * 100))
            : 0;

    /**
     * The thresholds are percentage bands, so they take the percentage — fed
     * raw marks, a 3.2/8 always fell into the lowest band.
     */
    const scoreMessage = getScoreMessage(scorePercentage);

    /**
     * The marks beside each count only earn their place when marks can be lost.
     * On a test without negative marking the counts already say everything —
     * "(+4 marks)" next to 2/4 is noise, and "(-0 marks)" next to 1/4 reads as a
     * penalty that never existed. Where the deduction is real, both halves are
     * shown together so the score above stays traceable: this is the figure it
     * was taken from, and that is what was taken.
     */
    const stats = [
        {
            label: "Correct answers",
            value: negative_marking_enabled
                ? `${correct}/${total_questions} (+${correct_score} marks)`
                : `${correct}/${total_questions}`,
            color: theme.palette.success,
        },
        {
            label: "Incorrect answers",
            value: negative_marking_enabled
                ? `${incorrect}/${total_questions} (-${negative_marks_deducted} marks)`
                : `${incorrect}/${total_questions}`,
            color: theme.palette.error,
        },
        {
            label: "Total Time Taken",
            value: time_taken || "",
            color: theme.palette.warning,
        },
        {
            label: "Questions Attempted",
            value: `${attempted}/${total_questions}`,
            color: theme.palette.primary,
        },
    ];

    const chartOptions: any = {
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
                /**
                 * The marks are drawn as an overlay below instead of through
                 * Apex's own data label. react-apexcharts decides whether to
                 * push new options by comparing `JSON.stringify(options)`, and
                 * stringify drops functions — so a `formatter` closure that
                 * captured score = 0 on the loading render was never replaced
                 * once the result arrived, and any attempt whose percentage
                 * also stayed 0 kept reading "0" however well it scored.
                 */
                dataLabels: { show: false },
            }
        },
        colors: [theme.palette.primary.main],
    };

    return (
        <Box
            className="lg:py-14 px-8 rounded-lg"
            sx={{ border: `1px solid ${theme.palette.separator.dark}` }}
        >
            {/* Chart */}
            <div className="relative w-40 mb-2 mx-auto">
                <ReactApexChart
                    type="radialBar"
                    series={[scorePercentage]}
                    options={chartOptions}
                    height={180}
                />
                {/* The marks are what a student is actually looking for — out of
                    the paper's total whenever the API sends one. */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Typography
                        fontSize={26}
                        fontWeight={700}
                        color={theme.palette.primary.main}
                    >
                        {full_mark > 0 ? `${score}/${full_mark}` : `${score}`}
                    </Typography>
                </div>
            </div>

            {/* Title & Message */}
            <div className="text-center">
                {testName && (
                    <Typography variant="h4" fontWeight={600} className="mt-2">
                        {testName}
                    </Typography>
                )}

                {scoreMessage && (
                    <Typography
                        className="mt-2 mb-4 px-4"
                        color="text.middle"
                        variant="subtitle1"
                    >
                        {scoreMessage}
                    </Typography>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8!">
                {stats
                    .map((stat) => (
                        <Box
                            key={stat.label}
                            className="rounded-xl p-4"
                            sx={{
                                border: `1px solid ${stat.color.main}`,
                                background: stat.color.light,
                            }}
                        >
                            <Typography color={stat.color.main} variant="subtitle2">
                                {stat.label}
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color={stat.color.main}
                            >
                                {stat.value || "N/A"}
                            </Typography>
                        </Box>
                    ))}
            </div>

            {/* Actions */}
            {(onRetake || onBackToDashboard) && (
                <div className="flex flex-col gap-3 mt-6!">
                    {onRetake && (
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={onRetake}
                        >
                            Retake Test
                        </Button>
                    )}

                    {onBackToDashboard && (
                        <Button
                            fullWidth
                            variant="contained"
                            disableElevation
                            onClick={onBackToDashboard}
                            sx={{
                                backgroundColor: theme.palette.separator.dark,
                                color: theme.palette.text.dark,
                                "&:hover": {
                                    backgroundColor: theme.palette.separator.darker,
                                },
                            }}
                        >
                            Back to Dashboard
                        </Button>
                    )}
                </div>
            )}
        </Box>
    );
}
