import { Box, Divider } from "@mui/material";

export default function TestCardSkeleton () {
    return (
        <Box
            className="test__card rounded-md p-4 flex flex-col justify-between"
            sx={{ border: (theme) => `1px solid ${theme.palette.separator.dark}` }}
        >
            {/* ── Top ── */}
            <div className="card__top">

                {/* Category pill + Status pill */}
                <div className="flex justify-between items-center mb-3">
                    <div className="h-7 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-7 w-28 bg-gray-200 rounded-full animate-pulse" />
                </div>

                {/* Test name */}
                <div className="mb-3 space-y-1.5">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>

                {/* Start date row */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />   {/* Calendar icon */}
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />  {/* "Start Date:" */}
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />  {/* Date value */}
                </div>

                {/* Questions + Duration */}
                <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>

                <Divider className="my-1.5!" />

                {/* Total marks + Pass marks */}
                <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* ── Bottom action button ── */}
            <div className="bottom__wrapper mt-3">
                <div className="h-9 w-full bg-gray-200 rounded-lg animate-pulse" />
            </div>
        </Box>
    );
};