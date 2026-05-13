import { Box, Button, Typography, useTheme } from "@mui/material";
import { ArrowDown2 } from "iconsax-reactjs";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useGetCourseByIdQuery } from "../../../../services/courseApi";

// Static mock — replaced with useGetCourseCompletionQuery when API is ready
const MOCK_COMPLETION = {
    progress: 100,
    lessons_done: 12,
    quizzes_passed: 4,
    certificate_file_name: "E-Certificate-Tushar.pdf",
    certificate_file_size: "3.2 MB",
    certificate_url: "#",
};

export default function CourseCompletion() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data } = useGetCourseByIdQuery({ id: Number(courseId) });
    const course = data?.data;
    const userName = "Tushar"; // Will come from auth/user state

    return (
        <div className="h-full overflow-auto flex items-center justify-center p-6">
            <Box sx={{
                maxWidth: 620, width: "100%", textAlign: "center",
                bgcolor: "background.paper", borderRadius: 3, p: { xs: 3, md: 5 },
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                position: "relative", overflow: "hidden",
            }}>
                {/* Confetti decoration (top area) */}
                <Box sx={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 120,
                    background: "url('/confetti.svg') no-repeat center top",
                    backgroundSize: "contain",
                    opacity: 0.9,
                    pointerEvents: "none",
                }} />

                {/* Success icon */}
                <Box sx={{
                    width: 80, height: 80, borderRadius: "50%",
                    bgcolor: "#10B981", border: "6px solid #A7F3D0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    mx: "auto", mb: 2, mt: 6, position: "relative", zIndex: 1,
                }}>
                    <Typography sx={{ fontSize: 32, color: "#fff" }}>✓</Typography>
                </Box>

                <Typography sx={{ fontWeight: 700, fontSize: 24, mb: 0.5 }}>
                    Congratulations,
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 24, mb: 2 }}>
                    {userName}!
                </Typography>
                <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 4, px: { md: 4 }, lineHeight: 1.7 }}>
                    You've successfully completed <strong>{course?.name || "Engineering Preparation"}</strong>.
                    Your dedication and hard work paid off — you're now one step closer to your goals.
                </Typography>

                {/* Stat cards — colored borders, white bg */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
                    <Box sx={{
                        flex: 1, py: 2, px: 1.5, borderRadius: 2,
                        border: `2px solid #C4B5FD`,
                    }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 30, color: "#7C3AED" }}>
                            {MOCK_COMPLETION.progress}%
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#7C3AED", fontWeight: 500 }}>
                            Progress
                        </Typography>
                    </Box>
                    <Box sx={{
                        flex: 1, py: 2, px: 1.5, borderRadius: 2,
                        border: `2px solid #6EE7B7`,
                    }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 30, color: "#059669" }}>
                            {MOCK_COMPLETION.lessons_done}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#059669", fontWeight: 500 }}>
                            Lesson Done
                        </Typography>
                    </Box>
                    <Box sx={{
                        flex: 1, py: 2, px: 1.5, borderRadius: 2,
                        border: `2px solid #FDBA74`,
                    }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 30, color: "#EA580C" }}>
                            {MOCK_COMPLETION.quizzes_passed}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#EA580C", fontWeight: 500 }}>
                            Quizzies Passed
                        </Typography>
                    </Box>
                </Box>

                {/* CTA buttons */}
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.ROOT)}
                        sx={{ flex: 1, maxWidth: 220, textTransform: "none", borderRadius: 2, py: 1.2 }}
                    >
                        Explore More Course
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate(PATH.MY_COURSE.ROOT)}
                        sx={{
                            flex: 1, maxWidth: 220, textTransform: "none", borderRadius: 2, py: 1.2,
                            bgcolor: "#1A2B57", "&:hover": { bgcolor: "#0f1d3d" },
                        }}
                    >
                        Go to my Learning Canvas
                    </Button>
                </Box>

                {/* Certificate download */}
                <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}>
                    <Typography sx={{ fontSize: 14, color: "text.primary", mb: 2.5, fontWeight: 500 }}>
                        Upon on Completion, you will receive certificate of appreciation from us.
                    </Typography>
                    <Box sx={{
                        display: "flex", alignItems: "center", gap: 2, p: 2,
                        borderRadius: 2, border: `1px solid ${theme.palette.divider}`,
                        mx: "auto", maxWidth: 420, textAlign: "left",
                    }}>
                        {/* Certificate thumbnail */}
                        <Box sx={{
                            width: 56, height: 56, borderRadius: 1.5,
                            bgcolor: "#EEF2FF", border: `1px solid ${theme.palette.divider}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "primary.main", textAlign: "center", lineHeight: 1.2 }}>
                                CERTIFICATE
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                                {MOCK_COMPLETION.certificate_file_name}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                {MOCK_COMPLETION.certificate_file_size}
                            </Typography>
                        </Box>
                        <Box
                            component="a"
                            href={MOCK_COMPLETION.certificate_url}
                            download
                            sx={{ p: 1, cursor: "pointer", color: "text.secondary", "&:hover": { color: "primary.main" } }}
                        >
                            <ArrowDown2 size={20} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
