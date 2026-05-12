import { Box, LinearProgress, Skeleton, Typography } from "@mui/material";
import { Book, Flash, PlayCircle } from "iconsax-reactjs";
import { useGetCanvasCourseProgressQuery } from "../../../../../../services/courseApi";
import type { CourseProps } from "../../../../../../types/course";
import type { StudyStreakDay } from "../../../../../../types/learningCanvas";

interface MyCourseSidebarProps {
    data?: CourseProps;
}

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * Normalise the API study_streak array into a 7-cell mon-to-sun bool row
 * covering the current week. If fewer than 7 days are returned, missing days are inactive.
 */
function normaliseWeekActivity(streak: StudyStreakDay[] | undefined): boolean[] {
    if (!streak?.length) return new Array(7).fill(false);
    // Map by weekday: Mon=0 .. Sun=6
    const week = new Array(7).fill(false) as boolean[];
    for (const d of streak) {
        const dt = new Date(d.date);
        if (isNaN(dt.getTime())) continue;
        const jsDay = dt.getDay();             // Sun=0 .. Sat=6
        const monIdx = jsDay === 0 ? 6 : jsDay - 1;
        if (d.has_activity) week[monIdx] = true;
    }
    return week;
}

function countStreakDays(streak: StudyStreakDay[] | undefined): number {
    if (!streak?.length) return 0;
    return streak.filter((d) => d.has_activity).length;
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <Box
            className={`rounded-2xl bg-white p-5 ${className}`}
            sx={{ border: "1px solid #E5E7EB" }}
        >
            {children}
        </Box>
    );
}

// ─── Your Progress ────────────────────────────────────────────────────────────
function ProgressCard({
    progress,
    expiresOn,
    lessonsDone,
    testsPassed,
    assignments,
}: {
    progress: number;
    expiresOn: string | null;
    lessonsDone: number;
    testsPassed: number;
    assignments: number;
}) {
    return (
        <Card>
            <Typography variant="subtitle1" fontWeight={600} className="mb-1!">
                Your Progress
            </Typography>
            <Typography variant="caption" className="text-gray-500 block mb-4!">
                Keep going! You're making great progress.
            </Typography>

            <div className="flex justify-between items-end mb-1">
                <Typography variant="caption" className="text-gray-500">
                    Progress
                </Typography>
                {expiresOn && (
                    <Typography variant="caption" className="text-gray-500">
                        Expires
                    </Typography>
                )}
            </div>
            <div className="flex justify-between items-center mb-2">
                <Typography variant="body2" fontWeight={600} sx={{ color: "#16A34A" }}>
                    {progress}% Completed
                </Typography>
                {expiresOn && (
                    <Typography variant="body2" fontWeight={600}>
                        {expiresOn}
                    </Typography>
                )}
            </div>

            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 6,
                    borderRadius: 99,
                    bgcolor: "#DCFCE7",
                    "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #16A34A, #4ADE80)",
                        borderRadius: 99,
                    },
                    mb: 3,
                }}
            />

            <div className="grid grid-cols-3 gap-2">
                <StatPill value={lessonsDone} label="Lessons Done" bg="#DBEAFE" color="#1D4ED8" />
                <StatPill value={testsPassed} label="Tests Passed" bg="#FEE2E2" color="#B91C1C" />
                <StatPill value={assignments} label="Assignments" bg="#DCFCE7" color="#15803D" />
            </div>
        </Card>
    );
}

function StatPill({ value, label, bg, color }: { value: number; label: string; bg: string; color: string }) {
    return (
        <Box className="rounded-xl py-2 px-2 text-center" sx={{ bgcolor: bg }}>
            <Typography variant="h6" fontWeight={700} sx={{ color, lineHeight: 1.2 }}>
                {value}
            </Typography>
            <Typography variant="caption" sx={{ color, fontSize: "10.5px" }}>
                {label}
            </Typography>
        </Box>
    );
}

