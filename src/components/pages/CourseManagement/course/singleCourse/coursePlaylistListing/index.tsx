import { ArrowBack } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetSinglePlaylistQuery } from "../../../../../../services/courseApi";
import type { QueryParams } from "../../../../../../types";
import type { courseTabType, CurriculumMediaType, PlaylistListing, PlaylistProps } from "../../../../../../types/course";
import { EmptyList } from "../../../../../molecules/EmptyList";
import TablePagination from "../../../../../molecules/Pagination";
import MediaCard from "../../../../../organism/Cards/MediaCard";
import PlaylistCard from "../../../../../organism/Cards/PlaylistCard";
import TableFilter from "../../../../../organism/TableFilter";

const typeToMediaType: Partial<Record<courseTabType, CurriculumMediaType>> = {
    videos: "temp_video",
    notes: "temp_notes",
    audios: "temp_audios",
};

const typeToLabel: Partial<Record<courseTabType, string>> = {
    videos: "Videos",
    notes: "Notes",
    audios: "Audios",
};

const MediaSkeleton = () => (
    <div className="col-span-1 animate-pulse">
        <div className="bg-gray-200 rounded-xl h-14 w-full" />
    </div>
);

const PlaylistSkeleton = () => (
    <div className="col-span-1 animate-pulse mt-4">
        <div className="bg-gray-200 rounded-xl h-48 w-full" />
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
    </div>
);

interface Props {
    courseId: number;
    type: courseTabType;
    havePurchased: boolean;
    data?: PlaylistListing;
    isLoading: boolean;
    qp: QueryParams;
    setQp: (qp: QueryParams) => void;
    totalPages: number;
}

export default function CoursePlaylistListing({ courseId, type, havePurchased, data, isLoading, qp, setQp, totalPages }: Props) {
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistProps | null>(null);
    const [mediaQp, setMediaQp] = useState<QueryParams>({ pageIndex: 1, pageSize: 20 });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: playlistMedia, isLoading: loadingMedia } = useGetSinglePlaylistQuery(
        { id: courseId, playlistId: selectedPlaylist?.chapter_id, type, ...mediaQp, search: debouncedSearch },
        { skip: !selectedPlaylist }
    );

    const playlists = data?.data?.data || [];
    const label = typeToLabel[type] || "Items";
    const mediaType = typeToMediaType[type];

    const mediaItems = playlistMedia?.data?.data || [];
    const mediaPagination = playlistMedia?.data?.pagination;

    // Single playlist / media drill-down view
    if (selectedPlaylist) {
        return (
            <div className="pb-4">
                <div className="mb-4">
                    <Button
                        variant="text"
                        startIcon={<ArrowBack />}
                        onClick={() => {
                            setSelectedPlaylist(null);
                            setSearch("");
                            setMediaQp({ pageIndex: 1, pageSize: 20 });
                        }}
                        sx={{ color: (theme) => theme.palette.separator.darkest }}
                    >
                        <Typography color="text.middle">{selectedPlaylist.chapter_name}</Typography>
                    </Button>
                </div>

                <TableFilter search={search} setSearch={setSearch} />

                <div className="mt-6">
                    {loadingMedia ? (
                        <div className="flex flex-col gap-3">
                            {[...Array(6)].map((_, idx) => <MediaSkeleton key={idx} />)}
                        </div>
                    ) : mediaItems.length > 0 ? (
                        <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 lg:gap-6">
                            {mediaItems.map((media) => (
                                <MediaCard
                                    key={media.id}
                                    media={media}
                                    type={mediaType}
                                    havePurchased={havePurchased}
                                    courseId={courseId}
                                    playlistId={selectedPlaylist.chapter_id}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyList
                            title={`No ${label} Found`}
                            description={`There are no ${label.toLowerCase()} available in this chapter.`}
                            image="/empty-list-placeholder.svg"
                        />
                    )}
                </div>

                {!loadingMedia && (mediaPagination?.total_pages || 0) > 1 && (
                    <div className="mt-6">
                        <TablePagination qp={mediaQp} setQp={setMediaQp} totalPages={mediaPagination?.total_pages || 0} />
                    </div>
                )}
            </div>
        );
    }

    // Playlist chapter listing view
    return (
        <div className="pb-4">
            {isLoading ? (
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 lg:gap-6">
                    {[...Array(6)].map((_, idx) => <PlaylistSkeleton key={idx} />)}
                </div>
            ) : playlists.length > 0 ? (
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 lg:gap-6">
                    {playlists.map((playlist) => (
                        <PlaylistCard
                            key={playlist.chapter_id}
                            data={playlist}
                            courseId={courseId}
                            countLabel={label}
                            onClick={() => setSelectedPlaylist(playlist)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyList
                    title={`No ${label} Found`}
                    description={`There are no ${label.toLowerCase()} available for this course.`}
                    image="/empty-list-placeholder.svg"
                />
            )}

            {!isLoading && totalPages > 1 && (
                <div className="mt-6">
                    <TablePagination qp={qp} setQp={setQp} totalPages={totalPages} />
                </div>
            )}
        </div>
    );
}
