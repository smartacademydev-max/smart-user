import AttachFileIcon from "@mui/icons-material/AttachFile";
import LockIcon from "@mui/icons-material/Lock";
import SendIcon from "@mui/icons-material/Send";
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	Divider,
	IconButton,
	InputAdornment,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import { format } from "date-fns";
import { ArrowDown2, Clock, InfoCircle, People, TickCircle } from "iconsax-reactjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTicketSocket } from "../../../../hooks/useTicketSocket";
import CAN from "../../../../routes/CAN";
import {
	useCreateTicketReplyMutation,
	useGetAllTicketsQuery,
	useGetTicketRepliesQuery,
	useMarkRepliesAsReadMutation,
	useUpdateTicketMutation,
} from "../../../../services/ticketApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { TicketPriority, TicketProps, TicketReplyProps, TicketStatus } from "../../../../types/ticket";
import { TICKET_PRIORITY_OPTIONS, TICKET_STATUS_OPTIONS } from "../../../../types/ticket";
import AssignedUsers from "../../../organism/ListWithPlusMore";

interface Props {
	ticket?: TicketProps;
	onTicketUpdated?: () => void;
	readOnly?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const statusColor: Record<TicketStatus, string> = {
	open: "#3B82F6",
	assigned: "#8B5CF6",
	waiting_for_reply: "#F59E0B",
	resolved: "#10B981",
};

const statusIcon: Record<TicketStatus, React.ElementType> = {
	open: InfoCircle,
	assigned: TickCircle,
	waiting_for_reply: Clock,
	resolved: TickCircle,
};

const priorityDot: Record<TicketPriority, { dot: string; text: string }> = {
	low: { dot: "#6B7280", text: "#6B7280" },
	medium: { dot: "#F59E0B", text: "#92400E" },
	high: { dot: "#F97316", text: "#7C2D12" },
	urgent: { dot: "#EF4444", text: "#7F1D1D" },
};

function ReplyBubble({ reply, currentUserId }: { reply: TicketReplyProps; currentUserId?: number }) {
	const theme = useTheme();
	const isOwn = reply.created_by_id === currentUserId;
	const isUnread = !reply.is_read && !isOwn;

	return (
		<Stack
			direction="row"
			width={"100%"}
			justifyContent={isOwn ? "flex-end" : "flex-start"}
			sx={{ mb: 1.5 }}
		>
			{!isOwn && (
				<Avatar sx={{ width: 30, height: 30, fontSize: 12, mr: 1, mt: 0.5 }}>
					{(reply.created_by ?? "?")[0].toUpperCase()}
				</Avatar>
			)}
			<Box>
				{!isOwn && (
					<Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }} >
						{reply.created_by}
					</Typography>
				)}
				<Box
					sx={{
						px: 2,
						py: 1.25,
						borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
						bgcolor: isOwn
							? "#2563EB"
							: isUnread
								? theme.palette.mode === "dark"
									? "rgba(59,130,246,0.18)"
									: "#DBEAFE"
								: theme.palette.mode === "dark"
									? "rgba(255,255,255,0.08)"
									: "#F3F4F6",
						color: isOwn ? "#fff" : theme.palette.text.primary,
						border: isUnread && !isOwn ? "1px solid #93C5FD" : "none",
					}}
				>
					<Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
						{reply.body}
					</Typography>
					{reply.attachment_url && (
						<Box
							component="img"
							src={reply.attachment_url}
							alt="attachment"
							sx={{
								mt: 1,
								maxWidth: "100%",
								maxHeight: 220,
								borderRadius: 1,
								display: "block",
								cursor: "pointer",
								objectFit: "contain",
							}}
							onClick={() => window.open(reply.attachment_url!, "_blank")}
						/>
					)}
				</Box>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: "block", mt: 0.25, textAlign: isOwn ? "right" : "left", ml: 0.5 }}
				>
					{reply.created_at
						? format(new Date(reply.created_at), "MMM d, h:mm a")
						: ""}
				</Typography>
			</Box>
		</Stack>
	);
}

