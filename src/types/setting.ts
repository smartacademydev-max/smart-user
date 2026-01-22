import type { Pagination } from ".";

export interface AppSettingProps {
    contact_no: string;
    support_contact_no: string;
    email: string;
    support_email: string;
    address: string;
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