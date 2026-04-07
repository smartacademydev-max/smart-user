import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { useDeleteDiscussionMutation, useGetDiscussionByIdQuery } from "../../../../services/discussionApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { formatDateForDisplay } from "../../../../utils/dateFormat";
import { getDiscussionStatus } from "../../../../utils/statusMap";
import StatusPill from "../../../atom/StatusPill";
import ActionIconVisible from "../../../molecules/Action/ActionIconVisible";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import PageHeader from "../../../organism/PageHeader";
import CommentSection from "./CommentSection";

export default function DiscussionDetail() {
	const { id } = useParams();
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector((state) => state.auth.user);

	const [openConfirm, setOpenConfirm] = useState(false);

	const { data, isLoading } = useGetDiscussionByIdQuery({ id: Number(id) }, { skip: !id });
	const [deleteDiscussion] = useDeleteDiscussionMutation();
	// const [toggleVisibility] = useToggleDiscussionVisibilityMutation();

	const discussion = data?.data;

	const isOwner = !!user?.id && !!discussion?.created_by_id && discussion.created_by_id === Number(user.id);

	const handleDelete = async () => {
		if (!discussion?.id) return;
		try {
			const response = await deleteDiscussion({ ids: [discussion.id] }).unwrap();
			dispatch(showToast({ message: response.message || t("messages.discussion.deleted"), severity: "success" }));
			navigate(PATH.DISCUSSION.ROOT);
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.discussion.delete_error"), severity: "error" }));
		}
	};

	// const handleToggleVisibility = async () => {
	// 	if (!discussion?.id) return;
	// 	try {
	// 		const newStatus = discussion.status === "visible" ? "hidden" : "visible";
	// 		const response = await toggleVisibility({ id: discussion.id, status: newStatus }).unwrap();
	// 		dispatch(showToast({ message: response.message || t("messages.discussion.status_updated"), severity: "success" }));
	// 	} catch (e: any) {
	// 		dispatch(showToast({ message: e?.data?.message || t("messages.discussion.status_error"), severity: "error" }));
	// 	}
	// };

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Typography color="text.secondary">{t("messages.loading")}</Typography>
			</div>
		);
	}

	if (!discussion) return null;

	const statusVariant = getDiscussionStatus(discussion.status);

	return (
		<div className="discussion__detail__root h-full flex flex-col">
			<PageHeader
				breadcrumb={[
					{
						title: t("menus.discussion.root"),
						url: PATH.DISCUSSION.ROOT,
						icon: (
							<svg xmlns="http://www.w3.org/2000/svg" fill="#1D82F5" width="24" height="24" viewBox="0 0 24 24" >
								<path d="M8 10h8M8 13h5M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.6.376 3.112 1.043 4.453L2 22l5.547-1.043A9.955 9.955 0 0012 22z" stroke="#1D82F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						),
					},
					{ title: discussion.title },
				]}
			/>

			<Box className="detail__body flex-1 py-4" sx={{ maxWidth: 860 }}>
				<Stack className="mb-4 flex-wrap gap-2" direction="row" alignItems="center" justifyContent="space-between">
					<Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
						{discussion.mega_category_name && (
							<Chip label={discussion.mega_category_name} size="small" color="primary" variant="outlined" />
						)}
						<StatusPill variant={statusVariant} status={discussion.status} />
					</Stack>

					{isOwner && (
						<ActionIconVisible
							onEdit={() => navigate(PATH.DISCUSSION.EDIT.ROOT(discussion.id))}
							onDelete={() => setOpenConfirm(true)}
						/>
					)}
				</Stack>

				<Typography variant="h3" fontWeight={700} className="mb-3!">
					{discussion.title}
				</Typography>

				<Stack direction="row" gap={2} className="mb-4!" flexWrap="wrap">
					{discussion.created_by && (
						<Typography variant="caption" color="text.secondary">
							{t("labels.by")} {discussion.created_by}
						</Typography>
					)}
					{discussion.created_at && (
						<Typography variant="caption" color="text.secondary">
							{formatDateForDisplay(discussion.created_at)}
						</Typography>
					)}
				</Stack>

				<Divider className="mb-4!" />

				<Box
					className="discussion__content prose max-w-none"
					dangerouslySetInnerHTML={{ __html: discussion.description }}
					sx={{
						"& p": { marginBottom: "1em" },
						"& h1, & h2, & h3": { fontWeight: 600, marginBottom: "0.5em" },
						"& ul, & ol": { paddingLeft: "1.5em", marginBottom: "1em" },
					}}
				/>

				<CommentSection discussionId={discussion.id!} />
			</Box>

			<ConfirmationDialog
				open={openConfirm}
				setOpen={setOpenConfirm}
				title={t("messages.discussion.delete_title")}
				description={t("messages.discussion.delete_description")}
				onSave={handleDelete}
				icon={
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M21.0697 5.23C19.4597 5.07 17.8497 4.95 16.2297 4.86V4.85L16.0097 3.55C15.8597 2.63 15.6397 1.25 13.2997 1.25H10.6797C8.34967 1.25 8.12967 2.57 7.96967 3.54L7.75967 4.82C6.82967 4.88 5.89967 4.94 4.96967 5.03L2.92967 5.23C2.50967 5.27 2.20967 5.64 2.24967 6.05C2.28967 6.46 2.64967 6.76 3.06967 6.72L5.10967 6.52C10.3497 6 15.6297 6.2 20.9297 6.73C20.9597 6.73 20.9797 6.73 21.0097 6.73C21.3897 6.73 21.7197 6.44 21.7597 6.05C21.7897 5.64 21.4897 5.27 21.0697 5.23Z" fill="#1D82F5" />
						<path d="M19.2297 8.14C18.9897 7.89 18.6597 7.75 18.3197 7.75H5.67975C5.33975 7.75 4.99975 7.89 4.76975 8.14C4.53975 8.39 4.40975 8.73 4.42975 9.08L5.04975 19.34C5.15975 20.86 5.29975 22.76 8.78975 22.76H15.2097C18.6997 22.76 18.8398 20.87 18.9497 19.34L19.5697 9.09C19.5897 8.73 19.4597 8.39 19.2297 8.14Z" fill="#1D82F5" />
					</svg>
				}
			/>
		</div>
	);
}
