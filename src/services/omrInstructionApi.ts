import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { OmrFormatList, OmrFormatProps } from "../types/omr";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const omrInstructionApi = createApi({
    reducerPath: "omrInstructionApi",
    baseQuery: baseQuery,
    tagTypes: ["OMR"],
    endpoints: (builder) => ({
        getOmrInstructionById: builder.query<GlobalResponse & { data: OmrFormatProps }, { id: number }>({
            query: ({ id }) => ({
                url: `/omr/format/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "OMR", id: `FORMAT_${id}` }],
        }),
        getAllOmrInstructions: builder.query<OmrFormatList, QueryParams>({
            query: ({ pageIndex, pageSize, search }) => ({
                url: `/omr/format?${buildQueryParams({ page: pageIndex, page_size: pageSize, search })}`,
                method: "GET",
            }),
            providesTags: [{ type: "OMR", id: "FORMAT_LIST" }],
        }),
    }),
});

export const { useGetOmrInstructionByIdQuery, useGetAllOmrInstructionsQuery } = omrInstructionApi;
