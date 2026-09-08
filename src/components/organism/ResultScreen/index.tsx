import { Box, Typography, useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import type { McqSubmissionData } from "../../../types/question";



interface Props extends Partial<McqSubmissionData> {
    testName?: string;
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
    is_negative_marked = false,
    negative_marks_deducted = 0,

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

    const scoreMessage = getScoreMessage(Number(score));

    const stats = [
        {
            label: "Correct answers",
            value: `${correct}/${total_questions}`,
            color: theme.palette.success,
        },
        {
            label: "Incorrect answers",
            value:
                `${incorrect}/${total_questions}`,
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
        /**
         * Only shown when marks were actually lost — a test with the setting on
         * but nothing deducted would otherwise read as a penalty that happened.
         */
        ...(is_negative_marked
            ? [{
                label: "Negative Marking",
                value: `-${negative_marks_deducted}`,
                color: theme.palette.error,
            }]
            : []),
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
                dataLabels: {
                    name: { show: false },
                    value: {
                        fontSize: "26px",
                        fontWeight: 700,
                        offsetY: 6,
                        color: theme.palette.primary.main,
                        formatter: () => `${percentage}%`
                    }
                }
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
            <div className="w-40 mb-2 mx-auto">
                <ReactApexChart
                    type="radialBar"
                    series={[percentage]}
                    options={chartOptions}
                    height={180}
                />
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
        </Box>
    );
}
