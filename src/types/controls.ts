export interface GlobalDiscount {
    enabled: boolean;
    percentage: number;
    label: string;
}

export interface AppControls {
    screen_protection: boolean;
    maintenance_mode: boolean;
    single_device_login: boolean;
    otp_limit: number;
    global_discount: GlobalDiscount;
    watermark_message: string;
}

export interface AppControlsResponse {
    data: AppControls;
    message: string;
    status: string;
}
