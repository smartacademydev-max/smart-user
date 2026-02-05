import { Box, Divider, Typography } from "@mui/material";
import { Book, Money, Note, Profile2User } from "iconsax-reactjs";
import type { Analytics } from "../../../../types/dashboard";

export default function DashboardAnalyticsCard({ data }: { data: Analytics }) {
    const getIconsBasedOnType = (type: "success" | "error" | "info" | "warning") => {
        switch (type) {
            case "info":
                return <Book variant="Bold" />
            case "error":
                return <Profile2User variant="Bold" />
            case "warning":
                return <Note variant="Bold" />
            case "success":
                return <Money variant="Bold" />
            default:
                return <Money variant="Bold" />
        }
    }
    return (
        <Box className="dashboard__analytics__card rounded-lg lg:py-4 lg:px-6 backdrop-blur-2xl px-3 py-2" sx={{
            background: "rgba(255,255,255,0.1)",
            // border: (theme) => `1px solid ${theme.palette.primary.contrastText}`
        }}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                <Box className="w-11 h-11 flex items-center justify-center rounded-md" sx={{
                    background: (theme) => theme.palette.primary.contrastText,
                    color: (theme) => theme.palette[data.type].main,
                }}>
                    {getIconsBasedOnType(data?.type)}
                </Box>
                <Typography variant="h4">{data?.title}</Typography>
            </div>
            <Divider className='my-4!' sx={{
                background: "rgba(255,255,255,0.3)"
            }} />
            <Typography variant="h2" fontWeight={600}>{data?.value}</Typography>
        </Box>
    )
}
