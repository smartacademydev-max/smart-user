import {
	Avatar,
	Badge,
	Box,
	Checkbox,
	Chip,
	Divider,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import {
	Calendar,
	Timer1,
} from "iconsax-reactjs";
import { useState } from "react";
import { useDeleteTicketMutation } from "../../../../services/ticketApi";
import type { TicketPriority, TicketProps } from "../../../../types/ticket";
import { TICKET_PRIORITY_OPTIONS, TICKET_STATUS_OPTIONS } from "../../../../types/ticket";
import { getTicketPriority, getTicketStatus } from "../../../../utils/statusMap";
import StatusPill from "../../../atom/StatusPill";
import Actions from "../../../molecules/Action";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import AssignedUsers from "../../../organism/ListWithPlusMore";

interface Props {
	ticket: TicketProps;
	checked: boolean;
	onSelect: (id: number, checked: boolean) => void;
	onDelete?: (id: number) => void;
	onClick: () => void;
}

function getInitials(name?: string) {
	if (!name) return "?";
	return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function formatShort(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	if (days < 30) return `${days}d ago`;
	return `${Math.floor(days / 30)}mo ago`;
}

export default function TicketCard({ ticket, checked, onSelect, onDelete, onClick }: Props) {
	const theme = useTheme();
	const status = ticket.status ?? "open";
	const priority = (ticket.priority ?? "medium") as TicketPriority;
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [deleteTicket, { isLoading: deleting }] = useDeleteTicketMutation();

	const hasUnread = (ticket.unread_count ?? 0) > 0;
	const metaIconSize = 20;
	const metaFontSize = 12;

	const handleDelete = async () => {
		await deleteTicket({ ids: [ticket.id!] }).unwrap().catch(() => { });
		setConfirmDelete(false);
		onDelete?.(ticket.id!);
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				px: 2.5,
				py: 2,
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: 2,
				mb: 1,
				gap: 2,
				bgcolor: theme.palette.background.paper,
				transition: "box-shadow 0.15s",
				"&:hover": { boxShadow: 2 },
			}}
			
		>
			<Checkbox
				size="small"
				checked={checked}
				onChange={(e) => onSelect(ticket.id!, e.target.checked)}
				onClick={(e) => e.stopPropagation()}
				sx={{ flexShrink: 0 }}
			/>

			<Avatar
				sx={{
					width: 42,
					height: 42,
					fontSize: 14,
					fontWeight: 600,
					bgcolor: "#3B82F6",
					flexShrink: 0,
					cursor: "pointer",
				}}
				onClick={onClick}
			>
				{getInitials(ticket.created_by)}
			</Avatar>

			<Box flex={1} minWidth={0} sx={{ cursor: "pointer" }} onClick={onClick}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Typography variant="body2" fontWeight={700} noWrap>
						{ticket.subject}
					</Typography>
					{ticket.ticket_number && (
						<Typography variant="caption" color="text.secondary" flexShrink={0}>
							#{ticket.ticket_number}
						</Typography>
					)}
					{hasUnread && (
						<Badge badgeContent={ticket.unread_count} color="primary" sx={{ flexShrink: 0, ml: 1 }} />
					)}
				</Stack>
				<Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ mt: 0.25 }}>
					{ticket.last_reply?.body ?? ticket.description}
				</Typography>
				<Stack direction="row" spacing={0.75} mt={0.75} alignItems="center">
					<Typography className="capitalize!" variant="caption" sx={{ color: "primary.main", fontWeight: 500 }}>
						{ticket.created_by}
					</Typography>
					{ticket.type_name && (
						<Chip label={ticket.type_name} size="small" variant="outlined" sx={{ height: 18, fontSize: 10, fontWeight: 400 }} />
					)}
				</Stack>
			</Box>

			<Stack
				direction="row"
				alignItems="center"
				spacing={1.5}
				flexShrink={0}
				divider={<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />}
			>
				{/* Status */}
				<StatusPill
					status={TICKET_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}
					variant={getTicketStatus(status)}
				/>

				{/* Priority */}
				<StatusPill
					status={TICKET_PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ?? priority}
					variant={getTicketPriority(priority)}
				/>

				{/* Updated at */}
				{ticket.updated_at && (
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<Timer1 size={metaIconSize} color="#9CA3AF" variant="Bold" />
						<Typography sx={{ fontSize: metaFontSize, color: "text.secondary" }}>
							{formatShort(ticket.updated_at)}
						</Typography>
					</Stack>
				)}

				{/* Created at */}
				{ticket.created_at && (
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<Calendar size={metaIconSize} color="#9CA3AF" variant="Bold" />
						<Typography sx={{ fontSize: metaFontSize, color: "text.secondary" }}>
							{formatShort(ticket.created_at)}
						</Typography>
					</Stack>
				)}
			</Stack>

			{ticket.assigned_to && (
				<AssignedUsers
					users={ticket.assigned_to || []}
					maxVisible={1}
				/>
			)}

			<Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0 }}>
				<Actions onDelete={() => setConfirmDelete(true)} />
			</Box>

			<ConfirmationDialog
				open={confirmDelete}
				setOpen={setConfirmDelete}
				title="Delete Ticket"
				description="Are you sure you want to delete this ticket? This action cannot be undone."
				onSave={handleDelete}
				isLoading={deleting}
			/>
		</Box>
	);
}
