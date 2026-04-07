import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateCommentMutation, useGetCommentsByDiscussionQuery } from "../../../../services/commentApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";

import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import TablePagination from "../../../molecules/Pagination";

interface Props {
	discussionId: number;
}

export default function CommentSection({ discussionId }: Props) {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [qp, setQp] = useState({ pageIndex: 1, pageSize: 10 });
	const [createComment, { isLoading: posting }] = useCreateCommentMutation();

	const { data, isLoading } = useGetCommentsByDiscussionQuery({
		discussionId,
		pageIndex: qp.pageIndex,
		pageSize: qp.pageSize,
	});

	const comments = data?.data?.data ?? [];
	const pagination = data?.data?.pagination;
	const totalPages = pagination ? Math.ceil(pagination.total / qp.pageSize) : 0;

	const handleCommentSubmit = async (body: string, mentionedUserIds: number[]) => {
		try {
			const res = await createComment({
				discussion_id: discussionId,
				body,
				mentioned_user_ids: mentionedUserIds.length ? mentionedUserIds : undefined,
			}).unwrap();
			dispatch(showToast({ message: res.message || t("messages.comment.posted"), severity: "success" }));
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.comment.post_error"), severity: "error" }));
		}
	};

	return (
		<Box className="comment__section mt-6">
			<Divider className="mb-4!" />

			<Stack direction="row" alignItems="center" gap={1} className="mb-4!">
				<Typography variant="h6" fontWeight={600}>
					{t("messages.comment.title")}
					{pagination?.total ? (
						<Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
							({pagination.total})
						</Typography>
					) : null}
				</Typography>
			</Stack>

			{/* New Comment Input */}
			<Box className="mb-4">
				<CommentInput
					onSubmit={handleCommentSubmit}
					loading={posting}
					placeholder={t("messages.comment.placeholder")}
				/>
			</Box>

			{/* Comment List */}
			{isLoading ? (
				<Stack gap={2}>
					{[1, 2, 3].map((i) => (
						<Stack key={i} direction="row" gap={2}>
							<Skeleton variant="circular" width={36} height={36} />
							<Box className="flex-1">
								<Skeleton width="30%" height={16} />
								<Skeleton width="80%" height={14} sx={{ mt: 0.5 }} />
								<Skeleton width="60%" height={14} sx={{ mt: 0.5 }} />
							</Box>
						</Stack>
					))}
				</Stack>
			) : comments.length === 0 ? (
				<Box className="flex flex-col items-center justify-center py-10 gap-2">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.3">
						<path d="M8 10h8M8 13h5M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.6.376 3.112 1.043 4.453L2 22l5.547-1.043A9.955 9.955 0 0012 22z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<Typography variant="body2" color="text.secondary">
						{t("messages.comment.empty")}
					</Typography>
				</Box>
			) : (
				// <Stack divider={<Divider />}>
				comments.map((comment) => (
					<CommentItem key={comment.id} comment={comment} discussionId={discussionId} />
				))
				// </Stack>
			)}

			{totalPages > 1 && (
				<TablePagination
					qp={qp}
					setQp={setQp}
					totalPages={totalPages}
					totalRecords={pagination?.total}
				/>
			)}
		</Box>
	);
}
