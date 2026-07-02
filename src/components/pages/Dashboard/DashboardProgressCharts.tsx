import { Box, MenuItem, Select, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetStudyTimeQuery, useGetTestScoresQuery } from "../../../services/dashboardApi";
import type { ProgressRange } from "../../../types/dashboard";

export default function DashboardProgressCharts() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [range, setRange] = useState<ProgressRange>(30);

    const { data: studyRes, isLoading: studyLoading } = useGetStudyTimeQuery(range);
    const { data: scoreRes, isLoading: scoreLoading } = useGetTestScoresQuery(range);

    const studyChartData = studyRes?.data.chart_data ?? [];
    const studyLabels = studyRes?.data.labels ?? [];
    const scoreChartData = scoreRes?.data.chart_data ?? [];
    const scoreLabels = scoreRes?.data.labels ?? [];

    const primary = theme.palette.primary.main;
    const primaryLight = theme.palette.primary.light;
    const primaryDark = theme.palette.primary.dark;
    const secondary = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;
    const secondaryDark = theme.palette.secondary.dark;
    const successMain = theme.palette.success.main;
    const successLight = theme.palette.success.light;
    const textSecondary = theme.palette.text.secondary;
    const dividerColor = theme.palette.divider;
    const paperBg = theme.palette.background.paper;
    const fontFamily = theme.typography.fontFamily as string;
    const mobileTickAmount = range === 90 ? 6 : range === 30 ? 7 : 7;

    const baseChartConfig = {
        chart: {
            toolbar: { show: false },
            background: "transparent",
            fontFamily,
            animations: { enabled: true, speed: 400 },
        },
        grid: {
            borderColor: dividerColor,
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: { left: 4, right: 4, top: 0, bottom: 0 },
        },
        xaxis: {
            categories: [] as string[], // overridden per chart
            labels: {
                style: { fontSize: "10px", colors: textSecondary, fontFamily },
                hideOverlappingLabels: true,
                rotate: isMobile ? -30 : 0,
                rotateAlways: false,
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tickAmount: isMobile ? mobileTickAmount : undefined,
        },
        tooltip: {
            theme: theme.palette.mode,
            style: { fontSize: "12px", fontFamily },
        },
        legend: { show: false },
        dataLabels: { enabled: false },
        responsive: [
            {
                breakpoint: 380,
                options: {
                    xaxis: {
                        labels: { style: { fontSize: "9px" } },
                    },
                    grid: {
                        padding: { left: 2, right: 2 },
                    },
                },
            },
        ],
    };

    const studyOptions = {
        ...baseChartConfig,
        chart: { ...baseChartConfig.chart, type: "bar" as const },
        xaxis: { ...baseChartConfig.xaxis, categories: studyLabels },
        plotOptions: {
            bar: {
                borderRadius: 5,
                columnWidth: range === 30 ? "60%" : "42%",
            },
        },
        colors: [primary],
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                gradientToColors: [primaryLight],
                stops: [0, 100],
                opacityFrom: 0.92,
                opacityTo: 0.45,
            },
        },
        yaxis: {
            labels: {
                style: { fontSize: "10px", colors: textSecondary, fontFamily },
                formatter: (v: number) => `${v}h`,
            },
        },
    };

    const scoreOptions = {
        ...baseChartConfig,
        chart: { ...baseChartConfig.chart, type: "line" as const },
        xaxis: { ...baseChartConfig.xaxis, categories: scoreLabels },
        colors: [secondary],
        stroke: { curve: "smooth" as const, width: 2.5 },
        markers: {
            size: 2,
            colors: [secondary],
            strokeColors: paperBg,
            strokeWidth: 2,
            hover: { size: 5 },
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                gradientToColors: [secondaryLight],
                stops: [0, 100],
                opacityFrom: 0.22,
                opacityTo: 0.01,
            },
        },
        yaxis: {
            min: 50,
            max: 100,
            labels: {
                style: { fontSize: "10px", colors: textSecondary, fontFamily },
                formatter: (v: number) => `${v}%`,
            },
        },
    };

    const weekStudy = studyRes?.data.total_this_week ?? 0;
    const periodStudy = studyRes?.data.total_this_period ?? 0;
    const changePct = studyRes?.data.change_percentage ?? 0;
    const totalTests = scoreRes?.data.total_tests ?? 0;
    const avgScore = scoreRes?.data.avg_score ?? 0;
    const bestScore = scoreRes?.data.best_score ?? 0;

    return (
        <Box>
            {/* Section header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: "14.5px" }}>
                    Your Progress
                </Typography>
                <Select
                    size="small"
                    value={range}
                    onChange={(e) => setRange(Number(e.target.value) as 7 | 30 | 90)}
                    sx={{
                        fontSize: "12px",
                        borderRadius: "99px",
                        padding: "0 16px 0 0",
                        ".MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                        ".MuiSelect-select": { py: "4px", px: "14px !important" },
                    }}
                >
                    <MenuItem value={7}><Typography variant="caption">Last 7 days</Typography></MenuItem>
                    <MenuItem value={30}><Typography variant="caption">Last 30 days</Typography></MenuItem>
                    <MenuItem value={90}><Typography variant="caption">Last 3 months</Typography></MenuItem>
                </Select>
            </Box>

            {/* Two chart cards */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: "12px" }}>

                {/* Study Time */}
                <Box sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    border: `1px solid ${dividerColor}`,
                    borderRadius: 2,
                    boxShadow: "0 1px 3px rgba(0,0,0,.06), 0 4px 6px rgba(0,0,0,.03)",
                    opacity: studyLoading ? 0.5 : 1,
                    transition: "opacity 0.2s",
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="body2" fontWeight={700}>Study Time</Typography>
                        {studyLoading ? (
                            <Skeleton variant="rounded" width={100} height={20} sx={{ borderRadius: "99px" }} />
                        ) : (
                            <Box component="span" sx={{
                                fontSize: "10px", fontWeight: 700,
                                bgcolor: changePct >= 0 ? successLight : "error.light",
                                color: changePct >= 0 ? successMain : "error.main",
                                px: "8px", py: "2px", borderRadius: "99px",
                            }}>
                                {changePct >= 0 ? "+" : ""}{changePct}% vs last period
                            </Box>
                        )}
                    </Box>

                    <ReactApexChart
                        options={studyOptions}
                        series={[{ name: "Study Time", data: studyChartData }]}
                        type="bar"
                        height={isMobile ? 130 : 160}
                    />

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 1 }}>
                        <Box sx={{ textAlign: "center", bgcolor: primaryLight, borderRadius: 1.5, py: 1 }}>
                            {studyLoading ? (
                                <Skeleton variant="text" width={40} height={28} sx={{ mx: "auto" }} />
                            ) : (
                                <Typography fontWeight={800} sx={{ fontSize: "18px", lineHeight: 1, color: primaryDark }}>
                                    {weekStudy}h
                                </Typography>
                            )}
                            <Typography variant="caption" sx={{ color: "text.secondary", mt: "2px", display: "block" }}>
                                This week
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center", bgcolor: primaryLight, borderRadius: 1.5, py: 1 }}>
                            {studyLoading ? (
                                <Skeleton variant="text" width={40} height={28} sx={{ mx: "auto" }} />
                            ) : (
                                <Typography fontWeight={800} sx={{ fontSize: "18px", lineHeight: 1, color: primaryDark }}>
                                    {periodStudy}h
                                </Typography>
                            )}
                            <Typography variant="caption" sx={{ color: "text.secondary", mt: "2px", display: "block" }}>
                                This period
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Test Scores */}
                <Box sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    border: `1px solid ${dividerColor}`,
                    borderRadius: 2,
                    boxShadow: "0 1px 3px rgba(0,0,0,.06), 0 4px 6px rgba(0,0,0,.03)",
                    opacity: scoreLoading ? 0.5 : 1,
                    transition: "opacity 0.2s",
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="body2" fontWeight={700}>Test Scores</Typography>
                        {scoreLoading ? (
                            <Skeleton variant="rounded" width={90} height={20} sx={{ borderRadius: "99px" }} />
                        ) : (
                            <Box component="span" sx={{
                                fontSize: "10px", fontWeight: 700,
                                bgcolor: secondaryLight, color: secondaryDark,
                                px: "8px", py: "2px", borderRadius: "99px",
                            }}>
                                {totalTests} tests taken
                            </Box>
                        )}
                    </Box>

                    <ReactApexChart
                        options={scoreOptions}
                        series={[{ name: "Score", data: scoreChartData }]}
                        type="line"
                        height={isMobile ? 130 : 160}
                    />

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 1 }}>
                        <Box sx={{ textAlign: "center", bgcolor: secondaryLight, borderRadius: 1.5, py: 1 }}>
                            {scoreLoading ? (
                                <Skeleton variant="text" width={40} height={28} sx={{ mx: "auto" }} />
                            ) : (
                                <Typography fontWeight={800} sx={{ fontSize: "18px", lineHeight: 1, color: secondaryDark }}>
                                    {avgScore}%
                                </Typography>
                            )}
                            <Typography variant="caption" sx={{ color: "text.secondary", mt: "2px", display: "block" }}>
                                Avg score
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center", bgcolor: secondaryLight, borderRadius: 1.5, py: 1 }}>
                            {scoreLoading ? (
                                <Skeleton variant="text" width={40} height={28} sx={{ mx: "auto" }} />
                            ) : (
                                <Typography fontWeight={800} sx={{ fontSize: "18px", lineHeight: 1, color: secondaryDark }}>
                                    {bestScore}%
                                </Typography>
                            )}
                            <Typography variant="caption" sx={{ color: "text.secondary", mt: "2px", display: "block" }}>
                                Best score
                            </Typography>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}
