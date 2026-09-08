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
    correct_score = 0,
    full_mark = 0,

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
     * The thresholds are percentage bands, so they take the percentage — fed
     * raw marks, a 3.2/8 always fell into the lowest band.
     */
    const scoreMessage = getScoreMessage(Number(percentage));

    const stats = [
        {
            label: "Correct answers",
            /**
             * The count with the marks it earned, so the score above is
             * traceable: this is the figure negative marking is taken from.
             */
            value: `${correct}/${total_questions} (+${correct_score} marks)`,
            color: theme.palette.success,
        },
        {
            label: "Incorrect answers",
            // Always shows what was lost, so a zero reads as "nothing deducted"
            // rather than leaving the student to wonder.
            value: `${incorrect}/${total_questions} (-${negative_marks_deducted} marks)`,
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
                value: `-${negative_marks_deducted} marks`,
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
                        /**
                         * The ring still fills by percentage, but the marks are
                         * what a student is actually looking for. Out of the
                         * paper's total when the API sends one.
                         */
                        formatter: () => full_mark > 0 ? `${score}/${full_mark}` : `${score}`
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
