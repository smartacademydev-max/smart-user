import { useEffect, useState } from "react";
import type { TestStatus } from "../components/pages/TestManagement/allTest/AllTestList";
import { useGetSelectedTestBasedOnTestCategoryAndCourseIdQuery } from "../services/courseApi";
import { useGetUserAllTestQuery, useGetUserPurchasedTestRelatedToBundleQuery } from "../services/testApi";
import type { QueryParams } from "../types";
import type { QuestionTypeProps, TestProps } from "../types/question";
const PAGE_SIZE = 8;

export function usePaginatedTests(
    baseParams: QueryParams & { test_category_id?: number; course_id?: number },
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

    const testCategoryId = baseParams.test_category_id;
    const useCategoryEndpoint = !!testCategoryId;

    const {
        data: allTestData,
        isLoading: isLoadingAllTest,
    } = useGetUserAllTestQuery(
        {
            ...baseParams,
            pageIndex,
            pageSize: PAGE_SIZE,
            type,
            status,
        },
        { skip: useCategoryEndpoint }
    );

    const {
        data: categoryData,
        isLoading: isLoadingCategory,
    } = useGetSelectedTestBasedOnTestCategoryAndCourseIdQuery(
        {
            ...baseParams,
            pageIndex,
            pageSize: PAGE_SIZE,
            test_category_id: testCategoryId as number,
            course_id: baseParams.course_id as number,
            type,
            status,
        },
        { skip: !useCategoryEndpoint || !baseParams.course_id }
    );

    const data = useCategoryEndpoint ? categoryData : allTestData;
    const isLoading = useCategoryEndpoint ? isLoadingCategory : isLoadingAllTest;

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

export function usePaginatedBunldeTests(
    baseParams: QueryParams,
    type: QuestionTypeProps,
    status: TestStatus,
    resetKey: unknown,
    id: number
) {
    const [pageIndex, setPageIndex] = useState(1);
    const [accumulated, setAccumulated] = useState<TestProps[]>([]);

    useEffect(() => {
        setPageIndex(1);
        setAccumulated([]);
    }, [resetKey]);

    const { data, isLoading } = useGetUserPurchasedTestRelatedToBundleQuery({
        ...baseParams,
        pageIndex,
        pageSize: PAGE_SIZE,
        type,
        status,
        id
    }, { skip: !id });

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