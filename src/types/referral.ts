import type { Pagination } from ".";
import type { GlobalResponse } from "./user";

export type ReferralStatus = "pending" | "registered" | "purchased" | "course_purchased" | "test_purchased" | "bundle_purchased";
export type PointsTransactionType = "earned" | "spent";
export type CouponDiscountType = "percentage" | "fixed";

export interface UserReferralStats {
    referral_code: string;
    total_referred: number;
    total_converted: number;
    points_from_referrals: number;
    total_points_balance: number;
}

export interface ReferralEntry {
    id: number;
    referred_user_name?: string;
    status: ReferralStatus;
    points_earned: number;
    created_at: string;
}

export interface PointsTransaction {
    id: number;
    action_label: string;
    action_type?: string;
    transaction_type: PointsTransactionType;
    points: number;
    balance_after: number;
    created_at: string;
}

export interface PointsConfig {
    conversion_rate: number;
}

export interface UserReferralStatsResponse extends GlobalResponse {
    data: UserReferralStats;
}

export interface ReferralListResponse extends GlobalResponse {
    data: {
        data: ReferralEntry[];
        pagination: Pagination;
    };
}

export interface PointsTransactionListResponse extends GlobalResponse {
    data: {
        data: PointsTransaction[];
        pagination: Pagination;
    };
}

export interface PointsConfigResponse extends GlobalResponse {
    data: PointsConfig;
}

export interface PointsBalanceResponse extends GlobalResponse {
    data: {
        balance: number;
    };
}

export interface ApplyPointsResponse extends GlobalResponse {
    data: {
        discount_amount: number;
        remaining_balance: number;
    };
}

export interface CouponValidateResponse extends GlobalResponse {
    data: {
        code: string;
        discount_type: CouponDiscountType;
        discount_value: number;
        discount_amount: number;
    };
}
