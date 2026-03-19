import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PATH } from "../../../../../routes/PATH";
import { useGetCourseMediaByTypeQuery, useGetUserPurchasedCourseQuery } from "../../../../../services/courseApi";
import type { QueryParams } from "../../../../../types";
import type { MediaProps } from "../../../../../types/media";
import { EmptyList } from "../../../../molecules/EmptyList";
import MediaCard from "../../../../organism/Cards/MediaCard";
import TableFilter from "../../../../organism/TableFilter";

const VideoSkeleton = () => (
  <div className="col-span-1 animate-pulse">
    <div className="bg-gray-200 rounded-xl h-48 w-full"></div>
    <div className="mt-3 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const CourseFilterSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-gray-200 rounded-lg"></div>
    <div className="h-10 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export default function AllVideosListing() {
  const [qp] = useState<QueryParams>({
    pageIndex: 1,
    pageSize: 10,
    search: '',
  });

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [qpVideos, setQpVideos] = useState<QueryParams>({
    pageIndex: 1,
    pageSize: 15,
  });
  const [search, setSearch] = useState<string>("");
  const [allVideos, setAllVideos] = useState<MediaProps[]>([]);

  const initialCourseSet = useRef(false);

  const { data: myCourse, isLoading } = useGetUserPurchasedCourseQuery(qp);

  const myCourses = useMemo(() =>
    myCourse?.data?.data || [],
    [myCourse?.data?.data]
  );

  useEffect(() => {
    if (myCourses.length > 0 && !selectedCourseId && !initialCourseSet.current) {
      setSelectedCourseId(myCourses[0].id || null);
      initialCourseSet.current = true;
    }
  }, [myCourses.length, selectedCourseId]);

  const { data: videos, isLoading: loadingVideos, isFetching } = useGetCourseMediaByTypeQuery(
    { id: selectedCourseId!, type: "videos", qp: qpVideos },
    { skip: !selectedCourseId }
  );

  const selectedCourse = useMemo(
    () => myCourses.find(course => course.id === selectedCourseId),
    [myCourses, selectedCourseId]
  );

  const videosList = useMemo(() =>
    videos?.data?.data || [],
    [videos?.data?.data]
  );

  const totalPages = videos?.data?.pagination?.total_pages || 0;
  const currentPage = qpVideos.pageIndex;

  // ✅ Main effect to update allVideos - this handles all cases
  useEffect(() => {
    if (qpVideos.pageIndex === 1) {
      // First page - replace all videos
      setAllVideos(videosList);
    } else if (videosList.length > 0) {
      // Subsequent pages - append new videos
      setAllVideos(prev => {
        const existingIds = new Set(prev.map(v => v.id));
        const newVideos = videosList.filter(v => !existingIds.has(v.id));
        return [...prev, ...newVideos];
      });
    }
  }, [videosList, qpVideos.pageIndex]);

  useEffect(() => {
    setQpVideos(prev => ({ ...prev, pageIndex: 1 }));
  }, [selectedCourseId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQpVideos(prev => ({ ...prev, search, pageIndex: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchMoreVideos = () => {
    if (!loadingVideos && !isFetching && currentPage < totalPages) {
      setQpVideos(prev => ({
        ...prev,
        pageIndex: prev.pageIndex + 1
      }));
    }
  };

  const hasMore = currentPage < totalPages;

  const isLoadingFirstPage = (loadingVideos || isFetching) && qpVideos.pageIndex === 1 && allVideos.length === 0;

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

  if (!myCourses.length) {
    return (
      <EmptyList
        title="You Haven't Purchased any course"
        description="Please purchase a course to view the videos."
        cta={{
          label: "Explore Course",
          url: PATH.COURSE_MANAGEMENT.COURSES.ROOT
        }}
      />
    );
  }

  return (
    <div className="all__video__listing h-full flex flex-col overflow-hidden">
      <div className="mb-6">
        <TableFilter
          search={search || ""}
          setSearch={(search) => setSearch(search)}
          onFilter={() => { }}
          myCourses={myCourses}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={setSelectedCourseId}
        />
      </div>

      {selectedCourse && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCourse.name}
          </h2>
        </div>)}

      <div className="media__listing__wrapper h-full overflow-hidden">
        <Box
          id="video__listing__wrapper"
          className="h-full overflow-auto"
        >
          {isLoadingFirstPage ? (
            <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 lg:gap-6">
              {[...Array(6)].map((_, idx) => (
                <VideoSkeleton key={idx} />
              ))}
            </div>
          ) : allVideos.length > 0 ? (
            <InfiniteScroll
              dataLength={allVideos.length}
              next={fetchMoreVideos}
              hasMore={hasMore}
              scrollableTarget="video__listing__wrapper"
              loader={
                <div className="col-span-1 text-center py-2">
                  <div className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              }
            >
              <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3  3xl:grid-cols-4 lg:gap-6">
                {allVideos.map((media) => (
                  <MediaCard
                    media={media}
                    key={media.id}
                    type="temp_video"
                    havePurchased={true}
                    courseId={selectedCourseId}
                  />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <EmptyList
              title="No Videos Found"
              description="There are no videos available for the selected course."
            />
          )}
        </Box>
      </div>
    </div >
  );
}