import { Box, Skeleton } from "@mui/material";

export default function BannerCardLoading() {
    return (
        <Box
            className="banner__card rounded-2xl 2xl:rounded-4xl flex items-center justify-start overflow-hidden h-full"
        >
            <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{
                    bgcolor: 'rgba(200, 200, 200, 0.2)',
                    minHeight: '250px'
                }}
            />
        </Box>
    );
}