// ─── Study Streak ─────────────────────────────────────────────────────────────
function StudyStreakCard({
    streakDays,
    weekActivity,
}: {
    streakDays: number;
    weekActivity: boolean[];
}) {
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flash size={18} variant="Bold" color="#F97316" />
                    <Typography variant="subtitle1" fontWeight={600}>
                        Study Streak
                    </Typography>
                </div>
                <Typography variant="caption" fontWeight={600} sx={{ color: "#F97316" }}>
                    {streakDays} day{streakDays === 1 ? "" : "s"}
                </Typography>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-3">
                {weekActivity.map((active, i) => (
                    <Box
                        key={i}
                        sx={{
                            height: 40,
                            borderRadius: "6px",
                            background: active
                                ? "linear-gradient(180deg, #FB923C, #F97316)"
                                : "#F3F4F6",
                        }}
                    />
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {WEEK_LABELS.map((label, i) => (
                    <Typography
                        key={i}
                        variant="caption"
                        className="text-center text-gray-500"
                    >
                        {label}
                    </Typography>
                ))}
            </div>

            <Typography variant="caption" className="block text-gray-500 mt-3!">
                Keep it up — study today to extend your streak!
            </Typography>
        </Card>
    );
}

// ─── Next Up ──────────────────────────────────────────────────────────────────
function NextUpCard({
    title,
    durationLabel,
}: {
    title: string;
    durationLabel: string;
}) {
    return (
        <Card>
            <div className="flex items-center gap-2 mb-3">
                <Book size={18} color="#3B82F6" variant="Bold" />
                <Typography variant="subtitle1" fontWeight={600}>
                    Next Up
                </Typography>
            </div>

            <Box
                className="rounded-xl p-3 flex items-center gap-3"
                sx={{ bgcolor: "#F8FAFC" }}
            >
                <Box
                    className="rounded-lg w-9 h-9 flex items-center justify-center shrink-0"
                    sx={{ bgcolor: "#3B82F6" }}
                >
                    <PlayCircle size={20} color="white" variant="Bold" />
                </Box>
                <div className="flex-1 min-w-0">
                    <Typography variant="body2" fontWeight={600} className="truncate">
                        {title}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                        {durationLabel}
                    </Typography>
                </div>
            </Box>
        </Card>
    );
}

// ─── Course Stats ─────────────────────────────────────────────────────────────
function CourseStatsCard({
    videosWatched,
    totalVideos,
    audiosListened,
    totalAudios,
    notesRead,
    totalNotes,
}: {
    videosWatched: number;
    totalVideos: number;
    audiosListened: number;
    totalAudios: number;
    notesRead: number;
    totalNotes: number;
}) {
    const rows = [
        { label: "Videos Watched", done: videosWatched, total: totalVideos, color: "#3B82F6" },
        { label: "Audios Listened", done: audiosListened, total: totalAudios, color: "#A855F7" },
        { label: "Notes Read", done: notesRead, total: totalNotes, color: "#10B981" },
    ];
    return (
        <Card>
            <Typography variant="subtitle1" fontWeight={600} className="mb-3!">
                Course Stats
            </Typography>
            <div className="flex flex-col gap-3">
                {rows.map((row) => {
                    const pct = row.total > 0 ? (row.done / row.total) * 100 : 0;
                    return (
                        <div key={row.label}>
                            <div className="flex justify-between mb-1">
                                <Typography variant="caption" className="text-gray-600">
                                    {row.label}
                                </Typography>
                                <Typography variant="caption" fontWeight={600}>
                                    {row.done}/{row.total}
                                </Typography>
                            </div>
                            <LinearProgress
                                variant="determinate"
                                value={pct}
                                sx={{
                                    height: 5,
                                    borderRadius: 99,
                                    bgcolor: "#F3F4F6",
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: row.color,
                                        borderRadius: 99,
                                    },
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

// ─── Sidebar shell ────────────────────────────────────────────────────────────
export default function MyCourseSidebar({ data }: MyCourseSidebarProps) {
    const courseId = Number(data?.id);
    const { data: canvasProgressApi, isLoading } = useGetCanvasCourseProgressQuery(
        { courseId },
        { skip: !courseId }
    );

    if (isLoading && !canvasProgressApi) {
        return (
            <div className="flex flex-col gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={160} />
                ))}
            </div>
        );
    }

    const cp = canvasProgressApi?.data;

    // Course-level progress: prefer canvas-progress field, fall back to course.progress, then 0.
    const progress = cp?.progress ?? data?.progress ?? 0;

    // Expiry: prefer canvas-progress.expires_on, fall back to course.ends_at (date portion).
    const expiresOn = cp?.expires_on ?? (data?.ends_at?.split(",")?.[0] ?? null);

    // Stat pills
    const lessonsDone = cp?.lessons_done ?? 0;
    const testsPassed = cp?.quizzes_passed ?? 0;
    const assignments = cp?.assignments_done ?? 0;

    // Streak
    const streakDays = countStreakDays(cp?.study_streak);
    const weekActivity = normaliseWeekActivity(cp?.study_streak);

    // Next up
    const nextUpTitle = cp?.next_up?.content_title ?? "Nothing queued — start a chapter to begin.";
    const nextUpDuration = cp?.next_up?.duration_label
        ?? (cp?.next_up?.content_type ? `${cp.next_up.content_type.charAt(0).toUpperCase()}${cp.next_up.content_type.slice(1)}` : "");

    // Course stats — totals from canvas-progress, fall back to course.no_of_*
    const totalVideos = cp?.course_stats?.total_videos ?? data?.no_of_videos ?? 0;
    const totalAudios = cp?.course_stats?.total_audios ?? data?.no_of_audios ?? 0;
    const totalNotes = cp?.course_stats?.total_notes ?? data?.no_of_notes ?? 0;
    const videosWatched = cp?.course_stats?.videos_watched ?? 0;
    const audiosListened = cp?.course_stats?.audios_listened ?? 0;
    const notesRead = cp?.course_stats?.notes_read ?? 0;

    return (
        <div className="flex flex-col gap-4">
            <ProgressCard
                progress={Math.round(progress)}
                expiresOn={expiresOn}
                lessonsDone={lessonsDone}
                testsPassed={testsPassed}
                assignments={assignments}
            />
            <StudyStreakCard streakDays={streakDays} weekActivity={weekActivity} />
            <NextUpCard title={nextUpTitle} durationLabel={nextUpDuration} />
            <CourseStatsCard
                videosWatched={videosWatched}
                totalVideos={totalVideos}
                audiosListened={audiosListened}
                totalAudios={totalAudios}
                notesRead={notesRead}
                totalNotes={totalNotes}
            />
        </div>
    );
}
