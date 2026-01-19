

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

