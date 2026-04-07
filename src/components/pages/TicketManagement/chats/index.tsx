import { Box } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useGetAllTicketsQuery
} from "../../../../services/ticketApi";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TicketChatPanel from "../allTickets/TicketChatPanel";
import TicketForm from "../TicketForm";


export default function TicketChats() {
	const { t } = useTranslation();
	const [openForm, setOpenForm] = useState(false);

	const { data, refetch, isFetching } = useGetAllTicketsQuery({
		pageIndex: 1,
		pageSize: 3,
	});


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
					<div className="single__message__wrapper w-full overflow-hidden">
						<TicketChatPanel
							readOnly
							onTicketUpdated={() => {
								refetch();
							}}
						/>
					</div>

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
