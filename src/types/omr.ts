import type { Pagination } from ".";
import type { GlobalResponse } from "./user";

export interface OmrFormatProps {
    id?: number;
    title: string;
    test_instructions: string;
    omr_sheet_instructions: string;
    post_test_instructions: string;
    omr_note: string;
    qr_code: File | null;
    qr_code_url: string;
    wrong_method_image: File | null;
    wrong_method_image_url: string;
    correct_method_image: File | null;
    correct_method_image_url: string;
    created_at?: string;
}

export interface OmrFormatList extends GlobalResponse {
    data: {
        data: OmrFormatProps[];
        pagination: Pagination;
    };
}
