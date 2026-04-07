import { Avatar, Box, Chip, Popover, Stack, Typography } from "@mui/material";
import { useState } from "react";
import type { User } from "../../types/user";


type AssignedUsersProps = {
    users: User[];
    variant?: "compact" | "full";
    onRemove?: (id: User["id"]) => void;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    maxVisible?: number;
};

export default function AssignedUsers({
    users,
    variant = "compact",
    onRemove,
    onClick,
    maxVisible = 1,
}: AssignedUsersProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    if (!users?.length) return null;

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);

    if (variant === "full") {
        return (
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {users.map((user) => (
                    <Chip
                        key={user.id}
                        avatar={
                            <Avatar sx={{ width: 20, height: 20, fontSize: 9, bgcolor: "#8B5CF6" }}>
                                {user.name?.[0]?.toUpperCase()}
                            </Avatar>
                        }
                        label={user.name}
                        size="small"
                        variant="outlined"
                        onDelete={onRemove ? () => onRemove(user.id) : undefined}
                        onClick={onClick}
                        sx={{ fontSize: 12, cursor: "pointer" }}
                    />
                ))}
            </Stack>
        );
    }

    const visibleUsers = users.slice(0, maxVisible);
    const remainingUsers = users.slice(maxVisible);

    return (
        <>
            <Stack direction="row" spacing={0.5} alignItems="center">
                {visibleUsers.map((user) => (
                    <Chip
                        key={user.id}
                        avatar={
                            <Avatar sx={{ width: 16, height: 16, fontSize: 8, bgcolor: "#8B5CF6" }}>
                                {user.name?.[0]?.toUpperCase()}
                            </Avatar>
                        }
                        label={user.name}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 10, height: 18 }}
                        onClick={onClick}
                    />
                ))}

                {remainingUsers.length > 0 && (
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: 10,
                            color: "text.secondary",
                            cursor: "pointer",
                        }}
                        onClick={handleOpen}
                    >
                        +{remainingUsers.length} more
                    </Typography>
                )}
            </Stack>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Box sx={{ p: 1.5, minWidth: 180 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Assigned Users
                    </Typography>

                    <Stack spacing={0.75}>
                        {remainingUsers.map((user) => (
                            <Stack
                                key={user.id}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    px: 0.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        fontSize: 10,
                                        bgcolor: "#8B5CF6",
                                    }}
                                >
                                    {user.name?.[0]?.toUpperCase()}
                                </Avatar>

                                <Typography variant="body2">
                                    {user.name}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            </Popover>
        </>
    );
}