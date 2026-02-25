import type { Pagination } from ".";
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