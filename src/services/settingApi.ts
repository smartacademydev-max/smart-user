import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { AppSettingProps, LinkedDeviceList } from "../types/setting";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const settingApi = createApi({
    reducerPath: "settingApi",
    baseQuery: baseQuery,
    tagTypes: ["LinkedDevice"],
    endpoints: (builder) => ({
        getAppSettings: builder.query<GlobalResponse & { data: AppSettingProps }, void>({
            query: () => ({
                url: `/settings`,
                method: "GET",
            }),
        }),
        updateProfile: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: `/me`,
                method: "POST",
                body,
            }),
        }),
        getAllLinkedDevices: builder.query<LinkedDeviceList, QueryParams>({
            query: ({ pageIndex, pageSize }) => ({
                url: `/settings/linked-device?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize
                })}`,
                method: "GET",
            }),
            providesTags: ["LinkedDevice"],
        }),
        logoutFromLinkedDevice: builder.mutation<
            GlobalResponse,
            { id: number }
        >({
            query: ({ id }) => ({
                url: `/settings/linked-device/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LinkedDevice"],
        }),
    }),
});

export const {
    useGetAppSettingsQuery,
    useUpdateProfileMutation,
    useGetAllLinkedDevicesQuery,
    useLogoutFromLinkedDeviceMutation
} = settingApi;
