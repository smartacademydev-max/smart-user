import { Box, Typography } from "@mui/material";
import { Book, Money, Note, Profile2User } from "iconsax-reactjs";
import type { Analytics } from "../../../../types/dashboard";

// Map API `type` → icon + icon-bg + icon-color
// HTML intent: info=courses(blue), error=classes(teal), warning=tests(amber), success=saved(red)
const CONFIG = {
    info: {
        icon: <Book variant="Bold" size={18} />,
        bg: "secondary.light",
        color: "secondary.main",
    },
    error: {
        icon: <Profile2User variant="Bold" size={18} />,
        bg: "success.light",
        color: "success.main",
    },
    warning: {
        icon: <Note variant="Bold" size={18} />,
        bg: "info.light",
        color: "info.main",
    },
    success: {
        icon: <Money variant="Bold" size={18} />,
        bg: "error.light",
        color: "error.main",
    },
} as const;

export default function DashboardAnalyticsCard({
    data,
    index,
}: {
    data: Analytics;
    index: number;
}) {
    const { icon, bg, color } = CONFIG[data.type] ?? CONFIG.info;

    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: "14px 16px",
                cursor: "default",
                opacity: 0,
                animation: "stat-fade-up 0.3s ease forwards",
                animationDelay: `${index * 0.05}s`,
                transition: "transform 0.15s, box-shadow 0.15s",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                },
                "@keyframes stat-fade-up": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            {/* Icon square */}
            <Box
                sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 1.5,
                    bgcolor: bg,
                    color: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: "10px",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>

            {/* Value */}
            <Typography
                sx={{
                    fontSize: "24px",
                    fontWeight: 800,
                    lineHeight: 1,
                    mb: "3px",
                    color: "text.primary",
                }}
            >
                {data.value}
            </Typography>

            {/* Label */}
            <Typography
                sx={{
                    fontSize: "11.5px",
                    fontWeight: 500,
                    color: "text.secondary",
                }}
            >
                {data.title}
            </Typography>
        </Box>
    );
}
