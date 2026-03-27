import type { Pagination } from ".";

export interface PhoneItem {
    label: string;
    value: string;
    icon_url?: string;
}

export interface EmailItem {
    label: string;
    value: string;
    icon_url?: string;
}

export interface SocialItem {
    label: string;
    value: string;
    link: string;
    icon_url?: string;
}

export interface AppSettingProps {
    phones: PhoneItem[];
    emails: EmailItem[];
    socials: SocialItem[];
    map: string;
}


export interface LinkedDeviceProps {
    id: number,
    os: string | null,
    browser: string | null,
    location: string | null,
    ip: string | null;
    created_at: string,
    updated_at: string
}

export interface LinkedDeviceList {
    data: {
        data: LinkedDeviceProps[],
        pagination: Pagination
    }
}