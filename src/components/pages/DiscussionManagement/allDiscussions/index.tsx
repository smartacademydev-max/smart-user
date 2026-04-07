import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../routes/PATH";
import { useGetAllMegaCategoryQuery } from "../../../../services/categoryApi";
import { useDeleteDiscussionMutation, useGetAllDiscussionsQuery, useToggleDiscussionVisibilityMutation } from "../../../../services/discussionApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";

import TablePagination from "../../../molecules/Pagination";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import DiscussionCard from "../../../organism/Cards/DiscussionCard";

export default function AllDiscussions() {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [qp, setQp] = useState({ pageIndex: 1, pageSize: 20 });
	const [megaCategoryId, setMegaCategoryId] = useState<number | "">("");
	const [openConfirm, setOpenConfirm] = useState(false);
	const [discussionToDelete, setDiscussionToDelete] = useState<number[]>([]);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(search), 1000);
		return () => clearTimeout(timer);
	}, [search]);

	const { data, isLoading } = useGetAllDiscussionsQuery({
		...qp,
		search: debouncedSearch,
		mega_category_id: megaCategoryId || null,
	});

	const { data: categoriesData } = useGetAllMegaCategoryQuery();

	const [deleteDiscussion] = useDeleteDiscussionMutation();
	const [toggleVisibility] = useToggleDiscussionVisibilityMutation();

	const discussions = data?.data?.data || [];
	const pagination = data?.data?.pagination;
	const categories = categoriesData?.data || [];

	const openDeleteConfirmation = (ids: number[]) => {
		setDiscussionToDelete(ids);
		setOpenConfirm(true);
	};

	const handleDelete = async () => {
		try {
			const response = await deleteDiscussion({ ids: discussionToDelete }).unwrap();
			dispatch(showToast({ message: response.message || t("messages.discussion.deleted"), severity: "success" }));
			setOpenConfirm(false);
			setDiscussionToDelete([]);
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.discussion.delete_error"), severity: "error" }));
			setOpenConfirm(false);
		}
	};

	const handleToggleVisibility = async (id: number, currentStatus: "visible" | "hidden") => {
		try {
			const newStatus = currentStatus === "visible" ? "hidden" : "visible";
			const response = await toggleVisibility({ id, status: newStatus }).unwrap();
			dispatch(showToast({ message: response.message || t("messages.discussion.status_updated"), severity: "success" }));
		} catch (e: any) {
			dispatch(showToast({ message: e?.data?.message || t("messages.discussion.status_error"), severity: "error" }));
		}
	};

	const selectCategory = (id: number | "") => {
		setMegaCategoryId(id);
		setQp((p) => ({ ...p, pageIndex: 1 }));
	};

	return (
		<div className="all__discussions__root">
			<PageHeader
				breadcrumb={[
					{
						title: t("menus.discussion.root"),
						icon: (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path d="M8 10h8M8 13h5M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.6.376 3.112 1.043 4.453L2 22l5.547-1.043A9.955 9.955 0 0012 22z" stroke="#1D82F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						),
					},
				]}
				cta={{
					label: `${t("actions.create")} ${t("messages.discussion.singular")}`,
					url: PATH.DISCUSSION.CREATE.ROOT,
				}}
			/>

			<TableFilter search={search} setSearch={setSearch} />

			<div className="grid grid-cols-12 gap-6 mt-2">
				<Box className="col-span-12 md:col-span-3">
					<Box
						sx={{
							border: (theme) => `1px solid ${theme.palette.textField.border}`,
							borderRadius: 2,
							p: 2,
							position: { md: "sticky" },
							top: { md: 16 },
						}}
					>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ textTransform: "uppercase", letterSpacing: "0.07em", display: "block", mb: 1 }}
						>
							{t("labels.mega_category")}
						</Typography>

						<CategoryItem
							label={t("labels.all")}
							active={megaCategoryId === ""}
							onClick={() => selectCategory("")}
						/>

						{categories.map((cat) => (
							<CategoryItem
								key={cat.id}
								label={cat.name}
								active={megaCategoryId === cat.id}
								onClick={() => selectCategory(cat.id as number)}
							/>
						))}
					</Box>
				</Box>

				<div className="col-span-12 md:col-span-9 flex flex-col gap-4">
					{isLoading ? (
						<Stack gap={3}>
							{[1, 2, 3, 4].map((i) => (
								<Box
									key={i}
									sx={{ border: (theme) => `1px solid ${theme.palette.textField.border}`, borderRadius: 2, p: 2.5 }}
								>
									<Stack direction="row" gap={1} mb={1}>
										<Skeleton width={80} height={24} sx={{ borderRadius: 4 }} />
										<Skeleton width={60} height={24} sx={{ borderRadius: 4 }} />
									</Stack>
									<Skeleton width="70%" height={28} sx={{ mb: 0.75 }} />
									<Skeleton width="100%" height={16} />
									<Skeleton width="85%" height={16} sx={{ mt: 0.5 }} />
									<Divider sx={{ my: 1.5 }} />
									<Stack direction="row" justifyContent="space-between">
										<Skeleton width={120} height={16} />
										<Skeleton width={160} height={16} />
									</Stack>
								</Box>
							))}
						</Stack>
					) : !discussions.length ? (
						<EmptyRoute
							title={t("messages.empty_states.discussion.title")}
							message={t("messages.empty_states.discussion.description")}
						/>
					) : (
						<>
							{discussions.map((discussion) => (
								<DiscussionCard
									key={discussion.id}
									data={discussion}
									onDelete={() => openDeleteConfirmation([discussion.id!])}
									onToggleVisibility={() => handleToggleVisibility(discussion.id!, discussion.status)}
								/>
							))}

							{pagination?.total_pages && pagination.total_pages > 1 && (
								<TablePagination
									qp={qp}
									setQp={setQp}
									totalPages={pagination.total_pages}
								/>
							)}
						</>
					)}
				</div>
			</div>

			<ConfirmationDialog
				open={openConfirm}
				setOpen={setOpenConfirm}
				title={t("messages.discussion.delete_title")}
				description={t("messages.discussion.delete_description")}
				onSave={handleDelete}
				icon={
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M21.0697 5.23C19.4597 5.07 17.8497 4.95 16.2297 4.86V4.85L16.0097 3.55C15.8597 2.63 15.6397 1.25 13.2997 1.25H10.6797C8.34967 1.25 8.12967 2.57 7.96967 3.54L7.75967 4.82C6.82967 4.88 5.89967 4.94 4.96967 5.03L2.92967 5.23C2.50967 5.27 2.20967 5.64 2.24967 6.05C2.28967 6.46 2.64967 6.76 3.06967 6.72L5.10967 6.52C10.3497 6 15.6297 6.2 20.9297 6.73C20.9597 6.73 20.9797 6.73 21.0097 6.73C21.3897 6.73 21.7197 6.44 21.7597 6.05C21.7902 5.64 21.4897 5.27 21.0697 5.23Z" fill="#1D82F5" />
						<path d="M19.2297 8.14C18.9897 7.89 18.6597 7.75 18.3197 7.75H5.67975C5.33975 7.75 4.99975 7.89 4.76975 8.14C4.53975 8.39 4.40975 8.73 4.42975 9.08L5.04975 19.34C5.15975 20.86 5.29975 22.76 8.78975 22.76H15.2097C18.6997 22.76 18.8398 20.87 18.9497 19.34L19.5697 9.09C19.5897 8.73 19.4597 8.39 19.2297 8.14Z" fill="#1D82F5" />
					</svg>
				}
			/>
		</div>
	);
}

interface CategoryItemProps {
	label: string;
	active: boolean;
	onClick: () => void;
}

function CategoryItem({ label, active, onClick }: CategoryItemProps) {
	return (
		<Box
			className="cursor-pointer px-3 py-2 rounded-lg mb-0.5 flex items-center"
			sx={{
				bgcolor: active ? "primary.dark" : "transparent",
				transition: "background-color 0.1s, border-color 0.1s",
			}}
			onClick={onClick}
		>
			<Typography
				variant="body2"
				color={active ? "primary.contrastText" : "text.primary"}
				sx={{ lineHeight: 1.5 }}
			>
				{label}
			</Typography>
		</Box>
	);
}
