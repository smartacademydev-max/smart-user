import { createApi } from "@reduxjs/toolkit/query/react";
import type { CategoryFilterParams, QueryParams } from "../types";
import type { CourseList, CourseProps, courseTabType, CurriculumList } from "../types/course";
import type { LiveClassList, LiveClassProps } from "../types/liveClass";
import type { MediaList } from "../types/media";
import type { EsewaPaymentPayload, PurchaseProps } from "../types/purchase";
import type { TestList } from "../types/question";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery,
    tagTypes: ["Course", "Curriculum", "Media"],
    endpoints: (builder) => ({
        getAllCourse: builder.query<CourseList, QueryParams & { categoryFilter?: CategoryFilterParams }>({
            query: ({ pageIndex, pageSize, search, categoryFilter }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search,
                    mega_categories: categoryFilter?.mega_category,
                    categories: categoryFilter?.category,
                    sub_categories: categoryFilter?.sub_category,
                    positions: categoryFilter?.positions,
                });
                return {
                    url: `/course?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((course) => ({ type: "Course" as const, id: course.id })),
                        { type: "Course" as const, id: "LIST" },
                    ]
                    : [{ type: "Course" as const, id: "LIST" }],
        }),

        getCourseById: builder.query<{ data: CourseProps }, { id: number }>({
            query: ({ id }) => ({
                url: `/course/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Course" as const, id }],
        }),

        getCourseOverviewById: builder.query<{ data: CourseProps }, { id: number }>({
            query: ({ id }) => ({
                url: `/course/${id}/overview`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Course" as const, id }],
        }),

        getCourseCurriculumById: builder.query<CurriculumList, QueryParams & { id: number }>({
            query: ({ id, pageIndex, pageSize }) => ({
                url: `/course/${id}/curriculum?${buildQueryParams({ page: pageIndex, page_size: pageSize })}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Curriculum" as const, id }],
        }),
        getCourseMediaByType: builder.query<MediaList, { id: number | null; type: courseTabType; qp: QueryParams }>({
            query: ({ id, type, qp }) => {
                return ({
                    url: `/course/${id}/media?${buildQueryParams({
                        type, page: qp.pageIndex,
                        page_size: qp.pageSize,
                        search: qp.search
                    })}`,
                    method: "GET",
                })
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((media) => ({ type: "Media" as const, id: media.id })),
                        { type: "Media" as const, id: "LIST" },
                    ]
                    : [{ type: "Media" as const, id: "LIST" }],
        }),
        getCourseTest: builder.query<TestList, QueryParams & { id: number }>({
            query: ({ id, pageIndex, pageSize, search }) => ({
                url: `/course/${id}/test?${buildQueryParams({ page: pageIndex, page_size: pageSize, search })}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Course" as const, id }],
        }),
        getCourseLiveClass: builder.query<LiveClassList, QueryParams & { id: number, type?: "ongoing" | "upcoming" }>({
            query: ({ id, pageIndex, pageSize, search, type }) => ({
                url: `/course/${id}/live?${buildQueryParams({ page: pageIndex, page_size: pageSize, search: search, status: type })}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Course" as const, id }],
        }),
        getSingleLiveClass: builder.query<{ data: LiveClassProps }, { courseId: number, liveId: Number }>({
            query: ({ courseId, liveId }) => ({
                url: `/course/${courseId}/live/${liveId}`,
                method: "GET"
            })
        }),
        purchaseCourse: builder.mutation<GlobalResponse, { body: PurchaseProps; id: number }>({
            query: ({ body, id }) => ({
                url: `/course/${id}/purchase`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Course" as const, id },          // refetch this course
                { type: "Course" as const, id: "LIST" },  // refetch course list
                { type: "Curriculum" as const, id: "LIST" }, // refetch all curriculum
                { type: "Media" as const, id: "LIST" },   // refetch all media
            ],
        }),
        purchaseCourseWithEsewa: builder.mutation<GlobalResponse & { data: EsewaPaymentPayload }, { id: number }>({
            query: ({ id }) => ({
                url: `/course/${id}/payment/esewa`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Course" as const, id }],
        }),
        purchaseWithKhalti: builder.mutation<GlobalResponse & { data: { payment_url: string; pidx: string; order_id: string } }, { id: number, type: string, amount: number }>({
            query: ({ id, type, amount }) => ({
                url: `/course/${id}/payment/khalti`,
                method: "POST",
                body: {
                    type,
                    amount
                }
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Course" as const, id },
                { type: "Course" as const, id: "LIST" },
            ],
        }),
        getUserPurchasedCourse: builder.query<CourseList, QueryParams & { type: "trial" | "purchased" }>({
            query: ({ pageIndex, pageSize, search, type }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search,
                    type: type
                });
                return {
                    url: `/my-course?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((course) => ({ type: "Course" as const, id: course.id })),
                        { type: "Course" as const, id: "LIST" },
                    ]
                    : [{ type: "Course" as const, id: "LIST" }],
        }),
        bookmakrCourse: builder.mutation<GlobalResponse, { id: number }>({
            query: ({ id }) => ({
                url: `/course/${id}/bookmark`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Course" as const, id },
                { type: "Course" as const, id: "LIST" },
            ],
        }),
        getAllBookmarkedCourse: builder.query<CourseList, QueryParams>({
            query: ({ pageIndex, pageSize, search, }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search: search,
                });
                return {
                    url: `/course/bookmark?${queryString}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map((course) => ({ type: "Course" as const, id: course.id })),
                        { type: "Course" as const, id: "LIST" },
                    ]
                    : [{ type: "Course" as const, id: "LIST" }],
        }),
        getMeetingSignature: builder.mutation<{ data: { signature: string; zak: string; } }, { meeting_id: number, role: number, account_id: number }>({
            query: ({ meeting_id, role, account_id }) => ({
                url: `/zoom/signature`,
                method: "POST",
                body: {
                    meeting_id, role, account_id
                }
            })
        }),
    }),
});

export const {
    useGetAllCourseQuery,
    useGetCourseByIdQuery,
    useGetCourseOverviewByIdQuery,
    useGetCourseCurriculumByIdQuery,
    useGetCourseMediaByTypeQuery,
    useGetCourseTestQuery,
    useGetCourseLiveClassQuery,
    usePurchaseCourseMutation,
    useGetUserPurchasedCourseQuery,
    useBookmakrCourseMutation,
    useGetAllBookmarkedCourseQuery,
    useGetSingleLiveClassQuery,
    useGetMeetingSignatureMutation,
    usePurchaseWithKhaltiMutation,
    usePurchaseCourseWithEsewaMutation

} = courseApi;
