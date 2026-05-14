import { ArrowLeft2, SearchNormal1 } from "iconsax-reactjs";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useGetUserPurchasedCourseQuery } from "../../../../services/courseApi";
import type { QueryParams } from "../../../../types";
import type { QuestionTypeProps } from "../../../../types/question";
import { usePaginatedTests } from "../../../../utils/usePaginatedTest";
import { EmptyList } from "../../../molecules/EmptyList";
import TabController from "../../../molecules/TabController";
import PageHeader from "../../../organism/PageHeader";
import TestSection from "../../../organism/TestSection";


export type TestStatus = "not_started" | "completed" | "awaiting" | "expired";


export default function AlltestList() {
    const navigate = useNavigate();
    const { courseId: courseIdParam } = useParams<{ courseId: string }>();
    const courseId = courseIdParam ? Number(courseIdParam) : null;

    const [rawSearch, setRawSearch] = useState("");
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<QuestionTypeProps>("mcq");

    const { data: myCourse } = useGetUserPurchasedCourseQuery({ pageIndex: 1, pageSize: 50 });
    const selectedCourse = useMemo(
        () => (myCourse?.data?.data || []).find((c) => c.id === courseId),
        [myCourse?.data?.data, courseId]
    );

    const resetKey = `${activeTab}__${courseId}__${search}`;

    const baseParams: QueryParams & { id?: number } = useMemo(() => ({
        pageIndex: 1,
        pageSize: 8,
        search,
        ...(courseId ? { id: courseId } : {}),
    }), [search, courseId]);

    const notStarted = usePaginatedTests(baseParams, activeTab, "not_started", resetKey);
    const completed = usePaginatedTests(baseParams, activeTab, "completed", resetKey);
    const awaiting = usePaginatedTests(baseParams, activeTab, "awaiting", resetKey);
    const expired = usePaginatedTests(baseParams, activeTab, "expired", resetKey);

    useEffect(() => {
        const id = setTimeout(() => setSearch(rawSearch), 500);
        return () => clearTimeout(id);
    }, [rawSearch]);

    if (!courseId) {
        navigate(PATH.TEST.MY_TEST.ROOT, { replace: true });
        return null;
    }

    const noTests = !notStarted.tests.length && !completed.tests.length && !awaiting.tests.length && !expired.tests.length;
    const isLoadingAny = notStarted.isLoading || completed.isLoading || awaiting.isLoading || expired.isLoading;

    return (
        <div className="all__note__listing h-full flex flex-col justify-between">
            <div className="flex flex-col mb-4">
                <PageHeader breadcrumb={[{ title: "Course Based Tests" }]} />

                <div className="flex items-center gap-3 mb-3">
                    <Link to={PATH.TEST.MY_TEST.ROOT} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                        <IconButton size="small"><ArrowLeft2 size={18} /></IconButton>
                        <span>All Course Based Tests</span>
                    </Link>
                </div>

                {selectedCourse && (
                    <div className="mb-4 pb-3 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h2>
                    </div>
                )}

                <div className="mb-2.5">
                    <TabController
                        currentActive={activeTab}
                        setActiveTab={(tab) => setActiveTab(tab as QuestionTypeProps)}
                        options={[
                            { label: "MCQ", value: "mcq" },
                            { label: "Subjective", value: "subjective" },
                            { label: "OMR", value: "omr" },
                        ]}
                    />
                </div>

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search tests"
                    value={rawSearch}
                    onChange={(e) => setRawSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchNormal1 size={18} />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div className="media__listing__wrapper h-full overflow-auto pr-2">
                {!isLoadingAny && noTests ? (
                    <EmptyList
                        title="No Tests Found"
                        description="There are no tests of this type for this course."
                    />
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}
