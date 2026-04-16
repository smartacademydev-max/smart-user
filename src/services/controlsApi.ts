import { createApi } from "@reduxjs/toolkit/query/react";
import type { AppControlsResponse } from "../types/controls";
import { baseQuery } from "./baseQuery";

export const controlsApi = createApi({
    reducerPath: "controlsApi",
    baseQuery: baseQuery,
    tagTypes: ["Controls"],
    endpoints: (builder) => ({
        getControls: builder.query<AppControlsResponse, void>({
            query: () => ({ url: "/settings/controls", method: "GET" }),
            providesTags: [{ type: "Controls", id: "GLOBAL" }],
        }),
    }),
});

export const { useGetControlsQuery } = controlsApi;
