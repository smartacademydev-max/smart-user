import { createApi } from "@reduxjs/toolkit/query/react";
import type { BannerList } from "../types/content";
import type { AnalyticsList } from "../types/dashboard";
import { baseQuery } from "./baseQuery";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQuery,
    tagTypes: ["Analytics"],
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
        })
    })
})

export const {
    useGetAnalyticsQuery,
    useGetBannerQuery
} = dashboardApi;