import { useEffect, useRef } from "react";
import { getEcho } from "../lib/echo";
import type { TicketReplyProps, TicketStatus } from "../types/ticket";

export interface TicketSocketCallbacks {
	onNewReply?: (ticketId: number, reply: TicketReplyProps) => void;
	onStatusChange?: (ticketId: number, status: TicketStatus) => void;
}

interface UseTicketSocketOptions {
	ticketId: number | null;
	callbacks: TicketSocketCallbacks;
}

export function useTicketSocket({ ticketId, callbacks }: UseTicketSocketOptions) {
	const callbacksRef = useRef(callbacks);

	useEffect(() => {
		callbacksRef.current = callbacks;
	}, [callbacks]);

	useEffect(() => {
		if (!ticketId) return;

		let echo: ReturnType<typeof getEcho>;
		try {
			echo = getEcho();
		} catch (err) {
			console.error("[useTicketSocket]", err);
			return;
		}

		const channel = echo.private(`ticket.${ticketId}`);

		channel.subscribed(() => {
			console.log(`[Socket] ✅ Subscribed to ticket.${ticketId}`);
		});
		channel.error((err: any) => {
			console.error(`[Socket] ❌ Channel error on ticket.${ticketId}:`, err);
		});

		channel
			.listen(".NewTicketReply", (data: TicketReplyProps) => {
				console.log("Received new reply via socket:", data);
				callbacksRef.current.onNewReply?.(data.ticket_id, data);
			})
			.listen(".TicketStatusChanged", (data: { ticket_id: number; status: TicketStatus }) => {
				console.log("Received status change via socket:", data);
				callbacksRef.current.onStatusChange?.(data.ticket_id, data.status);
			});

		return () => {
			echo.leave(`ticket.${ticketId}`);
		};
	}, [ticketId]);
}