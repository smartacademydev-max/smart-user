import { Box, Divider, Skeleton, Stack } from '@mui/material';

export default function GorkhapatraCardSkeleton() {
    return (
        <Box
            className="px-1.5 pt-1.5 pb-3 rounded-md h-full flex flex-col justify-between"
            sx={{
                border: (theme) => `1px solid ${theme.palette.textField.border}`
            }}
        >
            <div className="top__wrapper">
                {/* Image Skeleton with Badge */}
                <Box
                    className="image__wrapper aspect-316/132 rounded-md overflow-hidden relative"
                    sx={{
                        background: (theme) => theme.palette.primary.dark
                    }}
                >
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        animation="wave"
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    {/* Status Badge Skeleton */}
                    <Box className="absolute top-2 left-2">
                        <Skeleton
                            variant="rounded"
                            width={80}
                            height={24}
                            animation="wave"
                        />
                    </Box>
                </Box>

                {/* Content Skeleton */}
                <div className="content__box pt-2 px-2">
                    {/* Title Skeleton */}
                    <Skeleton
                        variant="text"
                        width="90%"
                        height={20}
                        animation="wave"
                        sx={{ mb: 1 }}
                    />
                    {/* Subtitle Skeleton */}
                    <Skeleton
                        variant="text"
                        width="70%"
                        height={16}
                        animation="wave"
                    />
                </div>
            </div>

            <div className="bottom px-2">
                <Divider className='my-4!' />

                {/* Date and Views Skeleton */}
                <Stack className='justify-between mb-4'>
                    <Stack className='items-center! gap-1!'>
                        <Skeleton
                            variant="circular"
                            width={20}
                            height={20}
                            animation="wave"
                        />
                        <Skeleton
                            variant="text"
                            width={80}
                            height={14}
                            animation="wave"
                        />
                    </Stack>
                    <Stack className='items-center! gap-1!'>
                        <Skeleton
                            variant="circular"
                            width={20}
                            height={20}
                            animation="wave"
                        />
                        <Skeleton
                            variant="text"
                            width={60}
                            height={14}
                            animation="wave"
                        />
                    </Stack>
                </Stack>

                {/* Button Skeleton */}
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={36}
                    animation="wave"
                />
            </div>
        </Box>
    );
}