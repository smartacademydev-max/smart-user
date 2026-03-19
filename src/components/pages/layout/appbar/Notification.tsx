import {
    Badge,
    Box,
    Button,
    CircularProgress,
    ClickAwayListener,
    Divider,
    Grow,
    List,
    Paper,
    Popper,
    Typography,
    useTheme,
} from "@mui/material";
import { Notification } from "iconsax-reactjs";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetAllNotificationsQuery, useReadNotificationMutation } from "../../../../services/notificationApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { NotificationProps } from "../../../../types/notification";
import NotificationCard from "../../../organism/Cards/NotificationCard";

export default function NotificationModal() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    const [items, setItems] = useState<NotificationProps[]>([]);

    const handleToggle = () => setOpen((prev) => !prev);

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current?.contains(event.target as HTMLElement)) return;
        setOpen(false);
    };

    const { data, isLoading } = useGetAllNotificationsQuery(qp);
    const [readNotification] = useReadNotificationMutation();

    const notifications = data?.data?.data ?? [];
    const pagination = data?.data?.pagination;

    useEffect(() => {
        if (qp.pageIndex === 1) {
            setItems(notifications);
        } else {
            setItems((prev) => [...prev, ...notifications]);
        }
    }, [data, qp.pageIndex]);

    const fetchMore = () => {
        if (!pagination) return;
        if (qp.pageIndex < pagination.total_pages) {
            setQp((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
            }));
        }
    };

    const hasMore =
        pagination ? qp.pageIndex < pagination.total_pages : false;

    const hasUnread =
        notifications.some((n) => !n.has_seen);

    const handleReadAllNotifications = async () => {
        try {
            await readNotification({}).unwrap();
        }
        catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Something went wrong",
                    severity: "error",
                }));
        }
    }
    return (
        <>
            <Badge
                color="error"
                variant="dot"
                overlap="circular"
                invisible={!hasUnread}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Box
                    ref={anchorRef}
                    onClick={handleToggle}
                    sx={{
                        background: theme.palette.separator.dark,
                        minWidth: { xs: 36, lg: 44 },
                        height: { xs: 36, lg: 44 },
                        aspectRatio: "1/1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRadius: "50%",
                        "&:hover": { backgroundColor: theme.palette.action.hover },
                    }}
                >
                    <Notification
                        variant="Bold"
                        color={theme.palette.separator.darkest}
                    />
                </Box>
            </Badge>


            {/* Popper */}
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                transition
                placement="bottom-end"
                disablePortal
                sx={{ zIndex: 10 }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper elevation={3}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box className="p-4 md:w-[520px]">
                                    {/* Header */}
                                    <Box className="flex items-center justify-between">
                                        <Typography variant="h5" fontWeight={600}>
                                            Notifications
                                        </Typography>
                                        <Button variant="text" onClick={handleReadAllNotifications}>
                                            <Typography variant="subtitle2"> Mark all as read</Typography>
                                        </Button>
                                    </Box>

                                    <Divider className="lg:mt-4!" />

                                    {/* Scrollable Area */}
                                    <Box
                                        id="notification-scroll"
                                        sx={{
                                            maxHeight: 510,
                                            overflow: "auto",
                                        }}
                                    >
                                        {isLoading && items.length === 0 ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    py: 4,
                                                }}
                                            >
                                                <CircularProgress size={24} />
                                            </Box>
                                        ) : (
                                            <InfiniteScroll
                                                dataLength={items.length}
                                                next={fetchMore}
                                                hasMore={hasMore}
                                                scrollableTarget="notification-scroll"
                                                loader={
                                                    <Box
                                                        sx={{
                                                            textAlign: "center",
                                                            py: 2,
                                                        }}
                                                    >
                                                        <CircularProgress size={20} />
                                                    </Box>
                                                }
                                            >
                                                <List disablePadding>
                                                    {items.length === 0 ? (
                                                        <Box
                                                            sx={{
                                                                py: 4,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                No notifications available
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        items.map((notification) => (
                                                            <NotificationCard
                                                                key={notification.id}
                                                                data={notification}
                                                            />
                                                        ))
                                                    )}
                                                </List>
                                            </InfiniteScroll>
                                        )}
                                    </Box>
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}
