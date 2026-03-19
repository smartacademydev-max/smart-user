import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseByIdQuery, useGetSinglePlaylistQuery } from "../../../../../../services/courseApi";
import type { QueryParams } from "../../../../../../types";
import { EmptyList } from "../../../../../molecules/EmptyList";
import TablePagination from "../../../../../molecules/Pagination";
import MediaCard from "../../../../../organism/Cards/MediaCard";
import TableFilter from "../../../../../organism/TableFilter";

const CourseFilterSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
    </div>
);


const VideoSkeleton = () => (
    <div className="col-span-1 animate-pulse">
        <div className="bg-gray-200 rounded-xl h-48 w-full"></div>
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);
export default function SinglePlaylist() {
    const { id, playlistId } = useParams();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [qp, setQp] = useState<QueryParams>({
        pageIndex: 1,
        pageSize: 50,
    });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 1000);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading } = useGetCourseByIdQuery({ id: Number(id) }, { skip: !id });
    const { data: videos, isLoading: loadingMedia } = useGetSinglePlaylistQuery({ ...qp, id: Number(id), playlistId: Number(playlistId), type: "videos", search: debouncedSearch }, { skip: !playlistId || !id })

    const handleBackClick = () => {
        navigate(-1);
    };


    const pagination = videos?.data?.pagination;
    const allVideos = videos?.data?.data || []

    if (isLoading) {
        return (
            <div className="all__video__listing">
                <div className="mb-6">
                    <CourseFilterSkeleton />
                </div>
                <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 lg:gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <VideoSkeleton key={idx} />
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="single__playlist__root h-full overflow-hidden flex flex-col items-start gap-4">
            <div className="page__top">
                <Button
                    className="mb-4!"
                    variant="text"
                    startIcon={<ArrowBack />}
                    onClick={handleBackClick}
                    sx={{
                        color: (theme) => theme.palette.separator.darkest
                    }}
                >
                    <Typography color="text.middle">{data?.data?.name}</Typography>
                </Button>

                <TableFilter
                    search={search}
                    setSearch={setSearch}
                />
            </div>

            <div className="media__listing__wrapper flex flex-col justify-between h-full overflow-hidden mt-4 lg:mg-6">
                <Box
                    id="video__listing__wrapper"
                    className="h-full overflow-auto"
                >
                    {loadingMedia ? (
                        <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 lg:gap-6">
                            {[...Array(6)].map((_, idx) => (
                                <VideoSkeleton key={idx} />
                            ))}
                        </div>
                    ) : allVideos.length > 0 ? (
                        <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3  3xl:grid-cols-4 lg:gap-6">
                            {allVideos.map((media) => (
                                <MediaCard
                                    media={media}
                                    key={media.id}
                                    type="temp_video"
                                    havePurchased={true}
                                    courseId={id ? Number(id) : null}
                                    playlistId={playlistId ? Number(playlistId) : null}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyList
                            title="No Videos Found"
                            description="There are no videos available for the selected course."
                        />
                    )}
                </Box>
                <TablePagination
                    qp={qp}
                    setQp={setQp}
                    totalPages={pagination?.total_pages || 0}
                />
            </div>
        </div>
    )
}
