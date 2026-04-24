import {
    Box,
    ClickAwayListener,
    Grow,
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
import { useTranslation } from "react-i18next";
import { setLanguage, setMode, ThemeMode } from "../../../../slice/themeSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";

// Iconsax imports
import {
    BucketCircle,
    Setting2,
    Sun1,
    Translate
} from "iconsax-reactjs";

export default function SettingMenu() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { i18n } = useTranslation();
    const { mode, lang } = useAppSelector((state) => state.smart_theme);

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const handleToggle = () => setOpen((prev) => !prev);

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;
        setOpen(false);
    };

    const handleMenuClick = (action: () => void) => {
        action();
        setOpen(false);
    };

    const handleThemeSwitch = () => {
        dispatch(setMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK));
    };

    const handleLanguageSwitch = () => {
        const newLang = i18n.language === "en" ? "np" : "en";
        dispatch(setLanguage(newLang));
        i18n.changeLanguage(newLang);
    };


    return (
        <>
            {/* Settings Button */}
            <Box
                ref={anchorRef}
                onClick={handleToggle}
                sx={{
                    background: theme.palette.separator.dark,
                    minWidth: { xs: 34, lg: 36 },
                    height: { xs: 34, lg: 36 },
                    aspectRatio: "1/1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "50%",
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
            >
                <Setting2 size={18} variant="Bold" color={theme.palette.separator.darkest} />
            </Box>

            {/* Popper */}
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
                                    {/* Theme Toggle */}
                                    <ListItem className="menu__item action__item">
                                        <ListItemButton
                                            sx={{ m: 0, border: "none" }}
                                            onClick={() => handleMenuClick(handleThemeSwitch)}
                                        >
                                            <ListItemIcon>
                                                {mode === ThemeMode.DARK ? (
                                                    <Sun1 size={20} color="currentColor" />
                                                ) : (
                                                    <BucketCircle size={20} color="currentColor" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2">
                                                        {mode === ThemeMode.DARK ? "Light Mode" : "Dark Mode"}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>

                                    {/* Language Switch */}
                                    <ListItem className="menu__item action__item">
                                        <ListItemButton
                                            sx={{ m: 0, border: "none" }}
                                            onClick={() => handleMenuClick(handleLanguageSwitch)}
                                        >
                                            <ListItemIcon>
                                                <Translate size={20} color="currentColor" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2">
                                                        {lang === "en" ? "नेपाली (Nepali)" : "English"}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>

                                    {/* Settings Redirect */}
                                    {/* <ListItem className="menu__item action__item">
                                        <ListItemButton
                                            sx={{ m: 0, border: "none" }}
                                            onClick={() => handleMenuClick(handleSettingsRedirect)}
                                        >
                                            <ListItemIcon>
                                                <Setting2 size={20} color="currentColor" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2">Settings</Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem> */}
                                </List>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}