export default function TicketChatPanel({ ticket: propTicket, onTicketUpdated: propOnTicketUpdated, readOnly = false, setOpen }: Props) {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const currentUser = useAppSelector((state) => state.auth.user);
	const bottomRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const initialPageSet = useRef(false);
	const hasScrolledInitially = useRef(false);
	const [replyText, setReplyText] = useState("");
	const [attachment, setAttachment] = useState<File | null>(null);
	const [page, setPage] = useState(1);
	const [allReplies, setAllReplies] = useState<TicketReplyProps[]>([]);
	const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(propTicket ?? null);

	const { data: ticketsData, refetch: refetchTickets } = useGetAllTicketsQuery(
		{ pageIndex: 1, pageSize: 20 },
		{ skip: !!propTicket }
	);

	const ticket = propTicket ?? selectedTicket;

	useEffect(() => {
		if (!propTicket && !selectedTicket && ticketsData?.data?.data?.length) {
			setSelectedTicket(ticketsData.data.data[0]);
		}
	}, [ticketsData, propTicket, selectedTicket]);

	// Default onTicketUpdated handler
	const onTicketUpdated = useCallback(() => {
		propOnTicketUpdated?.();
		if (!propTicket) {
			refetchTickets();
			// Auto-select first ticket after update
			setTimeout(() => {
				refetchTickets();
			}, 300);
		}
	}, [propOnTicketUpdated, propTicket, refetchTickets]);

	const isClosed = ticket?.status === "resolved";

	const { data: repliesData, isFetching } = useGetTicketRepliesQuery(
		{ ticket_id: ticket?.id!, pageIndex: page, pageSize: 20 },
		{ skip: !ticket?.id }
	);

	const [createReply, { isLoading: sending }] = useCreateTicketReplyMutation();
	const [updateTicket] = useUpdateTicketMutation();
	const [markAsRead] = useMarkRepliesAsReadMutation();

	const dedupeReplies = (replies: TicketReplyProps[]) => {
		const seen = new Set<number>();
		return replies.filter((reply) => {
			const replyId = reply.id;
			if (replyId == null) {
				return true;
			}
			if (seen.has(replyId)) return false;
			seen.add(replyId);
			return true;
		});
	};

	useEffect(() => {
		if (ticket?.id && (ticket?.unread_count ?? 0) > 0) {
			markAsRead({ ticket_id: ticket.id });
		}
	}, [ticket?.id, ticket?.unread_count, markAsRead]);

	// Scroll to bottom once the initial (newest) messages are rendered
	useEffect(() => {
		if (allReplies.length > 0 && !hasScrolledInitially.current) {
			hasScrolledInitially.current = true;
			setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "instant" }), 50);
		}
	}, [allReplies]);

	useEffect(() => {
		initialPageSet.current = false;
		hasScrolledInitially.current = false;
		setAllReplies([]);
		setPage(1);
		setReplyText("");
		setAttachment(null);
	}, [ticket?.id]);

	useEffect(() => {
		const incoming = repliesData?.data?.data;
		const pagination = repliesData?.data?.pagination;
		if (!incoming) return;

		if (!initialPageSet.current) {
			const totalPages = Math.ceil((pagination?.total ?? 0) / 20);
			initialPageSet.current = true;
			if (totalPages > 1) {
				setPage(totalPages);
				return;
			}
			// Only one page, render directly
			setAllReplies(dedupeReplies(incoming));
			return;
		}

		// Loading older pages (jumped to last page, or user clicked "Load earlier messages")
		setAllReplies((prev) => dedupeReplies([...incoming, ...prev]));
	}, [repliesData]);

	useTicketSocket({
		ticketId: ticket?.id ?? null,
		callbacks: {
			onNewReply: useCallback((ticketId: number, reply: TicketReplyProps) => {
				if (ticketId === ticket?.id) {
					setAllReplies((prev) => {
						if (prev.some((item) => item.id === reply.id)) return prev;
						return [...prev, reply];
					});
					setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
				}
			}, [ticket?.id]),
			onStatusChange: useCallback((ticketId: number) => {
				if (ticketId === ticket?.id) {
					onTicketUpdated();
				}
			}, [ticket?.id, onTicketUpdated]),
		},
	});

	const hasMore = page > 1;

	const handleSend = async () => {
		if (!replyText.trim() || !ticket?.id || isClosed) return;
		try {
			await createReply({
				ticket_id: ticket.id,
				body: replyText.trim(),
				...(attachment ? { attachment } : {}),
			}).unwrap();
			setReplyText("");
			setAttachment(null);
		} catch (e: any) {
			dispatch(
				showToast({
					message: e?.data?.message || t("messages.ticket.save_error"),
					severity: "error",
				})
			);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleStatusChange = async (status: TicketStatus) => {
		if (!ticket?.id) return;
		await updateTicket({ id: ticket.id, body: { status } }).unwrap();
		onTicketUpdated();
	};

	const handlePriorityChange = async (priority: string) => {
		if (!ticket?.id) return;
		await updateTicket({ id: ticket.id, body: { priority } }).unwrap();
		onTicketUpdated();
	};

	if (!ticket) {
		return (
			<Box
				display="flex"
				flexDirection="column"
				height="100%"
				width="100%"
				justifyContent="center"
				alignItems="center"
			>
				<CircularProgress />
				<Typography variant="body2" color="text.secondary" mt={2}>
					{t("messages.loading")}
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			display="flex"
			flexDirection="column"
			height="100%"
			width="100%"
		>
			<Box
				sx={{
					px: 2.5,
					py: 1.75,
					borderBottom: `1px solid ${theme.palette.divider}`,
					flexShrink: 0,
				}}
			>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
					<Box>
						<Stack direction="row" alignItems="center" spacing={1}>
							<Typography variant="h6" fontWeight={600}>
								{ticket.subject}
							</Typography>
							{ticket.ticket_number && (
								<Typography variant="caption" color="text.secondary">
									#{ticket.ticket_number}
								</Typography>
							)}
						</Stack>
						<Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
							{ticket.type_name && (
								<Chip label={ticket.type_name} size="small" variant="outlined" />
							)}
							{ticket.assigned_to && (
								<AssignedUsers
									users={ticket.assigned_to || []}
									maxVisible={3}
								/>
							)}
						</Stack>
					</Box>

					<Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
						{/* Static status badge — always visible */}
						{(() => {
							const st = (ticket.status ?? "open") as TicketStatus;
							const SIcon = statusIcon[st];
							return (
								<Stack direction="row" alignItems="center" spacing={0.75}
									sx={{
										px: 1.25,
										py: 0.4,
										borderRadius: 2,
										border: `1px solid ${statusColor[st]}22`,
										bgcolor: `${statusColor[st]}14`,
									}}
								>
									<SIcon size={14} color={statusColor[st]} variant="Bold" />
									<Typography sx={{ fontSize: 12, color: statusColor[st], fontWeight: 600 }}>
										{TICKET_STATUS_OPTIONS.find((o) => o.value === st)?.label ?? st}
									</Typography>
								</Stack>
							);
						})()}

						{/* Editable controls — admin only, hidden in readOnly mode */}
						{!readOnly && (
							<CAN permissions={["edit_tickets"]}>
								{(() => {
									const st = (ticket.status ?? "open") as TicketStatus;
									const SIcon = statusIcon[st];
									return (
										<Select
											variant="standard"
											disableUnderline
											value={st}
											onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
											IconComponent={({ className }) => (
												<Box component="span" className={className} sx={{ display: "flex", alignItems: "center", right: 0 }}>
													<ArrowDown2 size={16} color={statusColor[st]} />
												</Box>
											)}
											renderValue={() => (
												<Stack direction="row" alignItems="center" spacing={0.75}>
													<SIcon size={16} color={statusColor[st]} variant="Bold" />
													<Typography sx={{ fontSize: 13, color: statusColor[st], fontWeight: 600 }}>
														{TICKET_STATUS_OPTIONS.find((o) => o.value === st)?.label ?? st}
													</Typography>
												</Stack>
											)}
											sx={{
												"& .MuiSelect-select": { py: 0, pl: 0, pr: "28px !important" },
												"&:before, &:after": { display: "none" },
											}}
										>
											{TICKET_STATUS_OPTIONS.map((opt) => (
												<MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
													<Stack direction="row" alignItems="center" spacing={1}>
														<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: statusColor[opt.value] }} />
														{opt.label}
													</Stack>
												</MenuItem>
											))}
										</Select>
									);
								})()}

								{(() => {
									const pr = (ticket.priority ?? "medium") as TicketPriority;
									const pCfg = priorityDot[pr] ?? priorityDot.medium;
									return (
										<Select
											variant="standard"
											disableUnderline
											value={pr}
											onChange={(e) => handlePriorityChange(e.target.value)}
											IconComponent={({ className }) => (
												<Box component="span" className={className} sx={{ display: "flex", alignItems: "center", right: 0 }}>
													<ArrowDown2 size={16} color={pCfg.dot} />
												</Box>
											)}
											renderValue={() => (
												<Stack direction="row" alignItems="center" spacing={0.75}>
													<Box sx={{ width: 12, height: 12, borderRadius: "2px", bgcolor: pCfg.dot, flexShrink: 0 }} />
													<Typography sx={{ fontSize: 13, color: pCfg.text, fontWeight: 600, textTransform: "capitalize" }}>
														{pr}
													</Typography>
												</Stack>
											)}
											sx={{
												"& .MuiSelect-select": { py: 0, pl: 0, pr: "28px !important" },
												"&:before, &:after": { display: "none" },
											}}
										>
											{TICKET_PRIORITY_OPTIONS.map((opt) => (
												<MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
													<Stack direction="row" alignItems="center" spacing={1}>
														<Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: priorityDot[opt.value as TicketPriority]?.dot ?? "#6B7280" }} />
														{opt.label}
													</Stack>
												</MenuItem>
											))}
										</Select>
									);
								})()}
							</CAN>
						)}
					</Stack>
				</Stack>
			</Box>

			<Box
				flex={1}
				overflow="auto"
				sx={{
					px: 2.5,
					pt: 2,
					pb: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				{hasMore && (
					<Box textAlign="center" mb={1}>
						<Typography
							variant="caption"
							color="primary"
							sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
							onClick={() => setPage((p) => p - 1)}
						>
							{isFetching ? <CircularProgress size={14} /> : "Load earlier messages"}
						</Typography>
					</Box>
				)}

				<Box
					sx={{
						mb: 2,
						p: 2,
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
					}}
				>
					<Stack direction="row" spacing={1} mb={1} alignItems="center">
						<Avatar sx={{ width: 26, height: 26, fontSize: 11 }}>
							{(ticket.created_by ?? "?")[0].toUpperCase()}
						</Avatar>
						<Typography variant="caption" fontWeight={600}>
							{ticket.created_by}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{ticket.created_at
								? format(new Date(ticket.created_at), "MMM d, yyyy h:mm a")
								: ""}
						</Typography>
					</Stack>
					<Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
						{ticket.description}
					</Typography>
				</Box>

				{allReplies.length > 0 && (
					<Divider sx={{ mb: 2 }}>
						<Typography variant="caption" color="text.secondary">
							Replies
						</Typography>
					</Divider>
				)}

				{allReplies.map((reply) => (
					<ReplyBubble
						key={reply.id}
						reply={reply}
						currentUserId={Number(currentUser?.id)}
					/>
				))}

				{allReplies.length === 0 && !isFetching && (
					<Box textAlign="center" mt="auto" mb={2}>
						<Typography variant="body2" color="text.secondary">
							{t("messages.empty_states.ticket_replies.description")}
						</Typography>
					</Box>
				)}

				<div ref={bottomRef} />
			</Box>
			<div className="flex items-center gap-1">
				<Box
					sx={{
						// px: 2.5,
						width: "100%",
						py: 1.5,
						borderTop: `1px solid ${theme.palette.divider}`,

					}}
				>
					{isClosed ? (
						<Stack direction="row" spacing={1} alignItems="center" justifyContent="center" py={1}>
							<LockIcon sx={{ fontSize: 16, color: "text.secondary" }} />
							<Typography variant="body2" color="text.secondary">
								{t("messages.ticket.closed_no_reply")}
							</Typography>
						</Stack>
					) : (
						<>
							{attachment && (
								<Stack direction="row" alignItems="center" spacing={1} mb={1}>
									<Chip
										label={attachment.name}
										size="small"
										onDelete={() => setAttachment(null)}
									/>
								</Stack>
							)}
							<OutlinedInput
								fullWidth
								multiline
								minRows={1}
								maxRows={4}
								placeholder={t("messages.ticket.reply_placeholder")}
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								onKeyDown={handleKeyDown}
								disabled={sending}
								sx={{ borderRadius: 3, pr: 1 }}
								endAdornment={
									<InputAdornment position="end">
										<Stack direction="row" spacing={0.5}>
											{ticket.allow_attachment && (
												<>
													<input
														ref={fileInputRef}
														type="file"
														hidden
														accept="image/*,.pdf,.doc,.docx"
														onChange={(e) => {
															const f = e.target.files?.[0];
															if (f && f.size <= 2 * 1024 * 1024) {
																setAttachment(f);
															}
															e.target.value = "";
														}}
													/>
													<Tooltip title="Attach file (max 2MB)">
														<IconButton
															size="small"
															onClick={() => fileInputRef.current?.click()}
														>
															<AttachFileIcon fontSize="small" />
														</IconButton>
													</Tooltip>
												</>
											)}
											<IconButton
												size="small"
												disabled={!replyText.trim() || sending}
												onClick={handleSend}
												sx={{
													width: 32,
													height: 32,
													backgroundColor: (theme) => theme.palette.primary.main,
													color: (theme) => theme.palette.primary.contrastText
												}}
											>
												{sending ? (
													<CircularProgress size={18} />
												) : (
													<SendIcon fontSize="small" />
												)}
											</IconButton>
										</Stack>
									</InputAdornment>
								}
							/>
						</>
					)}
				</Box>
				<div className="lg:hidden">
					<IconButton sx={{
						bgcolor: (theme) => theme.palette.primary.main,
						color: (theme) => theme.palette.primary.contrastText
					}}
						onClick={() => setOpen?.((prev) => !prev)}
					>
						<People />
					</IconButton>
				</div>
			</div>
			{isClosed ? <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
				Press Enter to send · Shift+Enter for new line
			</Typography> : ""}
		</Box>
	);
}
