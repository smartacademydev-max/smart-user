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
    // "View Leaderboard" CTA after a test; set in admin Course Settings
    leaderboard?: LeaderboardControl;
}

export interface LeaderboardControl {
    enabled: boolean;
    url: string; // may contain {course_id} / {test_id}
    course_ids: number[]; // empty = every course
}

export interface AppControlsResponse {
    data: AppControls;
    message: string;
    status: string;
}
