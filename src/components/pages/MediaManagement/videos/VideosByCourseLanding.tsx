import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../routes/PATH";
import { useGetCourseMediaPlaylistQuery, useGetUserPurchasedCourseQuery } from "../../../../services/courseApi";
import type { QueryParams } from "../../../../types";
import type { CourseProps } from "../../../../types/course";
import { EmptyList } from "../../../molecules/EmptyList";
import TablePagination from "../../../molecules/Pagination";
import PlaylistCard from "../../../organism/Cards/PlaylistCard";
import CourseSectionShell from "../../../organism/LandingByCourse/CourseSectionShell";
import ViewAllTile from "../../../organism/LandingByCourse/ViewAllTile";
import PageHeader from "../../../organism/PageHeader";

const PREVIEW_PAGE_SIZE = 4;
const MAX_VISIBLE = 4;
const COURSES_PER_PAGE = 5;

function VideoPreviewSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
            ))}
        </div>
    );
}

function VideosSection({ course }: { course: CourseProps }) {
    const { data, isLoading } = useGetCourseMediaPlaylistQuery(
        { id: course.id!, type: "videos", qp: { pageIndex: 1, pageSize: PREVIEW_PAGE_SIZE } },
        { skip: !course.id }
    );
    const items = data?.data?.data || [];
    const total = data?.data?.pagination?.total ?? items.length;
    const viewAllUrl = PATH.VIDEOS.BY_COURSE.ROOT(course.id);
    const visibleItems = total > MAX_VISIBLE ? items.slice(0, MAX_VISIBLE - 1) : items.slice(0, MAX_VISIBLE);
    const extra = total - visibleItems.length;

    return (
        <CourseSectionShell
            courseName={course.name}
            count={total}
            viewAllUrl={viewAllUrl}
            viewAllDisabled={!items.length}
        >
            {isLoading ? (
                <VideoPreviewSkeleton />
            ) : items.length === 0 ? (
                <div className="text-sm text-gray-500 italic py-4">No videos yet for this course.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4">
                    {visibleItems.map((item) => (
                        <PlaylistCard key={item.chapter_id} data={item} courseId={course.id} />
                    ))}
                    {extra > 0 && (
                        <ViewAllTile extra={extra} url={viewAllUrl} label="videos" variant="playlist" />
                    )}
                </div>
            )}
        </CourseSectionShell>
    );
}

export default function VideosByCourseLanding() {
    const { t } = useTranslation();
    const [qp, setQp] = useState<QueryParams>({ pageIndex: 1, pageSize: COURSES_PER_PAGE });
    const { data, isLoading } = useGetUserPurchasedCourseQuery(qp);
    const courses = data?.data?.data || [];
    const totalPages = data?.data?.pagination?.total_pages || 0;

    return (
        <>
            <PageHeader breadcrumb={[{ title: t("menus.videos") }]} />
            {isLoading ? (
                <div className="flex flex-col gap-8">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i}>
                            <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-3" />
                            <VideoPreviewSkeleton />
                        </div>
                    ))}
                </div>
            ) : !courses.length ? (
                <EmptyList
                    title="You Haven't Purchased any course"
                    description="Please purchase a course to view the videos."
                    cta={{ label: "Explore Course", url: PATH.COURSE_MANAGEMENT.COURSES.ROOT }}
                />
            ) : (
                <>
                    <div className="flex flex-col">
                        {courses.map((course) => (
                            <VideosSection key={course.id} course={course} />
                        ))}
                    </div>
                    <TablePagination qp={qp} setQp={setQp} totalPages={totalPages} />
                </>
            )}
        </>
    );
}
