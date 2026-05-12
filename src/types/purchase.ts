
export interface PaymentOption {
    id: number;
    label: string;
    value: string;
    image: string;
}

export type PurchaseModuleTypes = "course" | "test" | "bundle";

export type PaymentMethods = "esewa" | "khalti" | "free"

export interface PurchaseFormValues {
    paymentOption: PaymentMethods;
    amount: number | null;
}



export interface PurchaseProps {
    payment_method: PaymentMethods;
    transaction_amount: string | number;
    transaction_status: "success" | "failed" | "pending";
    transaction_id: string | null;
    reference_id: string | null;
    is_trial: boolean;
    course_type?: string;
    subscription_id?: number | null;
    purchase_order_id?: string | null;
    purchase_order_name?: string | null;
    use_points?: boolean;
    points_amount?: number;
    coupon_code?: string;
}

export interface EsewaPaymentPayload {
    product_code: string;
    success_url: string;
    failure_url: string;
    amount: string;
    total_amount: string;
    tax_amount: string;
    transaction_uuid: string;
    product_service_charge: number;
    product_delivery_charge: number;
    signature: string;
}
