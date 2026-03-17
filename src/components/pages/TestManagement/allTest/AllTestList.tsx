import { useEffect, useState } from "react";
import { PATH } from "../../../../routes/PATH";
import { useGetUserPurchasedCourseQuery } from "../../../../services/courseApi";
import type { QueryParams } from "../../../../types";
import type { QuestionTypeProps } from "../../../../types/question";
import { usePaginatedTests } from "../../../../utils/usePaginatedTest";
import { EmptyList } from "../../../molecules/EmptyList";
import TabController from "../../../molecules/TabController";
import TestCardSkeleton from "../../../organism/Loading/LoadingTestCard";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";
import TestSection from "../../../organism/TestSection";



const CourseFilterSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="h-10 bg-gray-200 rounded w-1/2" />
    </div>
);


export type TestStatus = "not_started" | "completed" | "awaiting" | "expired";



export default function AlltestList() {
    const [search, setSearch] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<QuestionTypeProps>("mcq");

    const { data: myCourse, isLoading: loadingCourses } = useGetUserPurchasedCourseQuery({
        pageIndex: 1,
        pageSize: 12,
        search: "",
    });

    const myCourses = myCourse?.data?.data ?? [];
    const selectedCourse = myCourses.find((c) => c.id === selectedCourseId);

    const resetKey = `${activeTab}__${selectedCourseId}__${search}`;

    const baseParams: QueryParams = {
        pageIndex: 1,
        pageSize: 8,
        search,
        ...(selectedCourseId ? { courseId: selectedCourseId } : {}),
    };

    const notStarted = usePaginatedTests(baseParams, activeTab, "not_started", resetKey);
    const completed = usePaginatedTests(baseParams, activeTab, "completed", resetKey);
    const awaiting = usePaginatedTests(baseParams, activeTab, "awaiting", resetKey);
    const expired = usePaginatedTests(baseParams, activeTab, "expired", resetKey);

    const [rawSearch, setRawSearch] = useState("");
    useEffect(() => {
        const id = setTimeout(() => setSearch(rawSearch), 500);
        return () => clearTimeout(id);
    }, [rawSearch]);

    if (loadingCourses) {
        return (
            <div className="all__video__listing">
                <div className="mb-6"><CourseFilterSkeleton /></div>
                <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 lg:gap-6">
                    {Array.from({ length: 6 }).map((_, idx) => <TestCardSkeleton key={idx} />)}
                </div>
            </div>
        );
    }

    if (!myCourses.length) {
        return (
            <EmptyList
                title="You Haven't Purchased any course"
                description="Please purchase a course to view the tests."
                cta={{ label: "Explore Course", url: PATH.COURSE_MANAGEMENT.COURSES.ROOT }}
            />
        );
    }

    return (
        <div className="all__note__listing h-full flex flex-col justify-between">
            <div className="flex flex-col mb-4">
                <PageHeader breadcrumb={[{ title: "Course Based Tests" }]} />
                <div className="mb-2.5">
                    <TabController
                        currentActive={activeTab}
                        setActiveTab={(tab) => setActiveTab(tab)}
                        options={[
                            { label: "MCQ", value: "mcq" },
                            { label: "Subjective", value: "subjective" },
                            { label: "OMR", value: "omr" },
                        ]}
                    />
                </div>
                <TableFilter
                    search={rawSearch}
                    setSearch={setRawSearch}
                    onFilter={() => { }}
                    myCourses={myCourses}
                    selectedCourseId={selectedCourseId}
                    setSelectedCourseId={setSelectedCourseId}
                />
            </div>

            {selectedCourse && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h2>
                </div>
            )}

            <div className="media__listing__wrapper h-full overflow-auto pr-2">
                <TestSection
                    title="Not Started"
                    description="Tests you have purchased but haven't taken yet."
                    {...notStarted}
                    onLoadMore={notStarted.loadMore}
                    status="not_started"
                />
                <TestSection
                    title="Completed"
                    description="Tests that are finished. You can view your results here."
                    {...completed}
                    onLoadMore={completed.loadMore}
                    status="completed"
                />
                <TestSection
                    title="Awaiting Review"
                    description="Tests submitted and currently being reviewed by your teacher."
                    {...awaiting}
                    onLoadMore={awaiting.loadMore}
                    showDivider={true}
                    status="awaiting"
                />
                <TestSection
                    title="Expired"
                    description="Tests expired and you missed to submit this test on scheduled time."
                    {...expired}
                    onLoadMore={expired.loadMore}
                    showDivider={false}
                    status="expired"
                />
            </div>
        </div>
    );
}