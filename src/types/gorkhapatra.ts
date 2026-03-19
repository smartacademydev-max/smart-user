import type { Pagination } from ".";

export type GorkhapatraTypes = "all" | "descriptive" | "mcqs"

export interface GorkhapatraProps {
    id?: number;
    title: string;
    type: GorkhapatraTypes;
    description: string;
    content: string;
    status: "draft" | "published";
    thumbnail: File | null;
    thumbnail_url?: string
    created_at?: string;
    views?: number;
    added_by?: string;
}


export interface GorkhapatraList {
    data: {
        data: GorkhapatraProps[];
        pagination: Pagination;
    }
}