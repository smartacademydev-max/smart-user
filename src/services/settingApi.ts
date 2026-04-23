import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { AppSettingProps, LinkedDeviceList, LoginTypeSettingProps, PaymentGateway, ThemeSettingProps } from "../types/setting";
import type { GlobalResponse, User } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const settingApi = createApi({
    reducerPath: "settingApi",
    baseQuery: baseQuery,
    tagTypes: ["LinkedDevice", "ApiSetting", "Theme", "LoginType"],
    endpoints: (builder) => ({
        getAppSettings: builder.query<GlobalResponse & { data: AppSettingProps }, void>({
            query: () => ({
                url: `/settings`,
                method: "GET",
            }),
        }),

        getLoginTypeSetting: builder.query<GlobalResponse & { data: LoginTypeSettingProps }, void>({
            query: () => ({ url: `/settings/login-type`, method: "GET" }),
            providesTags: ["LoginType"],
        }),

        getThemeSettings: builder.query<GlobalResponse & { data: ThemeSettingProps }, void>({
            query: () => ({
                url: `/settings/theme`,
                method: "GET",
            }),
            providesTags: ["Theme"],
        }),

        getPaymentGateways: builder.query<GlobalResponse & { data: PaymentGateway[] }, void>({
            query: () => ({ url: `/settings/api/payment-gateways`, method: "GET" }),
            providesTags: ["ApiSetting"],
        }),
        updateProfile: builder.mutation<GlobalResponse & { data: User }, FormData>({
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
    useGetLoginTypeSettingQuery,
    useGetThemeSettingsQuery,
    useUpdateProfileMutation,
    useGetAllLinkedDevicesQuery,
    useLogoutFromLinkedDeviceMutation,
    useGetPaymentGatewaysQuery,
} = settingApi;
