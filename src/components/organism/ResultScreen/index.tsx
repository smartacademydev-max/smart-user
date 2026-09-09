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
     * The counts stay counts. The marks they add up to are their own rows
     * below, where a figure has room to be read — squeezed into "5/50 (+4.75
     * marks)" the two numbers competed and neither landed.
     */
    const stats = [
        {
            label: "Correct answers",
            value: `${correct}/${total_questions}`,
            color: theme.palette.success,
        },
        {
            label: "Incorrect answers",
            value: `${incorrect}/${total_questions}`,
            color: theme.palette.error,
        },
        {
            label: "Total time taken",
            value: time_taken || "",
            color: theme.palette.warning,
        },
        {
            label: "Questions attempted",
            value: `${attempted}/${total_questions}`,
            color: theme.palette.primary,
        },
    ];

    /**
     * What was taken, then what is left — in that order, because the net score
     * only makes sense once the deduction behind it has been named. Out of the
     * paper's total wherever the API sends one; the submit response does not,
     * so there the marks stand alone rather than reading "0.25 / 0".
     */
    const marksRows = [
        {
            label: "Negative marking",
            value: `-${negative_marks_deducted}`,
            color: theme.palette.warning,
        },
        {
            label: "Net score",
            value: full_mark > 0 ? `${score} / ${full_mark}` : `${score}`,
            color: theme.palette.error,
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
            className="py-6 px-6 rounded-lg"
            sx={{ border: `1px solid ${theme.palette.separator.dark}` }}
        >
            {/* Chart */}
            <Typography
                className="text-center"
                variant="subtitle2"
                color="text.middle"
            >
                Your score
            </Typography>

            <div className="relative w-36 mx-auto">
                <ReactApexChart
                    type="radialBar"
                    series={[scorePercentage]}
                    options={chartOptions}
                    height={150}
                />
                {/* The ring reads as a percentage; the marks behind it are the
                    Net score row below, so putting them here too would print the
                    same figure twice. */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Typography
                        fontSize={24}
                        fontWeight={700}
                        color={theme.palette.primary.main}
                    >
                        {scorePercentage}%
                    </Typography>
                </div>
            </div>

            {/* Title & Message */}
            <div className="text-center">
                {testName && (
                    <Typography variant="h5" fontWeight={600} className="mt-1">
                        {testName}
                    </Typography>
                )}

                {scoreMessage && (
                    <Typography
                        className="mt-1 px-2"
                        color="text.middle"
                        variant="subtitle1"
                    >
                        {scoreMessage}
                    </Typography>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-5!">
                {stats
                    .map((stat) => (
                        <Box
                            key={stat.label}
                            className="rounded-xl p-3"
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

            {/* Marks — only where marks can be lost. Full width and with the
                value set against the label, because these two are the figures a
                student argues with and they need to be read at a glance. */}
            {negative_marking_enabled && (
                <div className="flex flex-col gap-3 w-full mt-3!">
                    {marksRows.map((row) => (
                        <Box
                            key={row.label}
                            className="rounded-xl p-3 flex items-center justify-between gap-4"
                            sx={{
                                border: `1px solid ${row.color.main}`,
                                background: row.color.light,
                            }}
                        >
                            <Typography color={row.color.main} variant="subtitle2" fontWeight={600}>
                                {row.label}
                            </Typography>
                            <Typography color={row.color.main} variant="body2" fontWeight={700}>
                                {row.value}
                            </Typography>
                        </Box>
                    ))}
                </div>
            )}

            {/* Actions */}
            {(onRetake || onBackToDashboard) && (
                <div className="flex flex-col gap-2 mt-4!">
                    {onRetake && (
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={onRetake}
                        >
                            Try Again
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
