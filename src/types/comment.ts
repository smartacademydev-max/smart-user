import type { Pagination } from ".";

export interface MentionedUser {
	id: number;
	name: string;
}

export interface ReplyProps {
	id?: number;
	comment_id: number;
	body: string;
	mentioned_users?: MentionedUser[];
	created_by?: string;
	created_by_id?: number;
	created_at?: string;
	status: "active" | "suspended";
	likes_count?: number;
	dislikes_count?: number;
	user_reaction?: "liked" | "disliked" | null;
}

export interface CommentProps {
	id?: number;
	discussion_id: number;
	body: string;
	mentioned_users?: MentionedUser[];
	created_by?: string;
	created_by_id?: number;
	created_at?: string;
	status: "active" | "suspended";
	replies?: ReplyProps[];
	replies_count?: number;
	likes_count?: number;
	dislikes_count?: number;
	user_reaction?: "liked" | "disliked" | null;
}

export interface CommentList {
	data: {
		data: CommentProps[];
		pagination: Pagination;
	};
}

export interface CommentSingle {
	data: CommentProps;
}
