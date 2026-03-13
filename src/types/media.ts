import type { Pagination } from ".";

export interface MediaProps {
    id: number,
    file_name: string,
    url: string,
    size: number
    has_seen: boolean;
    is_downloadable: boolean;
}

export interface MediaList {
    data: {
        data: MediaProps[],
        pagination: Pagination
    }
}