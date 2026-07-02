import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../routes/PATH";
import { useGetCourseLiveClassQuery, useGetFreeMaterialsCourseQuery, useGetUserPurchasedCourseQuery } from "../../../../services/courseApi";
import { useGetAllLiveClassesQuery } from "../../../../services/liveApi";
import type { QueryParams } from "../../../../types";
import type { CourseProps } from "../../../../types/course";
import { EmptyList } from "../../../molecules/EmptyList";
import TablePagination from "../../../molecules/Pagination";
import TabController from "../../../molecules/TabController";
import LiveClassCard from "../../../organism/Cards/LiveClassCard";
import CourseSectionShell from "../../../organism/LandingByCourse/CourseSectionShell";
import ViewAllTile from "../../../organism/LandingByCourse/ViewAllTile";
import PageHeader from "../../../organism/PageHeader";

type LiveClassType = "ongoing" | "upcoming";

const PREVIEW_PAGE_SIZE = 4;
const MAX_VISIBLE = 4;
const COURSES_PER_PAGE = 5;

function LiveClassPreviewSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-44 rounded-xl bg-gray-100 animate-pulse" />
            ))}
        </div>
    );
}

function FreeLiveClassesSection({ type }: { type: LiveClassType }) {
    const { data: freeCourseRes } = useGetFreeMaterialsCourseQuery();
    const freeCourseId = freeCourseRes?.data?.id ?? null;

    const { data, isLoading } = useGetCourseLiveClassQuery(
        { id: freeCourseId!, pageIndex: 1, pageSize: PREVIEW_PAGE_SIZE, type },
        { skip: !freeCourseId }
    );
    const items = data?.data?.data ?? [];
    const total = data?.data?.pagination?.total ?? items.length;
    const viewAllUrl = `${PATH.FREE_MATERIALS.ROOT}?category=live_classes`;
    const visibleItems = total > MAX_VISIBLE ? items.slice(0, MAX_VISIBLE - 1) : items.slice(0, MAX_VISIBLE);
    const extra = total - visibleItems.length;

    if (!freeCourseId) return null;
    if (!isLoading && items.length === 0) return null;

    return (
        <CourseSectionShell
            courseName="Free Live Classes"
            count={total}
            viewAllUrl={viewAllUrl}
            viewAllDisabled={!items.length}
        >
            {isLoading ? (
                <LiveClassPreviewSkeleton />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4">
                    {visibleItems.map((item) => (
                        <LiveClassCard key={item.id} data={item} courseId={freeCourseId} />
                    ))}
                    {extra > 0 && (
                        <ViewAllTile extra={extra} url={viewAllUrl} label="live classes" variant="card" />
                    )}
                </div>
            )}
        </CourseSectionShell>
    );
}

function LiveClassesSection({ course, type }: { course: CourseProps; type: LiveClassType }) {
    const { data, isLoading } = useGetAllLiveClassesQuery({
        id: course.id!,
        pageIndex: 1,
        pageSize: PREVIEW_PAGE_SIZE,
        type,
    });
    const items = data?.data?.data ?? [];
    const total = data?.data?.pagination?.total ?? items.length;
    const viewAllUrl = PATH.LIVE_CLASSES.BY_COURSE.ROOT(course.id);
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
                <LiveClassPreviewSkeleton />
            ) : items.length === 0 ? (
                <div className="text-sm text-gray-500 italic py-4">
                    No {type} live classes for this course.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4">
                    {visibleItems.map((item) => (
                        <LiveClassCard key={item.id} data={item} courseId={Number(item.course_id)} />
                    ))}
                    {extra > 0 && (
                        <ViewAllTile extra={extra} url={viewAllUrl} label="live classes" variant="card" />
                    )}
                </div>
            )}
        </CourseSectionShell>
    );
}

export default function LiveClassesByCourseLanding() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<LiveClassType>("ongoing");
    const [qp, setQp] = useState<QueryParams>({ pageIndex: 1, pageSize: COURSES_PER_PAGE });
    const { data, isLoading } = useGetUserPurchasedCourseQuery(qp);
    const courses = data?.data?.data || [];
    const totalPages = data?.data?.pagination?.total_pages || 0;

    return (
        <>
            <div className="page__header">
                <PageHeader breadcrumb={[{ title: t("menus.liveClasses") }]} />

                <TabController
                    options={[
                        { value: "ongoing", label: "Ongoing" },
                        { value: "upcoming", label: "Upcoming" },
                    ]}
                    currentActive={activeTab}
                    setActiveTab={(v) => {
                        setActiveTab(v as LiveClassType);
                        setQp((prev) => ({ ...prev, pageIndex: 1 }));
                    }}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col gap-8 mt-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i}>
                            <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-3" />
                            <LiveClassPreviewSkeleton />
                        </div>
                    ))}
                </div>
            ) : !courses.length ? (
                <div className="flex flex-col mt-4 h-full overflow-auto">
                    <FreeLiveClassesSection key={`free-${activeTab}`} type={activeTab} />
                    <EmptyList
                        title="You Haven't Purchased any course"
                        description="Please purchase a course to view the live class."
                        cta={{ label: "Explore Course", url: PATH.COURSE_MANAGEMENT.COURSES.ROOT }}
                    />
                </div>
            ) : (
                <>
                    <div className="flex flex-col mt-4 h-full overflow-auto">
                        <FreeLiveClassesSection key={`free-${activeTab}`} type={activeTab} />
                        {courses.map((course) => (
                            <LiveClassesSection key={`${course.id}-${activeTab}`} course={course} type={activeTab} />
                        ))}
                    </div>
                    <TablePagination qp={qp} setQp={setQp} totalPages={totalPages} />
                </>
            )}
        </>
    );
}
