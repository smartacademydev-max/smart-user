import {
    Box,
    ClickAwayListener,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography,
    useTheme,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { logout } from "../../../../slice/authSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import CustomCollapseIcon from "../../../atom/CustomCollapseIcon";


export default function ProfileMenu() {
    const theme = useTheme();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const handleToggle = () => setOpen((prev) => !prev);

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        setOpen(false);
    };

    const handleMenuClick = (action: () => void) => {
        action();
        setOpen(false);
    };


    const onMyAccount = () => {
        navigate(PATH.SETTINGS.PROFILE.ROOT)
    }

    const onLogout = async () => {
        dispatch(logout())
    }
    return (
        <>
            <Box
                ref={anchorRef}
                onClick={handleToggle}
            >
                <Box className=" hidden lg:flex gap-2 items-center p-2 rounded-md cursor-pointer"
                    sx={{
                        border: `1px solid ${theme.palette.separator.dark}`,
                        minWidth: { lg: "160px" },
                        "&:hover": { backgroundColor: theme.palette.action.hover },
                    }}>
                    {user?.profile_url ? (
                        <img
                            src={user.profile_url}
                            alt={`${user?.name} Profile Picture`}
                            className="user__profile w-7 h-7 rounded-full"
                        />
                    ) : (
                        <Box
                            className="flex items-center w-7 h-7 rounded-full justify-center"
                            sx={{
                                background: theme.palette.separator.dark,
                            }}
                        >
                            <Typography variant="subtitle1" color="text.dark">
                                {user?.name ? user?.name.charAt(0).toUpperCase() : ""}
                            </Typography>
                        </Box>
                    )}

                    <Typography variant="subtitle2" color="text.dark" className="hidden lg:block">
                        {user?.name}
                    </Typography>
                    <CustomCollapseIcon isOpen={open} />
                </Box>
                <IconButton
                    sx={{
                        background: theme.palette.separator.dark,
                        minWidth: { xs: 36, lg: 44 },
                        aspectRatio: "1/1",
                        "&:hover": { backgroundColor: theme.palette.action.hover },
                    }}
                    className="lg:hidden!"
                >
                    {user?.profile_url ? (
                        <img
                            src={user.profile_url}
                            alt={`${user?.name} Profile Picture`}
                            className="user__profile w-7 h-7 rounded-full"
                        />
                    ) : (

                        <Typography variant="subtitle1" color="text.middle" fontWeight={600}>
                            {user?.name ? user?.name.charAt(0).toUpperCase() : ""}
                        </Typography>
                    )}
                </IconButton>
            </Box>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                placement="bottom-end"
                disablePortal
                sx={{ zIndex: 10 }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper elevation={3}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <List className="min-w-[180px] p-2!">
                                    {/* My Account */}
                                    <ListItem className="menu__item action__item">
                                        <ListItemButton
                                            sx={{ m: 0, border: "none" }}
                                            onClick={() => handleMenuClick(onMyAccount)}
                                        >
                                            <ListItemIcon>
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M9.99992 9.99984C12.3011 9.99984 14.1666 8.13436 14.1666 5.83317C14.1666 3.53198 12.3011 1.6665 9.99992 1.6665C7.69873 1.6665 5.83325 3.53198 5.83325 5.83317C5.83325 8.13436 7.69873 9.99984 9.99992 9.99984Z"
                                                        stroke="#9CA3B0"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M2.84155 18.3333C2.84155 15.1083 6.04991 12.5 9.99991 12.5C13.9499 12.5 17.1582 15.1083 17.1582 18.3333"
                                                        stroke="#9CA3B0"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </ListItemIcon>
                                            <ListItemText primary="My Account" />
                                        </ListItemButton>
                                    </ListItem>

                                    {/* Logout */}
                                    <ListItem className="menu__item action__item delete__item">
                                        <ListItemButton
                                            sx={{ m: 0, border: "none" }}
                                            onClick={() => handleMenuClick(onLogout)}
                                        >
                                            <ListItemIcon>
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12.5 3.33334H6.66667C5.74619 3.33334 5 4.07953 5 5.00001V15C5 15.9205 5.74619 16.6667 6.66667 16.6667H12.5"
                                                        stroke="#9CA3B0"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M15.8333 10H8.33334"
                                                        stroke="#848484"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M13.3333 7.5L15.8333 10L13.3333 12.5"
                                                        stroke="#848484"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </ListItemIcon>
                                            <ListItemText primary="Logout" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}
