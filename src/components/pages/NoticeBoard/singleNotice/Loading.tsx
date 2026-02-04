import { Box, Divider, Skeleton, Stack } from "@mui/material";

export default function SingleNoticeLoading() {
    return (
        <div className="single__notice__root h-full overflow-auto pr-4">
            {/* Back Button Skeleton */}
            <Skeleton variant="rectangular" width={200} height={36} sx={{ borderRadius: 1 }} />

            {/* Title Skeleton */}
            <Stack className="mt-8 items-center">
                <Skeleton variant="text" width="60%" height={48} />
            </Stack>

            <Divider className="mt-2! mb-6!" />

            {/* Metadata Skeleton */}
            <Stack className="justify-between mb-6">
                <Stack className="items-center! gap-2">
                    <Stack className="items-center! gap-1">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width={120} height={20} />
                    </Stack>
                </Stack>
                <Stack>
                    <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                </Stack>
            </Stack>

            {/* Content Skeleton */}
            <div className="content mb-8">
                <Stack className="gap-3">
                    <Skeleton variant="text" width="100%" height={24} />
                    <Skeleton variant="text" width="95%" height={24} />
                    <Skeleton variant="text" width="88%" height={24} />
                    <Skeleton variant="text" width="92%" height={24} />
                    <Skeleton variant="text" width="97%" height={24} />
                    <Skeleton variant="text" width="85%" height={24} />
                    <Skeleton variant="text" width="90%" height={24} />
                    <Skeleton variant="text" width="93%" height={24} />
                    <Skeleton variant="text" width="87%" height={24} />
                    <Skeleton variant="text" width="94%" height={24} />
                </Stack>
            </div>

            {/* Image Skeleton */}
            <Box className="mb-6">
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{ borderRadius: 1 }}
                />
            </Box>

            {/* External Link Skeleton */}
            <Skeleton variant="text" width={180} height={24} className="mb-8" />

            {/* Related Notices Skeleton */}
            <Box className="mt-16">
                <Skeleton variant="text" width={150} height={36} className="mb-2" />
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 py-4">
                    {[1, 2, 3].map((item) => (
                        <Box
                            key={item}
                            className="p-4 rounded-md"
                            sx={{
                                boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.08)",
                            }}
                        >
                            <Skeleton variant="text" width="80%" height={28} className="mb-2" />
                            <Stack className="gap-2 mb-4">
                                <Skeleton variant="text" width="100%" height={20} />
                                <Skeleton variant="text" width="90%" height={20} />
                                <Skeleton variant="text" width="70%" height={20} />
                            </Stack>
                            <Stack className="justify-between items-center!">
                                <Stack className="items-center! gap-2">
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton variant="text" width={80} height={20} />
                                </Stack>
                                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
                            </Stack>
                        </Box>
                    ))}
                </div>
            </Box>
        </div>
    );
}