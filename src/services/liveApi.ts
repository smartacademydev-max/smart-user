import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { LiveClassList, ZoomAccount } from "../types/liveClass";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const liveClassApi = createApi({
    reducerPath: "liveClassApi",
    baseQuery: baseQuery,
    tagTypes: ["LiveClass"],
    endpoints: (builder) => ({
        getAllLiveClasses: builder.query<LiveClassList, QueryParams & { type?: "ongoing" | "upcoming"; id?: number }>({
            query: ({ pageIndex, pageSize, type, id, startDate, endDate }) => ({
                url: `/my-live?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    type: type,
                    course_id: id,
                    start_date: startDate,
                    end_date: endDate,
                })}`,
                method: "GET",
            }),
        }),
        getZoomAccounts: builder.query<{ data: ZoomAccount[] }, void>({
            query: () => ({
                url: `/zoom-accounts`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllLiveClassesQuery, useGetZoomAccountsQuery } = liveClassApi;