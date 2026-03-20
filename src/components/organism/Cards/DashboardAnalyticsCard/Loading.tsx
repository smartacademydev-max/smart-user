import { Box, Skeleton } from "@mui/material";

export default function DashboardAnalyticsLoading() {
    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: "14px 16px",
            }}
        >
            {/* Icon square skeleton */}
            <Skeleton
                variant="rounded"
                width={34}
                height={34}
                sx={{ borderRadius: 1.5, mb: "10px" }}
            />
            {/* Value skeleton */}
            <Skeleton variant="text" width={52} height={30} sx={{ mb: "3px" }} />
            {/* Label skeleton */}
            <Skeleton variant="text" width={110} height={18} />
        </Box>
    );
}
