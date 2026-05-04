import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type {
    CouponValidateResponse,
    PointsBalanceResponse,
    PointsConfigResponse,
    PointsTransactionListResponse,
    PointsTransactionType,
    ReferralListResponse,
    UserReferralStatsResponse
} from "../types/referral";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const referralApi = createApi({
    reducerPath: "referralApi",
    baseQuery,
    tagTypes: [
        "UserReferralStats",
        "UserReferral",
        "UserPointsTransaction",
        "UserPointsBalance",
        "UserPointsConfig",
    ],
    endpoints: (builder) => ({
        getUserReferralStats: builder.query<UserReferralStatsResponse, void>({
            query: () => ({ url: "/user/referral/stats", method: "GET" }),
            providesTags: [{ type: "UserReferralStats", id: "SELF" }],
        }),

        getUserReferrals: builder.query<
            ReferralListResponse,
            Pick<QueryParams, "pageIndex" | "pageSize">
        >({
            query: ({ pageIndex, pageSize }) => ({
                url: `/user/referrals?${buildQueryParams({ page: pageIndex, page_size: pageSize })}`,
                method: "GET",
            }),
            providesTags: [{ type: "UserReferral", id: "LIST" }],
        }),

        getUserPointsTransactions: builder.query<
            PointsTransactionListResponse,
            Pick<QueryParams, "pageIndex" | "pageSize"> & { transaction_type?: PointsTransactionType | "" }
        >({
            query: ({ pageIndex, pageSize, transaction_type }) => ({
                url: `/user/points-transactions?${buildQueryParams({
                    page: pageIndex,
                    page_size: pageSize,
                    transaction_type,
                })}`,
                method: "GET",
            }),
            providesTags: [{ type: "UserPointsTransaction", id: "LIST" }],
        }),

        getPointsConfig: builder.query<PointsConfigResponse, void>({
            query: () => ({ url: "/user/referral/config", method: "GET" }),
            providesTags: [{ type: "UserPointsConfig", id: "SELF" }],
        }),

        getPointsBalance: builder.query<PointsBalanceResponse, void>({
            query: () => ({ url: "/user/points-balance", method: "GET" }),
            providesTags: [{ type: "UserPointsBalance", id: "SELF" }],
        }),

        // applyPoints: builder.mutation<ApplyPointsResponse, { points: number }>({
        //     query: (body) => ({ url: "/user/checkout/apply-points", method: "POST", body }),
        //     invalidatesTags: [
        //         { type: "UserPointsBalance", id: "SELF" },
        //         { type: "UserReferralStats", id: "SELF" },
        //     ],
        // }),

        restorePoints: builder.mutation<GlobalResponse, void>({
            query: () => ({ url: "/user/checkout/restore-points", method: "POST" }),
            invalidatesTags: [
                { type: "UserPointsBalance", id: "SELF" },
                { type: "UserReferralStats", id: "SELF" },
            ],
        }),

        validateCoupon: builder.mutation<CouponValidateResponse, { code: string; order_amount: number }>({
            query: (body) => ({ url: "/coupon-codes/validate", method: "POST", body }),
        }),
    }),
});

export const {
    useGetUserReferralStatsQuery,
    useGetUserReferralsQuery,
    useGetUserPointsTransactionsQuery,
    useGetPointsConfigQuery,
    useGetPointsBalanceQuery,
    // useApplyPointsMutation,
    useRestorePointsMutation,
    useValidateCouponMutation,
} = referralApi;
