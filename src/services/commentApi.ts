import { createApi } from "@reduxjs/toolkit/query/react";
import type { CommentList } from "../types/comment";
import type { GlobalResponse } from "../types/user";
import { buildQueryParams } from "../utils/buildQueryParams";
import { baseQuery } from "./baseQuery";

export const commentApi = createApi({
	reducerPath: "commentApi",
	baseQuery: baseQuery,
	tagTypes: ["Comment"],
	endpoints: (builder) => ({
		getCommentsByDiscussion: builder.query<CommentList, { discussionId: number; pageIndex: number; pageSize: number }>({
			query: ({ discussionId, pageIndex, pageSize }) => {
				const params = buildQueryParams({ page: pageIndex, page_size: pageSize });
				return { url: `/discussions/${discussionId}/comments?${params}`, method: "GET" };
			},
			providesTags: (result, _error, { discussionId }) =>
				result?.data?.data
					? [
						...result.data.data.map((c) => ({ type: "Comment" as const, id: c.id })),
						{ type: "Comment", id: `DISCUSSION_${discussionId}` },
					]
					: [{ type: "Comment", id: `DISCUSSION_${discussionId}` }],
		}),

		createComment: builder.mutation<GlobalResponse, { discussion_id: number; body: string; mentioned_user_ids?: number[] }>({
			query: ({ discussion_id, body, mentioned_user_ids }) => ({
				url: `/discussions/${discussion_id}/comments`,
				method: "POST",
				body: { body, mentioned_user_ids },
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		updateComment: builder.mutation<GlobalResponse, { id: number; discussion_id: number; body: string }>({
			query: ({ id, body }) => ({
				url: `/discussions/comments/${id}`,
				method: "PUT",
				body: { body },
			}),
			invalidatesTags: (_result, _error, { id, discussion_id }) => [
				{ type: "Comment", id },
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		deleteComment: builder.mutation<GlobalResponse, { ids: number[]; discussion_id: number }>({
			query: ({ ids }) => ({
				url: `/discussions/comments`,
				method: "DELETE",
				body: { comments: ids },
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		suspendComment: builder.mutation<GlobalResponse, { id: number; status: "active" | "suspended"; discussion_id: number }>({
			query: ({ id, status }) => ({
				url: `/discussions/comments/${id}/status`,
				method: "POST",
				body: { status },
			}),
			invalidatesTags: (_result, _error, { id, discussion_id }) => [
				{ type: "Comment", id },
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		likeComment: builder.mutation<GlobalResponse, { id: number; discussion_id: number }>({
			query: ({ id }) => ({
				url: `/discussions/comments/${id}/like`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		dislikeComment: builder.mutation<GlobalResponse, { id: number; discussion_id: number }>({
			query: ({ id }) => ({
				url: `/discussions/comments/${id}/dislike`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		createReply: builder.mutation<GlobalResponse, { comment_id: number; discussion_id: number; body: string; mentioned_user_ids?: number[] }>({
			query: ({ comment_id, body, mentioned_user_ids }) => ({
				url: `/discussions/comments/${comment_id}/replies`,
				method: "POST",
				body: { body, mentioned_user_ids },
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		updateReply: builder.mutation<GlobalResponse, { id: number; discussion_id: number; body: string }>({
			query: ({ id, body }) => ({
				url: `/discussions/comments/replies/${id}`,
				method: "PUT",
				body: { body },
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		deleteReply: builder.mutation<GlobalResponse, { ids: number[]; discussion_id: number }>({
			query: ({ ids }) => ({
				url: `/discussions/comments/replies`,
				method: "DELETE",
				body: { replies: ids },
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		suspendReply: builder.mutation<GlobalResponse, { id: number; status: "active" | "suspended"; discussion_id: number }>({
			query: ({ id, status }) => ({
				url: `/discussions/comments/replies/${id}/status`,
				method: "POST",
				body: { status },
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		likeReply: builder.mutation<GlobalResponse, { id: number; discussion_id: number }>({
			query: ({ id }) => ({
				url: `/discussions/comments/replies/${id}/like`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),

		dislikeReply: builder.mutation<GlobalResponse, { id: number; discussion_id: number }>({
			query: ({ id }) => ({
				url: `/discussions/comments/replies/${id}/dislike`,
				method: "POST",
			}),
			invalidatesTags: (_result, _error, { discussion_id }) => [
				{ type: "Comment", id: `DISCUSSION_${discussion_id}` },
			],
		}),
	}),
});

export const {
	useGetCommentsByDiscussionQuery,
	useCreateCommentMutation,
	useUpdateCommentMutation,
	useDeleteCommentMutation,
	useSuspendCommentMutation,
	useLikeCommentMutation,
	useDislikeCommentMutation,
	useCreateReplyMutation,
	useUpdateReplyMutation,
	useDeleteReplyMutation,
	useSuspendReplyMutation,
	useLikeReplyMutation,
	useDislikeReplyMutation,
} = commentApi;
