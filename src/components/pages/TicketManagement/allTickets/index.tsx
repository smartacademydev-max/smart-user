import AddIcon from "@mui/icons-material/Add";
import {
	Box,
	CircularProgress,
	Typography
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useDeleteTicketMutation,
	useGetAllTicketsQuery,
	useGetTicketAnalyticsQuery,
	useGetTicketTypesQuery
} from "../../../../services/ticketApi";
import { type TicketProps, type TicketStatus } from "../../../../types/ticket";
import TabController from "../../../molecules/TabController";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";
import TicketForm from "../TicketForm";
import TicketAnalyticsBar from "./TicketAnalyticsBar";
import TicketCard from "./TicketCard";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";


export default function AllTickets() {
	const { t } = useTranslation();
const navigate = useNavigate();
	const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(null);
	const [statusTab, _setStatusTab] = useState<TicketStatus | "">("");
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [page, setPage] = useState(1);
	const [typeTab, setTypeTab] = useState<number>(0);
	const [allTickets, setAllTickets] = useState<TicketProps[]>([]);
	const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
	const [openForm, setOpenForm] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<number[] | null>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pendingResetRef = useRef(false);

	const { data, isFetching, refetch } = useGetAllTicketsQuery({
		pageIndex: page,
		pageSize: 25,
		search: debouncedSearch,
		status: statusTab,
		type_id: typeTab || undefined,
	});

	const { data: analyticsData, isLoading: analyticsLoading } = useGetTicketAnalyticsQuery();
	const [deleteTicket, { isLoading: deleting }] = useDeleteTicketMutation();
	// const [updateTicket] = useUpdateTicketMutation();
	const { data: typesData } = useGetTicketTypesQuery({ pageIndex: 1, pageSize: 100 });
	const ticketTypes = typesData?.data?.data ?? [];

	const typeTabs = [
		{ label: "All", value: 0 },
		...ticketTypes.map((type) => ({ label: type.name, value: type.id })),
	];
	// Debounce search input
	useEffect(() => {
		if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
		searchTimerRef.current = setTimeout(() => setDebouncedSearch(search), 400);
		return () => {
			if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
		};
	}, [search]);

	useEffect(() => {
		pendingResetRef.current = true;
		setPage(1);
		setSelectedRows(new Set());
	}, [statusTab, debouncedSearch]);


	useEffect(() => {
		const incoming = data?.data?.data;
		if (!incoming) return;

		if (pendingResetRef.current || page === 1) {
			pendingResetRef.current = false;
			setAllTickets(incoming);
		} else {
			setAllTickets((prev) => {
				const ids = new Set(prev.map((t) => t.id));
				return [...prev, ...incoming.filter((t) => !ids.has(t.id))];
			});
		}
	}, [data]);

	// Keep selected ticket in sync with latest data
	useEffect(() => {
		if (!selectedTicket) return;
		const updated = allTickets.find((t) => t.id === selectedTicket.id);
		if (updated) setSelectedTicket(updated);
	}, [allTickets]);

	const handleListScroll = useCallback(() => {
		const el = listRef.current;
		if (!el || isFetching) return;
		const pagination = data?.data?.pagination;
		if (!pagination) return;
		const hasMore = page < Math.ceil((pagination.total ?? 0) / 25);
		if (hasMore && el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
			setPage((p) => p + 1);
		}
	}, [isFetching, data, page]);

	const handleSelectRow = useCallback((id: number, checked: boolean) => {
		setSelectedRows((prev) => {
			const next = new Set(prev);
			if (checked) next.add(id);
			else next.delete(id);
			return next;
		});
	}, []);

	const handleDelete = async () => {
		if (!deleteTarget) return;
		await deleteTicket({ ids: deleteTarget }).unwrap();
		setDeleteTarget(null);
		setSelectedRows(new Set());
		if (selectedTicket && deleteTarget.includes(selectedTicket.id!)) {
			setSelectedTicket(null);
		}
		refetch();
	};

	const pagination = data?.data?.pagination;
	const hasMore = pagination ? page < Math.ceil((pagination.total ?? 0) / 25) : false;

	return (
		<Box className="h-full overflow-hidden flex flex-col">
			<div className="top__header">
				<PageHeader
					breadcrumb={[
						{
							icon: (
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" />
								</svg>
							),
							title: t("menus.ticket.root"),
						},
					]}
					cta={{
						label: t("messages.ticket.new_ticket"),
						icon: <AddIcon fontSize="small" />,
					}}
					handleOpenPopup={() => setOpenForm(true)}
				/>
			</div>

			<div className="h-full flex-1 flex flex-col overflow-auto">
				<TicketAnalyticsBar
					analytics={analyticsData?.data}
					isLoading={analyticsLoading}
				/>
				<Typography variant="h5" className="my-4!" fontWeight={600}>
					{t("messages.enrolled_courses")}
				</Typography>


				<Box sx={{ flexShrink: 0 }}>
					<TableFilter
						search={search}
						setSearch={setSearch}
					/>
				</Box>

				<TabController
					currentActive={typeTab}
					setActiveTab={(val) => {
						setTypeTab(val);
						setSelectedTicket(null);
					}}
					options={typeTabs}
				/>

				<Box
					ref={listRef}
					onScroll={handleListScroll}
					sx={{ px: 2, py: 1.5 }}
				>
					{allTickets.length === 0 && !isFetching && (
						<EmptyRoute
							title="No Tickets Available"
							message={t("messages.empty_states.tickets.description")}
						/>
					)}

					{allTickets.map((ticket) => (
						<TicketCard
							key={ticket.id}
							ticket={ticket}
							checked={selectedRows.has(ticket.id!)}
							onSelect={handleSelectRow}
							// onClick={() => setSelectedTicket(ticket)}
							 onClick={() => navigate(PATH.TICKET.CHATS.ROOT)}
						/>
					))}

					{isFetching && (
						<Box display="flex" justifyContent="center" py={3}>
							<CircularProgress size={24} />
						</Box>
					)}

					{!isFetching && hasMore && (
						<Box textAlign="center" py={1}>
							<Typography
								variant="caption"
								color="primary"
								sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
								onClick={() => setPage((p) => p + 1)}
							>
								Load more
							</Typography>
						</Box>
					)}
				</Box>

				{openForm && (
					<TicketForm
						open={openForm}
						onClose={() => setOpenForm(false)}
						onSuccess={() => {
							setOpenForm(false);
							pendingResetRef.current = true;
							setPage(1);
							setAllTickets([]);
							refetch();
						}}
					/>
				)}

				<ConfirmationDialog
					open={Boolean(deleteTarget)}
					setOpen={(v) => {
						if (!v) setDeleteTarget(null);
					}}
					title={t("messages.ticket.delete_title")}
					description={t("messages.ticket.delete_description")}
					onSave={handleDelete}
					isLoading={deleting}
				/>
			</div>
		</Box>
	);
}