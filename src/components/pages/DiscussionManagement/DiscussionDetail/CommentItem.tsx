import { Box, Button, Chip, Divider, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { ArrowForward, Dislike, Like1 } from "iconsax-reactjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateReplyMutation, useDeleteCommentMutation, useDislikeCommentMutation, useLikeCommentMutation, useUpdateCommentMutation } from "../../../../services/commentApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { CommentProps } from "../../../../types/comment";
import { formatDateForDisplay } from "../../../../utils/dateFormat";
import Actions from "../../../molecules/Action";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import CommentInput from "./CommentInput";
import ReplyItem from "./ReplyItem";

interface Props {
	comment: CommentProps;
	discussionId: number;
}

function renderBodyWithMentions(body: string, primaryColor: string) {
	const parts = body.split(/(@\S+)/g);
	return parts.map((part, i) =>
		/^@\S+$/.test(part) ? (
			<span key={i} style={{ color: primaryColor, fontWeight: 500 }}>
				{part}
			</span>
		) : (
			part
		)
	);
}

export default function CommentItem({ comment, discussionId }: Props) {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const user = useAppSelector((state) => state.auth.user);

	const [isEditing, setIsEditing] = useState(false);
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

	const isOwner = !!user?.id && comment.created_by_id === Number(user.id);

	const [updateComment, { isLoading: updating }] = useUpdateCommentMutation();
	const [deleteComment] = useDeleteCommentMutation();
	const [createReply, { isLoading: replyLoading }] = useCreateReplyMutation();
	const [likeComment] = useLikeCommentMutation();
	const [dislikeComment] = useDislikeCommentMutation();

	const isLiked = comment.user_reaction === "liked";
	const isDisliked = comment.user_reaction === "disliked";

	const handleLike = async () => {
		if (!comment.id) return;
		try {
			await likeComment({ id: comment.id, discussion_id: discussionId }).unwrap();
		} catch {
			dispatch(showToast({ message: t("messages.toasts.error_general"), severity: "error" }));
		}
	};

	const handleDislike = async () => {
		if (!comment.id) return;
		try {
			await dislikeComment({ id: comment.id, discussion_id: discussionId }).unwrap();
		} catch {
			dispatch(showToast({ message: t("messages.toasts.error_general"), severity: "error" }));
		}
	};

	const handleUpdate = async (body: string) => {
		if (!comment.id) return;
		try {
			const res = await updateComment({ id: comment.id, discussion_id: discussionId, body }).unwrap();
			dispatch(showToast({ message: res.message || t("messages.comment.updated"), severity: "success" }));
			setIsEditing(false);
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.comment.update_error"), severity: "error" }));
		}
	};

	const handleDelete = async () => {
		if (!comment.id) return;
		try {
			const res = await deleteComment({ ids: [comment.id], discussion_id: discussionId }).unwrap();
			dispatch(showToast({ message: res.message || t("messages.comment.deleted"), severity: "success" }));
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.comment.delete_error"), severity: "error" }));
		}
	};

	const handleReplySubmit = async (body: string, mentionedUserIds: number[]) => {
		if (!comment.id) return;
		try {
			const res = await createReply({
				comment_id: comment.id,
				discussion_id: discussionId,
				body,
				mentioned_user_ids: mentionedUserIds.length ? mentionedUserIds : undefined,
			}).unwrap();
			dispatch(showToast({ message: res.message || t("messages.comment.reply_posted"), severity: "success" }));
			setShowReplyInput(false);
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.comment.reply_error"), severity: "error" }));
		}
	};

	return (
		<Box className="comment__item py-3">
			<Stack direction="row" gap={2}>
				<Box
					className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
					sx={{ bgcolor: "primary.light", color: "primary.main" }}
				>
					{comment.created_by?.charAt(0)?.toUpperCase() ?? "?"}
				</Box>

				<Box className="flex-1 min-w-0">
					<Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
						<Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
							<Typography variant="body2" fontWeight={600}>
								{comment.created_by ?? t("messages.comment.anonymous")}
							</Typography>
							{comment.created_at && (
								<Typography variant="caption" color="text.secondary">
									{formatDateForDisplay(comment.created_at)}
								</Typography>
							)}
							{comment.status === "suspended" && (
								<Chip label={t("labels.suspended")} size="small" color="warning" variant="outlined" />
							)}
						</Stack>

						{isOwner && (
							<Actions
								onEdit={() => setIsEditing(true)}
								onDelete={() => setOpenDeleteConfirm(true)}
							/>
						)}
					</Stack>

					{isEditing ? (
						<Box className="mt-2">
							<CommentInput
								initialValue={comment.body}
								onSubmit={handleUpdate}
								loading={updating}
								onCancel={() => setIsEditing(false)}
								autoFocus
								minRows={1}
							/>
						</Box>
					) : (
						<Typography variant="subtitle2" className="mt-1" fontWeight={400} color="text.middle" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
							{renderBodyWithMentions(comment.body, theme.palette.primary.main)}
						</Typography>
					)}

					{!isEditing && (
						<Stack direction="row" alignItems="center" gap={1} mt={0.75}>
							<Tooltip title={t("actions.like")}>
								<Stack direction="row" alignItems="center" gap={0.25}>
									<IconButton
										size="small"
										onClick={handleLike}
										sx={{ p: 0.25, color: isLiked ? "primary.main" : "text.secondary" }}
									>
										<Like1 size={14} />
									</IconButton>
									<Typography variant="caption" color={isLiked ? "primary.main" : "text.secondary"}>
										{comment.likes_count ?? 0}
									</Typography>
								</Stack>
							</Tooltip>

							<Tooltip title={t("actions.dislike")}>
								<Stack direction="row" alignItems="center" gap={0.25}>
									<IconButton
										size="small"
										onClick={handleDislike}
										sx={{ p: 0.25, color: isDisliked ? "error.main" : "text.secondary" }}
									>
										<Dislike size={14} />
									</IconButton>
									<Typography variant="caption" color={isDisliked ? "error.main" : "text.secondary"}>
										{comment.dislikes_count ?? 0}
									</Typography>
								</Stack>
							</Tooltip>

							<Button
								sx={{ padding: 0, gap: 0 }}
								variant="text"
								onClick={() => setShowReplyInput((v) => !v)}
								startIcon={<ArrowForward size={16} />}
							>
								<Typography variant="subtitle2">{showReplyInput ? t("actions.cancel") : t("messages.comment.reply")}</Typography>
							</Button>
						</Stack>
					)}

					{showReplyInput && (
						<Box className="mt-2">
							<CommentInput
								onSubmit={handleReplySubmit}
								loading={replyLoading}
								placeholder={t("messages.comment.reply_placeholder")}
								onCancel={() => setShowReplyInput(false)}
								autoFocus
								minRows={1}
							/>
						</Box>
					)}

					{comment.replies && comment.replies.length > 0 && (
						<Box className="mt-2">
							<Divider sx={{ mb: 1 }} />
							{comment.replies.map((reply) => (
								<ReplyItem key={reply.id} reply={reply} discussionId={discussionId} />
							))}
						</Box>
					)}
				</Box>
			</Stack>

			<ConfirmationDialog
				open={openDeleteConfirm}
				setOpen={setOpenDeleteConfirm}
				title={t("messages.comment.delete_title")}
				description={t("messages.comment.delete_description")}
				onSave={handleDelete}
				icon={
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M21.0697 5.23C19.4597 5.07 17.8497 4.95 16.2297 4.86V4.85L16.0097 3.55C15.8597 2.63 15.6397 1.25 13.2997 1.25H10.6797C8.34967 1.25 8.12967 2.57 7.96967 3.54L7.75967 4.82C6.82967 4.88 5.89967 4.94 4.96967 5.03L2.92967 5.23C2.50967 5.27 2.20967 5.64 2.24967 6.05C2.28967 6.46 2.64967 6.76 3.06967 6.72L5.10967 6.52C10.3497 6 15.6297 6.2 20.9297 6.73C20.9597 6.73 20.9797 6.73 21.0097 6.73C21.3897 6.73 21.7197 6.44 21.7597 6.05C21.7897 5.64 21.4897 5.27 21.0697 5.23Z" fill="#1D82F5" />
						<path d="M19.2297 8.14C18.9897 7.89 18.6597 7.75 18.3197 7.75H5.67975C5.33975 7.75 4.99975 7.89 4.76975 8.14C4.53975 8.39 4.40975 8.73 4.42975 9.08L5.04975 19.34C5.15975 20.86 5.29975 22.76 8.78975 22.76H15.2097C18.6997 22.76 18.8398 20.87 18.9497 19.34L19.5697 9.09C19.5897 8.73 19.4597 8.39 19.2297 8.14Z" fill="#1D82F5" />
					</svg>
				}
			/>
		</Box>
	);
}
