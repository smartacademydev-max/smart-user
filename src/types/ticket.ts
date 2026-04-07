import type { Pagination } from ".";
import type { User } from "./user";

export type TicketStatus =
	| "open"
	| "assigned"
	| "waiting_for_reply"
	| "resolved";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface TicketTypeProps {
	id: number;
	name: string;
	created_at?: string;
}

export interface TicketTypeList {
	data: {
		data: TicketTypeProps[];
		pagination: Pagination;
	};
}

export interface TicketReplyProps {
	id?: number;
	ticket_id: number;
	body: string;
	attachment_url?: string | null;
	is_read?: boolean;
	created_by?: string;
	created_by_id?: number;
	created_at?: string;
}

export interface TicketReplyList {
	data: {
		data: TicketReplyProps[];
		pagination: Pagination;
	};
}

export interface TicketReplySingle {
	data: TicketReplyProps;
}

export interface TicketProps {
	id?: number;
	ticket_number?: string;
	subject: string;
	description: string;
	type_id: number | null;
	type_name?: string;
	status?: TicketStatus;
	priority?: TicketPriority;
	created_by?: string;
	created_by_id?: number;
	assigned_to?: User[];
	assigned_to_id?: number | number[] | null;
	allow_attachment?: boolean;
	unread_count?: number;
	last_reply?: TicketReplyProps | null;
	replies_count?: number;
	created_at?: string;
	updated_at?: string;
}

export interface TicketList {
	data: {
		data: TicketProps[];
		pagination: Pagination;
	};
}

export interface TicketSingle {
	data: TicketProps;
}

export interface TicketAnalytics {
	total: number;
	open: number;
	active: number;
	resolved: number;
}

export interface TicketAnalyticsResponse {
	data: TicketAnalytics;
}

export const TicketInitialState: TicketProps = {
	subject: "",
	description: "",
	type_id: null,
	status: "open",
	priority: "medium",
};

export interface TicketFilterParams {
	status?: TicketStatus | "";
	priority?: TicketPriority | "";
	type_id?: number | null;
}

export const TICKET_PRIORITY_OPTIONS: { label: string; value: TicketPriority }[] = [
	{ label: "Low", value: "low" },
	{ label: "Medium", value: "medium" },
	{ label: "High", value: "high" },
	{ label: "Urgent", value: "urgent" },
];

export const TICKET_STATUS_OPTIONS: { label: string; value: TicketStatus }[] = [
	{ label: "Open", value: "open" },
	{ label: "Assigned", value: "assigned" },
	{ label: "Waiting for Reply", value: "waiting_for_reply" },
	{ label: "Resolved", value: "resolved" },
];

export const STATUS_TABS: { label: string; value: TicketStatus | "" }[] = [
	{ label: "All", value: "" },
	{ label: "Open", value: "open" },
	{ label: "Assigned", value: "assigned" },
	{ label: "Waiting", value: "waiting_for_reply" },
	{ label: "Resolved", value: "resolved" },
];