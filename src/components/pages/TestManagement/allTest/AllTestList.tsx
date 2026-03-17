import { Box, Button, Divider, Typography } from "@mui/material";
import { ArrowDown } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../routes/PATH";
import { useGetUserPurchasedCourseQuery } from "../../../../services/courseApi";
import { useGetUserAllTestQuery } from "../../../../services/testApi";
import type { QueryParams } from "../../../../types";
import type { QuestionTypeProps, TestProps } from "../../../../types/question";
import { EmptyList } from "../../../molecules/EmptyList";
import TabController from "../../../molecules/TabController";
import TestCard from "../../../organism/Cards/TestCard";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";

const PAGE_SIZE = 8;

const TestCardSkeleton = () => {
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
const CourseFilterSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="h-10 bg-gray-200 rounded w-1/2" />
    </div>
);


export type TestStatus = "not_started" | "completed" | "awaiting" | "expired";

function usePaginatedTests(
    baseParams: QueryParams,
    type: QuestionTypeProps,
    status: TestStatus,
    resetKey: unknown,
) {
    const [pageIndex, setPageIndex] = useState(1);
    const [accumulated, setAccumulated] = useState<TestProps[]>([]);

    useEffect(() => {
        setPageIndex(1);
        setAccumulated([]);
    }, [resetKey]);

    const { data, isLoading } = useGetUserAllTestQuery({
        ...baseParams,
        pageIndex,
        pageSize: PAGE_SIZE,
        type,
        status,
    });

    const page = data?.data?.data ?? [];
    const totalPages = data?.data?.pagination?.total_pages ?? 0;

    useEffect(() => {
        if (page.length === 0 && pageIndex === 1) {
            setAccumulated([]);
            return;
        }
        if (page.length === 0) return;

        setAccumulated((prev) => {
            if (pageIndex === 1) return page;
            const existingIds = new Set(prev.map((v) => v.id));
            return [...prev, ...page.filter((v) => !existingIds.has(v.id))];
        });
    }, [page, pageIndex]);

    const loadMore = () => setPageIndex((p) => p + 1);
    const hasMore = pageIndex < totalPages;

    return { tests: accumulated, isLoading, hasMore, loadMore };
}


interface TestSectionProps {
    title: string;
    description: string;
    tests: TestProps[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    showDivider?: boolean;
    status: TestStatus;
}

function TestSection({
    title,
    description,
    tests,
    isLoading,
    hasMore,
    onLoadMore,
    showDivider = true,
    status
}: TestSectionProps) {
    const { t } = useTranslation();

    if (!isLoading && !tests.length) return null
    return (
        <>
            <div className="header mb-3">
                <Typography variant="body2" fontWeight={600}>{title}</Typography>
                <Typography variant="subtitle2" color="text.middle" fontWeight={400}>
                    {description}
                </Typography>
            </div>

            <Box>
                {isLoading && tests.length === 0 ? (
                    <div className="flex flex-col gap-4 md:grid grid-cols-2 2xl:grid-cols-3 lg:gap-6">
                        {Array.from({ length: 4 }).map((_, idx) => <TestCardSkeleton key={idx} />)}
                    </div>
                ) : tests.length > 0 ? (
                    <div className="flex flex-col gap-4 sm:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {tests.map((test) => (
                            <TestCard key={test.id} test={test} havePurchased status={status} />
                        ))}
                    </div>
                ) : (
                    <EmptyList
                        title="No Test Found"
                        description="There are no tests available for the selected course."
                    />
                )}
            </Box>

            {hasMore && (
                <div className="text-center mt-3">
                    <Button
                        variant="text"
                        color="primary"
                        endIcon={<ArrowDown size={16} />}
                        disabled={isLoading}
                        onClick={onLoadMore}
                    >
                        {isLoading ? "Loading More" : t("messages.load_more")}
                    </Button>
                </div>
            )}

            {showDivider && <Divider className="my-4! lg:my-6!" />}
        </>
    );
}


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
        pageSize: PAGE_SIZE,
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
                    showDivider={false}
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