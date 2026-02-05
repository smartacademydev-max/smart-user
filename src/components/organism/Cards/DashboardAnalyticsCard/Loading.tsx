import { Box, Divider, Skeleton } from "@mui/material";

export default function DashboardAnalyticsLoading() {
    return (
        <Box
            className="dashboard__analytics__card rounded-lg lg:py-4 lg:px-6 backdrop-blur-2xl px-3 py-2"
            sx={{
                background: "rgba(255,255,255,0.1)",
            }}
        >
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                {/* Icon Skeleton */}
                <Skeleton
                    variant="rounded"
                    width={44}
                    height={44}
                    animation="wave"
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px'
                    }}
                />
                {/* Title Skeleton */}
                <Skeleton
                    variant="text"
                    width={120}
                    height={32}
                    animation="wave"
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                />
            </div>

            <Divider
                className='my-4!'
                sx={{
                    background: "rgba(255,255,255,0.3)"
                }}
            />

            {/* Value Skeleton */}
            <Skeleton
                variant="text"
                width={80}
                height={48}
                animation="wave"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
            />
        </Box>
    )
}
