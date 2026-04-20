import { createApi } from "@reduxjs/toolkit/query/react";
import type { BannerList } from "../types/content";
import type { AnalyticsList, DailyQuizResponse, DailyQuizSubmitPayload, DailyQuizSubmitResponse, ProgressRange, StudyTimeResponse, TestScoreResponse } from "../types/dashboard";
import { baseQuery } from "./baseQuery";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQuery,
    tagTypes: ["Analytics", "DailyQuiz", "StudyTime", "TestScores"],
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
        }),
        getStudyTime: builder.query<StudyTimeResponse, ProgressRange>({
            query: (range) => ({
                url: `/progress/study-time`,
                method: "GET",
                params: { range }
            }),
            providesTags: ["StudyTime"]
        }),
        getTestScores: builder.query<TestScoreResponse, ProgressRange>({
            query: (range) => ({
                url: `/progress/test-scores`,
                method: "GET",
                params: { range }
            }),
            providesTags: ["TestScores"]
        }),

    })
})

export const {
    useGetAnalyticsQuery,
    useGetBannerQuery,
    useGetDailyQuizQuery,
    useSubmitDailyQuizAnswerMutation,
    useGetStudyTimeQuery,
    useGetTestScoresQuery
} = dashboardApi;