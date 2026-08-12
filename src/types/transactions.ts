import type { Pagination } from ".";
import type { PaymentMethods } from "./purchase";
import type { GlobalResponse } from "./user";

export interface TransactionProps {
    id: number;
    course_name: string;
    payment_method: string;
    purchased_date: string;
    amount_paid: number;
    invoice_id: string;
    status: "success" | "failed" | "pending";
}


export interface TransactionsResponse extends GlobalResponse {
    data: {
        data: TransactionProps[];
        pagination: Pagination;
    }
}

/* -------------------------------------------------------------------------- */
/*                    Installments (GET /user/{id}/installments)               */
/* -------------------------------------------------------------------------- */

export type InstallmentStatus = "pending" | "paid" | "overdue";

/** Settlement filter — `pending` includes rows whose stored status is "overdue". */
export type InstallmentFilter = "pending" | "settled" | "all";

export interface InstallmentRow {
    id: number;
    purchase_id: number;
    installment_number: number;
    amount: number;
    due_date: string;
    paid_at: string | null;
    status: InstallmentStatus;
    /** Computed live (unpaid AND past due) — drive the "overdue" badge off this. */
    is_overdue: boolean;
    payment_method: string | null;
    transaction_id: string | null;
    invoice_id: string | null;
    student_name: string | null;
    student_email: string | null;
    student_phone: string | null;
    course_name: string | null;
    is_archived: boolean;
}

export interface InstallmentsResponse extends GlobalResponse {
    data: {
        data: InstallmentRow[];
        pagination: Pagination;
    };
}

export interface ReciptProps {
    amount: number;
    original_amount?: number;
    thumbnail_url: string;
    name: string;
    published_date: string;
    transaction_id: string;
    /** Invoice number for this purchase. Falls back to the transaction reference when absent. */
    invoice_id?: string;
    created_at: string;
    payment_method: PaymentMethods;
    status: "success" | "failed" | "pending";
    download_url: string;
    mega_categories: string[];
    use_points?: boolean;
    points_amount?: number;
    coupon_code?: string;
    coupon_discount?: number;
}