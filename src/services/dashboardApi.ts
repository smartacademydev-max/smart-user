import { createApi } from "@reduxjs/toolkit/query/react";
import type { BannerList } from "../types/content";
import type { AnalyticsList, DailyQuizResponse, DailyQuizSubmitPayload, DailyQuizSubmitResponse } from "../types/dashboard";
import { baseQuery } from "./baseQuery";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQuery,
    tagTypes: ["Analytics", "DailyQuiz"],
    endpoints: (builder) => ({
        getAnalytics: builder.query<AnalyticsList, void>({
            query: () => ({
                url: `/analytics`,
                method: "GET"
            })
        }),
        getBanner: builder.query<BannerList, void>({
            query: () => ({
                url: `/banners`,
                method: "GET"
            })
        }),
        getDailyQuiz: builder.query<DailyQuizResponse, void>({
            query: () => ({
                url: `/daily-quiz`,
                method: "GET"
            }),
            providesTags: ["DailyQuiz"]
        }),
        submitDailyQuizAnswer: builder.mutation<DailyQuizSubmitResponse, DailyQuizSubmitPayload>({
            query: (body) => ({
                url: `/daily-quiz/submit`,
                method: "POST",
                body
            }),
            invalidatesTags: ["DailyQuiz"]
        })
    })
})

export const {
    useGetAnalyticsQuery,
    useGetBannerQuery,
    useGetDailyQuizQuery,
    useSubmitDailyQuizAnswerMutation
} = dashboardApi;