import { Box, OutlinedInput } from "@mui/material";
import { SearchNormal } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
	useGetAllTicketsQuery
} from "../../../../services/ticketApi";
import { PATH } from "../../../../routes/PATH";
import { STATUS_TABS, type TicketStatus } from "../../../../types/ticket";
import TabController from "../../../molecules/TabController";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TicketChatPanel from "../allTickets/TicketChatPanel";
import TicketForm from "../TicketForm";
import MessageCard from "./MessageCard";


export default function TicketChats() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { ticketId } = useParams<{ ticketId: string }>();
	const [openForm, setOpenForm] = useState(false);

	const [statusTab, setStatusTab] = useState<TicketStatus | "">("");
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [open, setOpen] = useState<boolean>(false);
	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	useEffect(() => {
		if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
		searchTimerRef.current = setTimeout(() => setDebouncedSearch(search), 400);
		return () => {
			if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
		};
	}, [search]);

	const { data, refetch, isFetching } = useGetAllTicketsQuery({
		pageIndex: 1,
		pageSize: 3,
		search: debouncedSearch,
		status: statusTab,
	});

	// Derive selected ticket from URL param; fall back to first ticket if no param
	const tickets = data?.data?.data ?? [];
	const selectedTicket = ticketId
		? (tickets.find((t) => t.id === Number(ticketId)) ?? null)
		: (tickets[0] ?? null);

	// If no ticketId in URL but we have tickets, redirect to the first
	useEffect(() => {
		if (!ticketId && tickets.length) {
			navigate(PATH.TICKET.CHATS.DETAIL.ROOT(tickets[0].id), { replace: true });
		}
	}, [ticketId, tickets, navigate]);

	return (
		<Box display="flex" flexDirection="column" height="100%" overflow="hidden">
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
					{ title: t("menus.ticket.chats") },
				]}
			/>

			{data?.data?.data?.length === 0 && !isFetching ? (
				<EmptyRoute
					title="No Tickets Available"
					message={t("messages.empty_states.tickets.description")}
				/>
			) : (
				<div className="flex gap-4 flex-1 overflow-hidden">
					<Box className={`fixed lg:static z-[99999] lg:z-0 right-0 top-0 bottom-0 p-4 lg:p-0 w-full lg:w-auto overflow-hidden min-w-[350px] ${open ? 'transition-all duration-300 ease-in-out' : 'opacity-0 invisible translate-x-[100%] lg:opacity-100 lg:visible lg:translate-x-0'}`} sx={{
						backgroundColor: theme => theme.palette.mode === "light" ? theme.palette.primary.contrastText : theme.palette.background.sidebar,
					}}>
						<div className="all__message__wrapper lg:min-w-[350px]  2xl:max-w-[450px] ml-auto lg:ml-0 h-full overflow-hidden flex flex-col">
							<OutlinedInput
								fullWidth
								placeholder="Search"
								name="search"
								id="search"
								startAdornment={<SearchNormal />}
								value={search}
								onChange={(e) => setSearch?.(e.target.value)}
								sx={{
									gap: "8px",
									mb: 1,
								}}
							/>
							<TabController
								currentActive={statusTab}
								setActiveTab={setStatusTab}
								options={STATUS_TABS}
								size="sm"
							/>
							<div className="message__list h-full overflow-auto pr-1 mt-3">
								{data?.data?.data.map((ticket) => (
									<MessageCard
										key={ticket.id}
										ticket={ticket}
										onClick={() => { navigate(PATH.TICKET.CHATS.DETAIL.ROOT(ticket.id)); setOpen(false); }}
										active={selectedTicket?.id === ticket.id} />
								))}
							</div>
						</div>
					</Box>
					{selectedTicket && <div className="single__message__wrapper w-full h-full overflow-hidden">
						<TicketChatPanel
							ticket={selectedTicket}
							readOnly
							onTicketUpdated={() => {
								refetch();
							}}
							setOpen={setOpen}
						/>
					</div>}

					{openForm && (
						<TicketForm
							open={openForm}
							onClose={() => setOpenForm(false)}
							onSuccess={() => {
								setOpenForm(false);
								refetch();
							}}
						/>
					)}
				</div>
			)}
		</Box>
	);
}
