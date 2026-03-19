import type { Pagination } from ".";
import type { GlobalResponse } from "./user";


export type NotifiableTypes = "general" | "test" | "live_class"|"offline";
export interface NotificationProps {
    id: number;
    title: string;
    description: string;
    external_link: string | null;
    image_url: string | null;
    has_seen: boolean;
    sent_at: string;
    notification_type: NotifiableTypes;
    notifiable_id: number | null;
}


export interface NotificationListResponse extends GlobalResponse {
    data: {
        data: NotificationProps[]
        pagination: Pagination
    };

}