import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import type { TicketProps } from "../../../../types/ticket";
import { getTicketStatus } from "../../../../utils/statusMap";

interface MessageCardProps {
    ticket: TicketProps;
    onClick?: () => void;
    active?: boolean;
}

export default function MessageCard({ ticket, onClick, active = false }: MessageCardProps) {
    const initials = (ticket.created_by ?? "?")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const priorityLabel = ticket.priority ? `${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority` : "";
    const departmentLabel = ticket.type_name ? ticket.type_name : "General";
    const previewText = ticket.description ? ticket.description : ticket.subject ?? "";

    return (
        <Box
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.75,
                bgcolor: active ? "primary.light" : "background.paper",
                borderRadius: "14px",
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                transition: "box-shadow 0.18s ease, transform 0.18s ease",
                "&:hover": {
                    boxShadow: "0 4px 16px rgba(29,130,245,0.10)",
                    transform: "translateY(-1px)",
                },
                mb: 1,
            }}
        >
            <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "primary.light",
                        color: "primary.main",
                        fontSize: 13,
                        fontWeight: 400,
                    }}
                >
                    {initials}
                </Avatar>
                {ticket.status === "open" && (
                    <Box
                        sx={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            bgcolor: "success.main",
                            border: "2px solid",
                            borderColor: "background.paper",
                            position: "absolute",
                            bottom: 1,
                            right: 1,
                        }}
                    />
                )}
            </Box>

            <Box flex={1} minWidth={0}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.25}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={500}
                        color="text.dark"
                        noWrap
                        className="capitalize"
                    >
                        {ticket.created_by}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.middle"

                    >
                        {ticket.created_at
                            ? format(new Date(ticket.created_at), "h:mm a")
                            : ""}
                    </Typography>
                </Stack>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                    {previewText}
                </Typography>

                <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center" mb={0.5}>
                    {ticket.status && (
                        <Chip
                            size="small"
                            label={ticket.status.replace(/_/g, " ")}
                            color={getTicketStatus(ticket.status)}
                            variant="outlined"
                            sx={{ height: 20, fontSize: 11 }}
                        />
                    )}
                    {priorityLabel && (
                        <Chip label={priorityLabel} size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
                    )}
                    {departmentLabel && (
                        <Chip label={departmentLabel} size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
                    )}
                    {(ticket.unread_count ?? 0) > 0 && (
                        <Box
                            sx={{
                                bgcolor: "primary.main",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                minWidth: 20,
                                height: 20,
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                px: 0.75,
                                flexShrink: 0,
                            }}
                        >
                            {ticket.unread_count}
                        </Box>
                    )}
                </Stack>
            </Box>
        </Box>
    );
}