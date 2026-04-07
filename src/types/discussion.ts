import type { Pagination } from ".";

export interface DiscussionProps {
	id?: number;
	title: string;
	description: string;
	mega_category_id: number | null;
	mega_category_name?: string;
	status: "visible" | "hidden";
	created_by?: string;
	created_by_id?: number;
	created_at?: string;
	updated_at?: string;
	likes_count?: number;
	dislikes_count?: number;
	views_count?: number;
	comments_count?: number;
	user_reaction?: "liked" | "disliked" | null;
}

export const DiscussionInitialState: DiscussionProps = {
	title: "",
	description: "",
	mega_category_id: null,
	status: "visible",
};

export interface DiscussionList {
	data: {
		data: DiscussionProps[];
		pagination: Pagination;
	};
}

export interface DiscussionSingle {
	data: DiscussionProps;
}
