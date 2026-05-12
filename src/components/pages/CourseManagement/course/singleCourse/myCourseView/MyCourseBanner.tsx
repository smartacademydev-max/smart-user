import { Box, Button, Rating, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../../../routes/PATH";
import type { CourseProps } from "../../../../../../types/course";
import { renderHtml } from "../../../../../../utils/renderHtml";

interface MyCourseBannerProps {
    data?: CourseProps;
}

const STAT_ITEMS = [
    { icon: "/book-1.png", key: "subjects", label: "Subjects" },
    { icon: "/notepad-1.png", key: "no_of_notes", label: "Notes" },
    { icon: "/audio-1.png", key: "no_of_audios", label: "Audios" },
    { icon: "/multimedia-1.png", key: "no_of_videos", label: "Videos" },
] as const;

export default function MyCourseBanner({ data }: MyCourseBannerProps) {
    const theme = useTheme();
    const navigate = useNavigate();

    // Rating + reviews come from the course API when available; gracefully hide otherwise.
    const ratingValue = typeof data?.rating === "number" ? data.rating : null;
    const ratingCount = data?.reviews_count != null ? String(data.reviews_count) : null;

    const courseId = Number(data?.id);
    const goToCanvas = () => {
        // Resume / start always lands on the canvas content viewer.
        // First content (id=1) is the placeholder until a "next_up" API is available.
        if (courseId) navigate(PATH.LEARNING_CANVAS.CONTENT_VIEWER.ROOT(courseId, 1));
    };

    return (
        <Box
            className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
            sx={{
                background: `linear-gradient(90deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 55%, ${theme.palette.primary.dark} 100%)`,
                color: theme.palette.secondary.contrastText,
            }}
        >
            {/* Content constrained to the left 2/3 — right portion is reserved for the aside overlay */}
            <div className="lg:pr-[34%]">
                {/* Category chip */}
                <Typography
                    variant="caption"
                    className="inline-block py-1 px-2.5 rounded-md font-medium mb-4!"
                    sx={{
                        bgcolor: theme.palette.primary.contrastText,
                        color: theme.palette.secondary.main,
                    }}
                >
                    {data?.mega_categories?.[0] ?? "Lokesewa"}
                </Typography>

                {/* Title */}
                <Typography variant="h5" fontWeight={600} className="mb-3!">
                    {data?.name}
                </Typography>

                {/* Rating row — only shown when the API exposes rating data */}
                {ratingValue != null && (
                    <div className="flex items-center gap-2 mb-3">
                        <Rating value={ratingValue} precision={0.1} readOnly size="small" sx={{ color: theme.palette.info.main }} />
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            {ratingValue.toFixed(1)}{ratingCount ? ` (${ratingCount} reviews)` : ""}
                        </Typography>
                    </div>
                )}

                {/* Description */}
                {data?.description ? (
                    <Box
                        className="general__content__box mb-5"
                        sx={{ "& *": { color: "rgba(255,255,255,0.85) !important" } }}
                    >
                        {renderHtml(data.description)}
                    </Box>
                ) : null}

                {/* Stat row with PNG icons */}
                <ul className="flex flex-wrap gap-x-6 gap-y-3 mb-6">
                    {STAT_ITEMS.map((item) => {
                        const value = (data as any)?.[item.key] ?? 0;
                        return (
                            <li key={item.key} className="flex items-center gap-2">
                                <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" />
                                <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText }}>
                                    {value} {item.label}
                                </Typography>
                            </li>
                        );
                    })}
                </ul>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="contained"
                        onClick={goToCanvas}
                        sx={{
                            background: theme.palette.primary.contrastText,
                            color: theme.palette.secondary.main,
                            "&:hover": { background: "rgba(255,255,255,0.9)" },
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        Get Started
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={goToCanvas}
                        sx={{
                            borderColor: "rgba(255,255,255,0.6)",
                            color: theme.palette.primary.contrastText,
                            "&:hover": {
                                borderColor: theme.palette.primary.contrastText,
                                background: "rgba(255,255,255,0.08)",
                            },
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        Start Learning
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={goToCanvas}
                        sx={{
                            borderColor: "rgba(255,255,255,0.6)",
                            color: theme.palette.primary.contrastText,
                            "&:hover": {
                                borderColor: theme.palette.primary.contrastText,
                                background: "rgba(255,255,255,0.08)",
                            },
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        Resume Learning
                    </Button>
                </div>
            </div>
        </Box>
    );
}
