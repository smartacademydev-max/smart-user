import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import { useGetUserPurchasedCourseQuery, useUseGetAllTestCategoryInACourseQuery } from "../../../services/courseApi";
import type { QueryParams } from "../../../types";
import type { CourseProps } from "../../../types/course";
import { EmptyList } from "../../molecules/EmptyList";
import TablePagination from "../../molecules/Pagination";
import TestCategoryCard from "../../organism/Cards/TestCategoryCard";
import CourseSectionShell from "../../organism/LandingByCourse/CourseSectionShell";
import ViewAllTile from "../../organism/LandingByCourse/ViewAllTile";
import TestCardSkeleton from "../../organism/Loading/LoadingTestCard";
import PageHeader from "../../organism/PageHeader";

const PREVIEW_PAGE_SIZE = 4;
const MAX_VISIBLE = 4;
const COURSES_PER_PAGE = 5;

function TestPreviewSkeleton() {
    return (
        <div className="flex flex-col sm:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <TestCardSkeleton key={i} />
            ))}
        </div>
    );
}

function TestsSection({ course }: { course: CourseProps }) {
    const navigate = useNavigate();
    // const havePurchased = course.user?.has_purchased ?? false;
    const { data, isLoading } = useUseGetAllTestCategoryInACourseQuery(
        { id: course.id!, pageIndex: 1, pageSize: PREVIEW_PAGE_SIZE },
        { skip: !course.id }
    );
    const items = data?.data?.data ?? [];
    const total = data?.data?.pagination?.total ?? items.length;
    const viewAllUrl = PATH.TEST.MY_TEST.TEST_CATEGORY.ROOT(course.id);
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
                <TestPreviewSkeleton />
            ) : items.length === 0 ? (
                <div className="text-sm text-gray-500 italic py-4">No tests yet for this course.</div>
            ) : (
                <div className="flex flex-col gap-4 sm:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {visibleItems.map((test) => (
                        <TestCategoryCard key={test.id} data={test} onClick={() => { navigate(PATH.TEST.MY_TEST.TEST_CATEGORY.VIEW_TEST_CATEGORY.ROOT(Number(course.id), Number(test.id))) }} />
                    ))}
                    {extra > 0 && (
                        <ViewAllTile extra={extra} url={viewAllUrl} label="tests" variant="card" />
                    )}
                </div>
            )}
        </CourseSectionShell>
    );
}

export default function TestsByCourseLanding() {
    const [qp, setQp] = useState<QueryParams>({ pageIndex: 1, pageSize: COURSES_PER_PAGE });
    const { data, isLoading } = useGetUserPurchasedCourseQuery(qp);
    const courses = data?.data?.data || [];
    const totalPages = data?.data?.pagination?.total_pages || 0;

    return (
        <>
            <PageHeader breadcrumb={[{ title: "Course Based Tests" }]} />
            {isLoading ? (
                <div className="flex flex-col gap-8">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i}>
                            <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-3" />
                            <TestPreviewSkeleton />
                        </div>
                    ))}
                </div>
            ) : !courses.length ? (
                <EmptyList
                    title="You Haven't Purchased any course"
                    description="Please purchase a course to view the tests."
                    cta={{ label: "Explore Course", url: PATH.COURSE_MANAGEMENT.COURSES.ROOT }}
                />
            ) : (
                <>
                    <div className="flex flex-col">
                        {courses.map((course) => (
                            <TestsSection key={course.id} course={course} />
                        ))}
                    </div>
                    <TablePagination qp={qp} setQp={setQp} totalPages={totalPages} />
                </>
            )}
        </>
    );
}
