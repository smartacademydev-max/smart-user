import { createApi } from "@reduxjs/toolkit/query/react";
import type { QueryParams } from "../types";
import type {
	TicketAnalyticsResponse,
	TicketFilterParams,
	TicketList,
	TicketReplyList,
	TicketSingle,
	TicketTypeList,
} from "../types/ticket";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const ticketApi = createApi({
	reducerPath: "ticketApi",
	baseQuery: baseQuery,
	tagTypes: ["Ticket", "TicketReply", "TicketType"],
	endpoints: (builder) => ({
		getAllTickets: builder.query<TicketList, QueryParams & TicketFilterParams>({
			query: ({ pageIndex, pageSize, search, status, priority, type_id }) => {
				const params = buildQueryParams({
					page: pageIndex,
					page_size: pageSize,
					search,
					status,
					priority,
					type_id,
				});
				return { url: `/tickets?${params}`, method: "GET" };
			},
			providesTags: (result) =>
				result?.data?.data
					? [
						...result.data.data.map((t) => ({ type: "Ticket" as const, id: t.id })),
						{ type: "Ticket", id: "LIST" },
					]
					: [{ type: "Ticket", id: "LIST" }],
		}),

		getTicketById: builder.query<TicketSingle, { id: number }>({
			query: ({ id }) => ({ url: `/tickets/${id}`, method: "GET" }),
			providesTags: (_result, _error, { id }) => [{ type: "Ticket", id }],
		}),

		createTicket: builder.mutation<
			GlobalResponse,
			{ subject: string; description: string; type_id: number | null; priority?: string }
		>({
			query: (body) => ({ url: "/tickets", method: "POST", body }),
			invalidatesTags: [{ type: "Ticket", id: "LIST" }],
		}),

		updateTicket: builder.mutation<
			GlobalResponse,
			{
				id: number;
				body: Partial<{
					subject: string;
					description: string;
					type_id: number | null;
					status: string;
					priority: string;
					assigned_to_id: number | null;
					allow_attachment: boolean;
				}>;
			}
		>({
			query: ({ id, body }) => ({ url: `/tickets/${id}`, method: "PUT", body }),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Ticket", id },
				{ type: "Ticket", id: "LIST" },
			],
		}),

		deleteTicket: builder.mutation<GlobalResponse, { ids: number[] }>({
			query: ({ ids }) => ({
				url: "/tickets",
				method: "DELETE",
				body: { tickets: ids },
			}),
			invalidatesTags: [{ type: "Ticket", id: "LIST" }],
		}),


		getTicketReplies: builder.query<TicketReplyList, { ticket_id: number } & QueryParams>({
			query: ({ ticket_id, pageIndex, pageSize }) => {
				const params = buildQueryParams({ page: pageIndex, page_size: pageSize });
				return { url: `/tickets/${ticket_id}/replies?${params}`, method: "GET" };
			},
			providesTags: (_result, _error, { ticket_id }) => [
				{ type: "TicketReply", id: ticket_id },
			],
		}),

		createTicketReply: builder.mutation<
			GlobalResponse,
			{ ticket_id: number; body: string; attachment?: File }
		>({
			query: ({ ticket_id, body, attachment }) => {
				if (attachment) {
					const formData = new FormData();
					formData.append("body", body);
					formData.append("attachment", attachment);
					return { url: `/tickets/${ticket_id}/replies`, method: "POST", body: formData };
				}
				return { url: `/tickets/${ticket_id}/replies`, method: "POST", body: { body } };
			},
			invalidatesTags: (_result, _error, { ticket_id }) => [
				{ type: "TicketReply", id: ticket_id },
				{ type: "Ticket", id: ticket_id },
				{ type: "Ticket", id: "LIST" },
			],
		}),

		markRepliesAsRead: builder.mutation<GlobalResponse, { ticket_id: number }>({
			query: ({ ticket_id }) => ({
				url: `/tickets/${ticket_id}/mark-read`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, { ticket_id }) => [
				{ type: "TicketReply", id: ticket_id },
				{ type: "Ticket", id: ticket_id },
				{ type: "Ticket", id: "LIST" },
			],
		}),

		getTicketTypes: builder.query<TicketTypeList, QueryParams>({
			query: ({ pageIndex, pageSize, search }) => {
				const params = buildQueryParams({ page: pageIndex, page_size: pageSize, search });
				return { url: `/ticket/ticket-type?${params}`, method: "GET" };
			},
			providesTags: (result) =>
				result?.data?.data
					? [
						...result.data.data.map((t) => ({ type: "TicketType" as const, id: t.id })),
						{ type: "TicketType", id: "LIST" },
					]
					: [{ type: "TicketType", id: "LIST" }],
		}),

		getTicketAnalytics: builder.query<TicketAnalyticsResponse, void>({
			query: () => ({ url: "/ticket/analytics", method: "GET" }),
			providesTags: [{ type: "Ticket", id: "ANALYTICS" }],
		}),
	}),
});

export const {
	useGetAllTicketsQuery,
	useGetTicketByIdQuery,
	useCreateTicketMutation,
	useUpdateTicketMutation,
	useDeleteTicketMutation,
	useGetTicketRepliesQuery,
	useCreateTicketReplyMutation,
	useMarkRepliesAsReadMutation,
	useGetTicketTypesQuery,

	useGetTicketAnalyticsQuery,
} = ticketApi;
