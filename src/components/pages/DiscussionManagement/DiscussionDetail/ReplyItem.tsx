import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteReplyMutation, useUpdateReplyMutation } from "../../../../services/commentApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { ReplyProps } from "../../../../types/comment";
import { formatDateForDisplay } from "../../../../utils/dateFormat";
import Actions from "../../../molecules/Action";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import CommentInput from "./CommentInput";

interface Props {
	reply: ReplyProps;
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

export default function ReplyItem({ reply, discussionId }: Props) {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const user = useAppSelector((state) => state.auth.user);

	const [isEditing, setIsEditing] = useState(false);
	const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

	const isOwner = !!user?.id && reply.created_by_id === Number(user.id);

	const [updateReply, { isLoading: updating }] = useUpdateReplyMutation();
	const [deleteReply] = useDeleteReplyMutation();

	const handleUpdate = async (body: string) => {
		if (!reply.id) return;
		try {
			const res = await updateReply({ id: reply.id, discussion_id: discussionId, body }).unwrap();
			dispatch(showToast({ message: res.message || t("messages.comment.reply_updated"), severity: "success" }));
			setIsEditing(false);
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.comment.update_error"), severity: "error" }));
		}
	};

	const handleDelete = async () => {
		if (!reply.id) return;
		try {
			const res = await deleteReply({ ids: [reply.id], discussion_id: discussionId }).unwrap();
			dispatch(showToast({ message: res.message || t("messages.comment.reply_deleted"), severity: "success" }));
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.comment.delete_error"), severity: "error" }));
		}
	};

	return (
		<Box className="reply__item flex gap-3 pl-8 py-2">
			<Box
				className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
				sx={{ bgcolor: "primary.light", color: "primary.main" }}
			>
				{reply.created_by?.charAt(0)?.toUpperCase() ?? "?"}
			</Box>

			<Box className="flex-1 min-w-0">
				<Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
					<Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
						<Typography variant="body2" fontWeight={600}>
							{reply.created_by ?? t("messages.comment.anonymous")}
						</Typography>
						{reply.created_at && (
							<Typography variant="caption" color="text.secondary">
								{formatDateForDisplay(reply.created_at)}
							</Typography>
						)}
						{reply.status === "suspended" && (
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
							initialValue={reply.body}
							onSubmit={handleUpdate}
							loading={updating}
							onCancel={() => setIsEditing(false)}
							autoFocus
							minRows={1}
						/>
					</Box>
				) : (
					<Typography variant="subtitle2" fontWeight={400} color="text.middle" className="mt-1" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
						{renderBodyWithMentions(reply.body, theme.palette.primary.main)}
					</Typography>
				)}
			</Box>

			<ConfirmationDialog
				open={openDeleteConfirm}
				setOpen={setOpenDeleteConfirm}
				title={t("messages.comment.delete_reply_title")}
				description={t("messages.comment.delete_reply_description")}
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
