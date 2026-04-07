import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { Box, Skeleton } from "@mui/material";
import type { TicketAnalytics } from "../../../../types/ticket";
import DashboardAnalyticsCard from "../../../organism/Cards/DashboardAnalyticsCard";

interface Props {
	analytics?: TicketAnalytics;
	isLoading: boolean;
}

export default function TicketAnalyticsBar({ analytics, isLoading }: Props) {
	const cards = [
		{
			icon: <ConfirmationNumberOutlinedIcon sx={{ fontSize: 28, color: "#3B82F6" }} />,
			title: "Total Tickets",
			description: "All time",
			value: analytics?.total?.toString() ?? "0",
			type: "info" as const,
		},
		{
			icon: <ErrorOutlineIcon sx={{ fontSize: 28, color: "#F59E0B" }} />,
			title: "Open Tickets",
			description: "Awaiting action",
			value: analytics?.open?.toString() ?? "0",
			type: "warning" as const,
		},
		{
			icon: <PendingActionsIcon sx={{ fontSize: 28, color: "#8B5CF6" }} />,
			title: "Active Tickets",
			description: "Assigned or waiting",
			value: analytics?.active?.toString() ?? "0",
			type: "info" as const,
		},
		{
			icon: <CheckCircleOutlineIcon sx={{ fontSize: 28, color: "#10B981" }} />,
			title: "Resolved Tickets",
			description: "Successfully closed",
			value: analytics?.resolved?.toString() ?? "0",
			type: "success" as const,
		},
	];

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: 2,
					mt: 2,
					mb: 1,
				}}
			>
				{[1, 2, 3, 4].map((i) => (
					<Skeleton key={i} variant="rounded" height={100} />
				))}
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
				gap: 2,
				mt: 2,
				mb: 1,
				px: 1,
			}}
		>
			{cards.map((card, index) => (
				<DashboardAnalyticsCard
					key={card.title}
					index={index}
					data={{
						title: card.title,
						value: card.value,
						description: card.description,
						type: card.type,
						icon: card.icon
					}}
				/>
			))}
		</Box>
	);
}
