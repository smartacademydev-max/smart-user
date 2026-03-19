

export interface OnboardingPageItems {
    icon_url: string,
    title: string,
    description: string,
}

export interface OnboardingPage {
    page_id: number,
    icon_url: null,
    title: string,
    description: string,
    layout: "wide" | "square",
    items: OnboardingPageItems[]
}


export interface BannerProps {
    title: string;
    status: boolean;
    media_id: number;
    btn_title: string;
    image_url: string;
    sub_title: string;
    description: string;
    notifiable_id: string;
    notifiable_type: "live_class" | "general" | "test"
}

export interface BannerList {
    data: BannerProps[];
}
