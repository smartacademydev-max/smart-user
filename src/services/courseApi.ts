import { createApi } from "@reduxjs/toolkit/query/react";
import type { CategoryFilterParams, QueryParams } from "../types";
import type { CourseList, CourseProps, courseTabType, CurriculumList, PackageType, PlaylistListing } from "../types/course";
import type { CanvasContentsProgressResponse, CanvasCourseProgressResponse, CanvasCurriculumResponse, CourseCompletionResponse, MarkCanvasContentPayload, SaveCanvasProgressPayload } from "../types/learningCanvas";
import type { LiveClassList, LiveClassProps } from "../types/liveClass";
import type { MediaList } from "../types/media";
import type { EsewaPaymentPayload, PurchaseModuleTypes, PurchaseProps } from "../types/purchase";
import type { TestList } from "../types/question";
import type { ReciptProps, TransactionsResponse } from "../types/transactions";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery,
    tagTypes: ["Course", "Curriculum", "Media", "CanvasProgress"],
    endpoints: (builder) => ({
        getAllCourse: builder.query<CourseList, QueryParams & { categoryFilter?: CategoryFilterParams; package_type?: PackageType }>({
            query: ({ pageIndex, pageSize, search, categoryFilter, package_type }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search,
                    mega_categories: categoryFilter?.mega_category,
                    categories: categoryFilter?.category,
                    sub_categories: categoryFilter?.sub_category,
                    positions: categoryFilter?.positions,
                    package_type,
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
        getCourseMediaPlaylist: builder.query<PlaylistListing, { id: number | null; type: courseTabType; qp: QueryParams }>({
            query: ({ id, type, qp }) => {
                return ({
                    url: `/course/${id}/playlist?${buildQueryParams({
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
                        ...result.data.data.map((media) => ({ type: "Media" as const, id: media.chapter_id })),
                        { type: "Media" as const, id: "LIST" },
                    ]
                    : [{ type: "Media" as const, id: "LIST" }],
        }),
        getSinglePlaylist: builder.query<MediaList, QueryParams & { id: number, playlistId?: number, type: courseTabType }>({
            query: ({ id, playlistId, type, pageIndex, pageSize, search }) => ({
                url: `/course/${id}/playlist/${playlistId}?${buildQueryParams({
                    type: type,
                    search: search,
                    page_size: pageSize,
                    page: pageIndex
                })}`,
                method: "GET"
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Media" as const, id }],
        }),
        getFreeMaterialsCourse: builder.query<{ data: CourseProps }, void>({
            query: () => ({
                url: `/free-materials/course`,
                method: "GET",
            }),
            providesTags: [{ type: "Course" as const, id: "FREE_MATERIALS" }],
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
        purchaseCourse: builder.mutation<GlobalResponse & { data: ReciptProps }, { body: PurchaseProps; id: number, moduleType: PurchaseModuleTypes }>({
            query: ({ body, id, moduleType }) => ({
                url: `/purchase`,
                method: "POST",
                body: {
                    ...body,
                    module_id: id,
                    module_type: moduleType
                },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Course" as const, id },
                { type: "Course" as const, id: "LIST" },
                { type: "Curriculum" as const, id: "LIST" },
                { type: "Media" as const, id: "LIST" },
            ],
        }),
        purchaseCourseWithEsewa: builder.mutation<GlobalResponse & { data: EsewaPaymentPayload }, { id: number, moduleType: PurchaseModuleTypes; subscriptionId?: number; coupon_code?: string; use_points?: boolean; points_amount?: number }>({
            query: ({ id, moduleType, subscriptionId, coupon_code, use_points, points_amount }) => ({
                url: `/payment/esewa`,
                method: "POST",
                body: {
                    module_type: moduleType,
                    module_id: id,
                    ...(subscriptionId && { subscription_id: subscriptionId }),
                    ...(coupon_code && { coupon_code }),
                    ...(use_points && { use_points, points_amount }),
                },
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Course" as const, id }],
        }),
        purchaseWithKhalti: builder.mutation<GlobalResponse & { data: { payment_url: string; pidx: string; order_id: string } }, { id: number, type: string, amount: number, moduleType: PurchaseModuleTypes; subscriptionId?: number; coupon_code?: string; use_points?: boolean; points_amount?: number }>({
            query: ({ id, type, amount, moduleType, subscriptionId, coupon_code, use_points, points_amount }) => ({
                url: `/payment/khalti`,
                method: "POST",
                body: {
                    type,
                    amount,
                    module_id: id,
                    module_type: moduleType,
                    ...(subscriptionId && { subscription_id: subscriptionId }),
                    ...(coupon_code && { coupon_code }),
                    ...(use_points && { use_points, points_amount }),
                }
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Course" as const, id },
                { type: "Course" as const, id: "LIST" },
            ],
        }),
        getUserPurchasedCourse: builder.query<CourseList, QueryParams & { type?: "trial" | "purchased" | "free"; package_type?: PackageType }>({
            query: ({ pageIndex, pageSize, search, type, package_type }) => {
                const queryString = buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    search,
                    type: type,
                    package_type,
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
        trackCourseProgress: builder.mutation<GlobalResponse, { id: number; body: { media_id: number; type: courseTabType } }>({
            query: ({ id, body }) => ({
                url: `/course/${id}/progress`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Course" as const, id }],
        }),
        getAllUserTransacions: builder.query<TransactionsResponse, QueryParams>({
            query: ({ pageIndex, pageSize, search }) => ({
                url: `/user/transactions?${buildQueryParams({ page: pageIndex, page_size: pageSize, search })}`,
                method: "GET",
            })
        }),
        downloadAdmitCard: builder.query<GlobalResponse & {
            data: {
                preview_url: string;
                download_url: string;
            }
        }, void>({
            query: () => ({
                url: `/user/admit-card`,
                method: "GET",
            })
        }),

        // ─── Learning Canvas (new endpoints) ────────────────────────

        getCanvasCurriculum: builder.query<CanvasCurriculumResponse, { courseId: number }>({
            query: ({ courseId }) => ({
                url: `/course/${courseId}/canvas/curriculum`,
                method: "GET",
            }),
            providesTags: (_r, _e, { courseId }) => [{ type: "Curriculum" as const, id: courseId }],
        }),

        getCanvasCourseProgress: builder.query<CanvasCourseProgressResponse, { courseId: number }>({
            query: ({ courseId }) => ({
                url: `/course/${courseId}/canvas/progress`,
                method: "GET",
            }),
            providesTags: (_r, _e, { courseId }) => [{ type: "Course" as const, id: courseId }],
        }),

        markCanvasContentComplete: builder.mutation<GlobalResponse, { courseId: number; body: MarkCanvasContentPayload }>({
            query: ({ courseId, body }) => ({
                url: `/course/${courseId}/canvas/complete`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_r, _e, { courseId }) => [
                { type: "Curriculum" as const, id: courseId },
                { type: "Course" as const, id: courseId },
                { type: "CanvasProgress" as const, id: courseId },
            ],
        }),

        // ─── Per-content progress (resume position + watched %) ─────────────
        getCanvasContentsProgress: builder.query<CanvasContentsProgressResponse, { courseId: number }>({
            query: ({ courseId }) => ({
                url: `/course/${courseId}/canvas/contents-progress`,
                method: "GET",
            }),
            providesTags: (_r, _e, { courseId }) => [{ type: "CanvasProgress" as const, id: courseId }],
        }),

        saveCanvasContentProgress: builder.mutation<GlobalResponse, { courseId: number; body: SaveCanvasProgressPayload }>({
            query: ({ courseId, body }) => ({
                url: `/course/${courseId}/canvas/progress`,
                method: "POST",
                body,
            }),
            // Optimistic patch — keep cached list in sync without refetching on every tick.
            onQueryStarted: async ({ courseId, body }, { dispatch, queryFulfilled }) => {
                const patch = dispatch(
                    courseApi.util.updateQueryData("getCanvasContentsProgress", { courseId }, (draft) => {
                        const list = draft?.data?.data;
                        if (!Array.isArray(list)) return;
                        const existing = list.find((p) => p.content_id === body.content_id);
                        if (existing) {
                            existing.position = body.position;
                            existing.percent = body.percent;
                        } else {
                            list.push({
                                content_id: body.content_id,
                                content_type: body.content_type,
                                position: body.position,
                                percent: body.percent,
                                completed: false,
                            });
                        }
                    })
                );
                try { await queryFulfilled; } catch { patch.undo(); }
            },
        }),

        getCourseCompletion: builder.query<CourseCompletionResponse, { courseId: number }>({
            query: ({ courseId }) => ({
                url: `/course/${courseId}/canvas/completion`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetAllCourseQuery,
    useGetCourseByIdQuery,
    useGetCourseOverviewByIdQuery,
    useGetCourseCurriculumByIdQuery,
    useGetCourseMediaByTypeQuery,
    useGetCourseMediaPlaylistQuery,
    useGetSinglePlaylistQuery,
    useGetFreeMaterialsCourseQuery,
    useGetCourseTestQuery,
    useGetCourseLiveClassQuery,
    usePurchaseCourseMutation,
    useGetUserPurchasedCourseQuery,
    useBookmakrCourseMutation,
    useGetAllBookmarkedCourseQuery,
    useGetSingleLiveClassQuery,
    useGetMeetingSignatureMutation,
    usePurchaseWithKhaltiMutation,
    usePurchaseCourseWithEsewaMutation,
    useTrackCourseProgressMutation,
    useGetAllUserTransacionsQuery,
    useDownloadAdmitCardQuery,
    useGetCanvasCurriculumQuery,
    useGetCanvasCourseProgressQuery,
    useMarkCanvasContentCompleteMutation,
    useGetCourseCompletionQuery,
    useGetCanvasContentsProgressQuery,
    useSaveCanvasContentProgressMutation,
} = courseApi;
