import { ArrowLeft2, SearchNormal1 } from "iconsax-reactjs";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../../routes/PATH";
import { useGetUserPurchasedCourseQuery } from "../../../../../services/courseApi";
import { useGetAllLiveClassesQuery } from "../../../../../services/liveApi";
import type { QueryParams } from "../../../../../types";
import type { LiveClassProps } from "../../../../../types/liveClass";
import { EmptyList } from "../../../../molecules/EmptyList";
import TabController from "../../../../molecules/TabController";
import LiveClassCard from "../../../../organism/Cards/LiveClassCard";
import PageHeader from "../../../../organism/PageHeader";

type Status = "ongoing" | "upcoming";

const VideoSkeleton = () => (
    <div className="col-span-1 animate-pulse">
        <div className="bg-gray-200 rounded-xl h-48 w-full" />
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
    </div>
);

export default function AllLiveClassList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { courseId: courseIdParam } = useParams<{ courseId: string }>();
    const courseId = courseIdParam ? Number(courseIdParam) : null;

    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<Status>("ongoing");
    const [qp, setQp] = useState<QueryParams>({ pageIndex: 1, pageSize: 15 });
    const [items, setItems] = useState<LiveClassProps[]>([]);

    const { data: myCourse } = useGetUserPurchasedCourseQuery({ pageIndex: 1, pageSize: 50 });
    const selectedCourse = useMemo(
        () => (myCourse?.data?.data || []).find((c) => c.id === courseId),
        [myCourse?.data?.data, courseId]
    );

    const { data, isLoading: loadingLiveClass } = useGetAllLiveClassesQuery(
        { id: courseId!, ...qp, type: activeTab },
        { skip: !courseId }
    );
    const list = data?.data?.data ?? [];
    const totalPages = data?.data?.pagination?.total_pages ?? 0;
    const hasMore = qp.pageIndex < totalPages;

    useEffect(() => {
        if (qp.pageIndex === 1) {
            setItems(list);
            return;
        }
        setItems((prev) => {
            const ids = new Set(prev.map((v) => v.id));
            return [...prev, ...list.filter((v) => !ids.has(v.id))];
        });
    }, [list, qp.pageIndex]);

    useEffect(() => {
        setQp((prev) => (prev.pageIndex === 1 ? prev : { ...prev, pageIndex: 1 }));
    }, [activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setQp((prev) =>
                prev.pageIndex === 1 && prev.search === search
                    ? prev
                    : { ...prev, pageIndex: 1, search }
            );
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchMore = () => {
        if (!loadingLiveClass && hasMore) {
            setQp((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    };

    if (!courseId) {
        navigate(PATH.LIVE_CLASSES.ROOT, { replace: true });
        return null;
    }

    return (
        <div className="all__note__listing">
            <div className="mb-4">
                <PageHeader breadcrumb={[{ title: t("menus.liveClasses") }]} />
            </div>

            <div className="flex items-center gap-3 mb-4">
                <Link to={PATH.LIVE_CLASSES.ROOT} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <IconButton size="small"><ArrowLeft2 size={18} /></IconButton>
                    <span>All Live Classes</span>
                </Link>
            </div>

            {selectedCourse && (
                <div className="mb-4 pb-3 border-b">
                    <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                </div>
            )}

            <div className="mb-4">
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search live classes"
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

            <TabController
                options={[
                    { value: "ongoing", label: "Ongoing Classes" },
                    { value: "upcoming", label: "Upcoming Classes" },
                ]}
                currentActive={activeTab}
                setActiveTab={(value) => setActiveTab(value as Status)}
            />

            <div className="media__listing__wrapper mt-4">
                <Box id="video__listing__wrapper" sx={{ maxHeight: "100%", overflow: "auto" }}>
                    {loadingLiveClass && qp.pageIndex === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <VideoSkeleton key={i} />
                            ))}
                        </div>
                    ) : items.length ? (
                        <InfiniteScroll
                            dataLength={items.length}
                            next={fetchMore}
                            hasMore={hasMore}
                            scrollableTarget="video__listing__wrapper"
                            loader={
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <VideoSkeleton key={i} />
                                    ))}
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {items.map((item) => (
                                    <LiveClassCard
                                        key={item.id}
                                        data={item}
                                        courseId={Number(item.course_id)}
                                    />
                                ))}
                            </div>
                        </InfiniteScroll>
                    ) : (
                        <EmptyList
                            title="No Live Classes Found"
                            description="There are no live classes for this course right now."
                        />
                    )}
                </Box>
            </div>
        </div>
    );
}
