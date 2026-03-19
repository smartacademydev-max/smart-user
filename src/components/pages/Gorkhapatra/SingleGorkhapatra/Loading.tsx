import { Box, Divider, Skeleton, Stack } from "@mui/material";

export default function SingleGorkhapatraLoading() {
    return (
        <div className="single__gorkhapatra__root h-full overflow-auto">
            {/* Back Button Skeleton */}
            <Skeleton variant="rectangular" width={200} height={36} sx={{ borderRadius: 1 }} />

            {/* Title Skeleton */}
            <Stack className="mt-8 items-center">
                <Skeleton variant="text" width="70%" height={48} />
            </Stack>

            <Divider className="mt-2! mb-6!" />

            {/* Thumbnail/Image Skeleton */}
            <Box
                className="image__wrapper aspect-1460/534 rounded-lg mb-8 overflow-hidden"
            >
                <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>

            {/* Metadata Skeleton */}
            <Stack className="justify-between flex-wrap!">
                <Stack className="items-center! flex-wrap! gap-2 mb-6">
                    <Stack className="items-center! gap-1">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width={150} height={20} />
                    </Stack>
                    <Stack className="items-center! gap-1">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width={120} height={20} />
                    </Stack>
                    <Stack className="items-center! gap-1">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width={100} height={20} />
                    </Stack>
                </Stack>
                <Stack>
                    <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                </Stack>
            </Stack>

            {/* Content Area Skeleton */}
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 mt-4">
                {/* Table of Contents Skeleton */}
                <div className="lg:col-span-4">
                    <Skeleton variant="text" width="60%" height={28} className="mb-2" />
                    <Stack className="gap-2 flex-col!">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <Skeleton
                                key={item}
                                variant="rectangular"
                                height={40}
                                sx={{ borderRadius: 1 }}
                            />
                        ))}
                    </Stack>
                </div>

                {/* Content Skeleton */}
                <div className="lg:col-span-8">
                    <Stack className="gap-3">
                        <Skeleton variant="text" width="90%" height={32} />
                        <Skeleton variant="text" width="100%" height={24} />
                        <Skeleton variant="text" width="95%" height={24} />
                        <Skeleton variant="text" width="88%" height={24} />

                        <Box className="mt-4">
                            <Skeleton variant="text" width="85%" height={32} />
                            <Skeleton variant="text" width="100%" height={24} />
                            <Skeleton variant="text" width="92%" height={24} />
                            <Skeleton variant="text" width="97%" height={24} />
                            <Skeleton variant="text" width="90%" height={24} />
                        </Box>

                        <Box className="mt-4">
                            <Skeleton variant="text" width="80%" height={32} />
                            <Skeleton variant="text" width="100%" height={24} />
                            <Skeleton variant="text" width="94%" height={24} />
                            <Skeleton variant="text" width="88%" height={24} />
                        </Box>
                    </Stack>
                </div>
            </div>

            {/* Related Gorkhapatra Skeleton */}
            <Box className="mt-16">
                <Skeleton variant="text" width={200} height={36} className="mb-2" />
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <Box
                            key={item}
                            className="px-1.5 pt-1.5 pb-3 rounded-md"
                            sx={{
                                border: (theme) => `1px solid ${theme.palette.textField.border}`,
                            }}
                        >
                            <Skeleton
                                variant="rectangular"
                                className="aspect-316/132 rounded-md mb-2"
                            />
                            <Stack className="px-2 gap-2">
                                <Skeleton variant="text" width="90%" height={24} />
                                <Skeleton variant="text" width="70%" height={20} />
                            </Stack>
                            <Divider className="my-4!" />
                            <Stack className="px-2 justify-between items-center! mb-4">
                                <Skeleton variant="text" width={80} height={20} />
                                <Skeleton variant="text" width={80} height={20} />
                            </Stack>
                            <Box className="px-2">
                                <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
                            </Box>
                        </Box>
                    ))}
                </div>
            </Box>
        </div>
    );
}