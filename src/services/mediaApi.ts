import { createApi } from "@reduxjs/toolkit/query/react";
import type { GlobalResponse } from "../types/user";
import { baseQuery } from "./baseQuery";

export const mediaApi = createApi({
    reducerPath: "mediaApi",
    baseQuery: baseQuery,
    tagTypes: ["Media", "Notes", "Audio", "Video", "Images"],
    endpoints: (builder) => ({
        uploadMediaImage: builder.mutation<
            GlobalResponse & {
                data: {
                    url: string;
                    media_id: number;
                };
            },
            { body: FormData }
        >({
            query: ({ body }) => ({
                url: `/file/image`,
                method: "POST",
                body
            }),
            invalidatesTags: [{ type: "Media", id: "LIST" }]
        }),
        downloadMedia: builder.mutation<
            GlobalResponse,
            { courseId: Number; mediaId: Number }
        >({
            query: ({ courseId, mediaId }) => ({
                url: `/course/${courseId}/media/${mediaId}`,
                method: "POST",
            }),
        }),
        getPlayableUrl: builder.mutation<GlobalResponse & { data: { url: string } }, { url?: string }>({
            query: ({ url }) => ({
                url: `/playable-video`,
                method: "POST",
                body: { video_link: url }
            }),
        })
    })
})

export const { useUploadMediaImageMutation, useDownloadMediaMutation, useGetPlayableUrlMutation } = mediaApi;