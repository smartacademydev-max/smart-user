import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { NotificationListResponse, NotificationProps } from "../types/notification";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQuery,
    tagTypes: ["Notifications"],

    endpoints: (builder) => ({
        getAllNotifications: builder.query<NotificationListResponse, QueryParams & { type?: "notice_board" | "push_notification" }>({
            query: ({ pageIndex, pageSize, type, search }) => {
                const queryParams = buildQueryParams({ page: pageIndex, page_size: pageSize, type: type, search });
                return {
                    url: `/notification?${queryParams}`,
                    method: "GET",
                }
            },
            providesTags: [{ type: "Notifications", id: "LIST" }],
        }),

        readNotification: builder.mutation<
            GlobalResponse,
            { id?: number }
        >({
            query: ({ id }) => ({
                url: id ? `/notification/${id}` : `/notification`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Notifications", id: "LIST" }],
        }),
        getNotificationById: builder.query<{ data: NotificationProps }, { id: number }>({
            query: ({ id }) => ({
                url: `/notification/${id}`,
                method: "GET",
            }),
            providesTags: [{ type: "Notifications", id: "LIST" }],
        })
    }),
});

export const {
    useGetAllNotificationsQuery,
    useReadNotificationMutation,
    useGetNotificationByIdQuery
} = notificationApi;
