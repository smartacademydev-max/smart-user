import { Box, Button, CircularProgress, LinearProgress, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import { useGetCourseByIdQuery, useGetCourseCurriculumByIdQuery, useGetCourseOverviewByIdQuery } from "../../../services/courseApi";
import type { CourseProps } from "../../../types/course";
import { renderHtml } from "../../../utils/renderHtml";
import TabController from "../../molecules/TabController";
import CourseBanner from "../../organism/CourseBanner";
import InstructorCard from "../../organism/Cards/InstructorCard";

// ─── Static mock data for new endpoints ──────────────────────────────────────
const MOCK_PROGRESS = {
    progress: 52,
    expires_label: "1st April",
    lessons_done: 12,
    tests_passed: 8,
    assignments: 2,
    study_streak_days: 7,
    study_streak_week: [true, true, true, true, false, false, false], // M T W T F S S
    next_up_title: "Banking Laws & Policies – Chapter 3",
    next_up_subtitle: "Video · 18 min",
    stats: [
        { label: "Videos Watched", current: 48, total: 84, color: "#16A34A" },
        { label: "Audios Listened", current: 30, total: 59, color: "#F59E0B" },
        { label: "Notes Read", current: 10, total: 24, color: "#E21D48" },
    ],
};

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// ─── Progress Sidebar ────────────────────────────────────────────────────────
function ProgressSidebar({ course }: { course: CourseProps }) {
    const theme = useTheme();
    const progress = course.progress ?? MOCK_PROGRESS.progress;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Your Progress */}
            <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2.5, border: `1px solid ${theme.palette.divider}` }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5 }}>Your Progress</Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
                    Keep going! You're making great progress.
                </Typography>

                {/* Progress bar with labels */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Progress</Typography>
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Expires</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{progress}% Completed</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{MOCK_PROGRESS.expires_label}</Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8, borderRadius: 4, bgcolor: "#DCFCE7",
                        "& .MuiLinearProgress-bar": { bgcolor: "#16A34A", borderRadius: 4 },
                        mb: 2.5,
                    }}
                />

                {/* Stat cards */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Box sx={{ flex: 1, bgcolor: "#EEF2FF", borderRadius: 1.5, p: 1.5, textAlign: "center" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 22, color: "#4F46E5" }}>
                            {MOCK_PROGRESS.lessons_done}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "#4F46E5", fontWeight: 500 }}>
                            Lessons Done
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, bgcolor: "#ECFDF5", borderRadius: 1.5, p: 1.5, textAlign: "center" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 22, color: "#059669" }}>
                            {MOCK_PROGRESS.tests_passed}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "#059669", fontWeight: 500 }}>
                            Tests Passed
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, bgcolor: "#FFF7ED", borderRadius: 1.5, p: 1.5, textAlign: "center" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 22, color: "#EA580C" }}>
                            {MOCK_PROGRESS.assignments}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "#EA580C", fontWeight: 500 }}>
                            Assignments
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Study Streak */}
            <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2.5, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Typography sx={{ fontSize: 16 }}>🔥</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, flex: 1 }}>Study Streak</Typography>
                    <Box sx={{ bgcolor: "#ECFDF5", px: 1.5, py: 0.25, borderRadius: 10 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>
                            {MOCK_PROGRESS.study_streak_days} days
                        </Typography>
                    </Box>
                </Box>

                {/* Weekly calendar */}
                <Box sx={{ display: "flex", gap: 0.75, mb: 1.5 }}>
                    {DAYS.map((day, idx) => (
                        <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
                            <Typography sx={{ fontSize: 10, color: "text.secondary", mb: 0.5, fontWeight: 500 }}>
                                {day}
                            </Typography>
                            <Box sx={{
                                height: 28, borderRadius: 1,
                                bgcolor: MOCK_PROGRESS.study_streak_week[idx] ? "#E21D48" : theme.palette.action.hover,
                            }} />
                        </Box>
                    ))}
                </Box>

                <Typography sx={{ fontSize: 11, color: "text.secondary", textAlign: "center" }}>
                    Keep it up — study today to extend your streak!
                </Typography>
            </Box>

            {/* Next Up */}
            <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2.5, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Typography sx={{ fontSize: 14 }}>▶</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Next Up</Typography>
                </Box>

                <Box sx={{
                    display: "flex", alignItems: "center", gap: 1.5, p: 1.5,
                    borderRadius: 1.5, bgcolor: "action.hover",
                }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: "50%", bgcolor: "primary.main",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <Typography sx={{ color: "primary.contrastText", fontSize: 14 }}>▶</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
                            {MOCK_PROGRESS.next_up_title}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                            {MOCK_PROGRESS.next_up_subtitle}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Course Stats */}
            <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2.5, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Typography sx={{ fontSize: 14 }}>📊</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Course Stats</Typography>
                </Box>

                {MOCK_PROGRESS.stats.map((stat) => (
                    <Box key={stat.label} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{stat.label}</Typography>
                            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                                {stat.current}/{stat.total}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(stat.current / stat.total) * 100}
                            sx={{
                                height: 6, borderRadius: 3,
                                bgcolor: theme.palette.action.hover,
                                "& .MuiLinearProgress-bar": { bgcolor: stat.color, borderRadius: 3 },
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

// ─── Main Course Overview Page ───────────────────────────────────────────────
const OVERVIEW_TABS = [
    { label: "Overview", value: "overview" },
    { label: "Curriculum", value: "curriculum" },
    { label: "Notes", value: "notes" },
    { label: "Videos", value: "videos" },
    { label: "Audios", value: "audios" },
    { label: "Tests", value: "tests" },
    { label: "Reviews", value: "reviews" },
];

export default function LearningCanvasCourseOverview() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState("overview");

    const { data: courseData, isLoading } = useGetCourseByIdQuery({ id: Number(courseId) });
    const { data: overviewData } = useGetCourseOverviewByIdQuery({ id: Number(courseId) });
    const { data: curriculumData } = useGetCourseCurriculumByIdQuery(
        { id: Number(courseId), pageIndex: 1, pageSize: 50 },
        { skip: !courseId },
    );

    const course = courseData?.data;
    const havePurchased = course?.user?.has_purchased || course?.user?.is_free_trial_valid || false;

    const availableTabs = useMemo(() => {
        return OVERVIEW_TABS.filter((tab) => {
            if (tab.value === "curriculum" && !curriculumData?.data?.data?.length) return false;
            return true;
        });
    }, [curriculumData]);

    if (isLoading) {
        return <div className="h-64 flex items-center justify-center"><CircularProgress /></div>;
    }

    if (!course) return null;

    const handleStartLearning = () => {
        navigate(PATH.LEARNING_CANVAS.CONTENT_VIEWER.ROOT(Number(courseId), 1));
    };

    return (
        <div className="h-full overflow-auto">
            {/* Page title */}
            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 1 }}>Learning Canvas</Typography>

            {/* Breadcrumb */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 3, flexWrap: "wrap" }}>
                <Typography
                    sx={{ fontSize: 13, color: "text.secondary", cursor: "pointer", "&:hover": { color: "primary.main" } }}
                    onClick={() => navigate("/")}
                >
                    Home
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{">"}</Typography>
                <Typography
                    sx={{ fontSize: 13, color: "text.secondary", cursor: "pointer", "&:hover": { color: "primary.main" } }}
                    onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.ROOT)}
                >
                    Courses
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{">"}</Typography>
                <Typography sx={{ fontSize: 13, color: "text.primary" }}>{course.name}</Typography>
            </Box>

            <div className="flex flex-col xl:flex-row gap-6">
                {/* Main content area */}
                <div className="flex-1 min-w-0">
                    {/* Banner */}
                    <CourseBanner data={course} isLoading={isLoading} havePurchased={havePurchased} />

                    {/* CTA Buttons below banner */}
                    <Box sx={{ display: "flex", gap: 1.5, my: 2.5 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleStartLearning}
                            sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleStartLearning}
                            sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}
                        >
                            Start Learning
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleStartLearning}
                            sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}
                        >
                            Resume Learning
                        </Button>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ mb: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <TabController options={availableTabs} currentActive={activeTab} setActiveTab={setActiveTab} />
                    </Box>

                    {/* Tab content: Overview */}
                    {activeTab === "overview" && (
                        <div className="pb-6">
                            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 0.5 }}>About this course</Typography>
                            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
                                See the overview of this course to study this course.
                            </Typography>

                            {overviewData?.data?.about_this_course && (
                                <Box className="general-content" sx={{ mb: 3 }}>
                                    {renderHtml(overviewData.data.about_this_course)}
                                </Box>
                            )}

                            {/* Instructors */}
                            {overviewData?.data?.teachers?.length ? (
                                <Box sx={{ mt: 4 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Instructors</Typography>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {overviewData.data.teachers.map((teacher) => (
                                            <InstructorCard key={teacher.id} teacher={teacher} />
                                        ))}
                                    </div>
                                </Box>
                            ) : null}
                        </div>
                    )}

                    {/* Tab content: Curriculum */}
                    {activeTab === "curriculum" && curriculumData?.data?.data?.length && (
                        <div className="pb-4">
                            {curriculumData.data.data.map((subject, idx) => (
                                <Box key={subject.id ?? idx} sx={{
                                    mb: 2, p: 2.5, borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{subject.name}</Typography>
                                    {subject.chapters?.map((ch) => (
                                        <Box key={ch.id} sx={{ ml: 2, mt: 1 }}>
                                            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                                • {ch.name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ))}
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <Box sx={{ py: 4 }}>
                            <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                                Reviews will be available once the backend API is ready.
                            </Typography>
                        </Box>
                    )}
                </div>

                {/* Right sidebar */}
                <Box sx={{ width: { xs: "100%", xl: 320 }, flexShrink: 0 }}>
                    <ProgressSidebar course={course} />
                </Box>
            </div>
        </div>
    );
}
