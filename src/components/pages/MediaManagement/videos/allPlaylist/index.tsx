import { ArrowLeft2, SearchNormal1 } from "iconsax-reactjs";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../../routes/PATH";
import { useGetCourseMediaPlaylistQuery, useGetUserPurchasedCourseQuery } from "../../../../../services/courseApi";
import type { QueryParams } from "../../../../../types";
import { EmptyList } from "../../../../molecules/EmptyList";
import PlaylistCard from "../../../../organism/Cards/PlaylistCard";

const VideoSkeleton = () => (
    <div className="col-span-1 animate-pulse">
        <div className="bg-gray-200 rounded-xl h-48 w-full"></div>
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

export default function CoursePlaylist() {
    const navigate = useNavigate();
    const { courseId: courseIdParam } = useParams<{ courseId: string }>();
    const courseId = courseIdParam ? Number(courseIdParam) : null;

    const [qpVideos, setQpVideos] = useState<QueryParams>({ pageIndex: 1, pageSize: 15 });
    const [search, setSearch] = useState<string>("");

    const { data: myCourse } = useGetUserPurchasedCourseQuery({ pageIndex: 1, pageSize: 50 });
    const selectedCourse = useMemo(
        () => (myCourse?.data?.data || []).find((c) => c.id === courseId),
        [myCourse?.data?.data, courseId]
    );

    const { data: playlist, isLoading: loadingPlaylist } = useGetCourseMediaPlaylistQuery(
        { id: courseId!, type: "videos", qp: qpVideos },
        { skip: !courseId }
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setQpVideos((prev) => ({ ...prev, search, pageIndex: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    if (!courseId) {
        navigate(PATH.VIDEOS.ROOT, { replace: true });
        return null;
    }

    return (
        <div className="all__video__listing h-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
                <Link to={PATH.VIDEOS.ROOT} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <IconButton size="small"><ArrowLeft2 size={18} /></IconButton>
                    <span>All Videos</span>
                </Link>
            </div>

            {selectedCourse && (
                <div className="mb-4 pb-3 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h2>
                </div>
            )}

            <div className="mb-4">
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search videos"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchNormal1 size={18} />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div className="h-full overflow-auto">
                {loadingPlaylist ? (
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 lg:gap-6">
                        {[...Array(6)].map((_, idx) => (
                            <VideoSkeleton key={idx} />
                        ))}
                    </div>
                ) : playlist && playlist?.data?.data?.length > 0 ? (
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
                        {playlist?.data?.data?.map((item) => (
                            <PlaylistCard data={item} key={item.chapter_id} courseId={selectedCourse?.id} />
                        ))}
                    </div>
                ) : (
                    <EmptyList
                        title="No Videos Found"
                        description="There are no videos available for this course."
                    />
                )}
            </div>
        </div>
    );
}
