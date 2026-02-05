export interface Analytics {
    title: string;
    value: string;
    description: string;
    type: "success" | "error" | "info" | "warning"
}

export interface AnalyticsList {
    data: Analytics[];
}