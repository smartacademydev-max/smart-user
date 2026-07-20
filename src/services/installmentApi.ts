import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type { InstallmentFilter, InstallmentsResponse } from "../types/transactions";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const installmentApi = createApi({
    reducerPath: "installmentApi",
    baseQuery,
    tagTypes: ["Installment"],
    endpoints: (builder) => ({
        // GET /api/v1/user/{user_id}/installments — the student is auto-scoped to their own id.
        getUserInstallments: builder.query<
            InstallmentsResponse,
            Partial<QueryParams> & { userId: number; status?: InstallmentFilter }
        >({
            query: ({ userId, status, pageIndex, pageSize }) => ({
                url: `/user/${userId}/installments?${buildQueryParams({
                    status,
                    page: pageIndex,
                    page_size: pageSize,
                })}`,
                method: "GET",
            }),
            providesTags: [{ type: "Installment", id: "LIST" }],
        }),
    }),
});

export const { useGetUserInstallmentsQuery } = installmentApi;
