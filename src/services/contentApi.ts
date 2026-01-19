import { createApi } from "@reduxjs/toolkit/query/react";
import type { OnboardingPage } from "../types/content";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";

export const contentApi = createApi({
    reducerPath: "contentApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getOnboradingScreen: builder.query<GlobalResponse & { data: OnboardingPage[] }, void>({
            query: () => ({
                url: "/content/onboard",
                method: "GET"
            })
        })
    })
})
export const { useGetOnboradingScreenQuery } = contentApi;