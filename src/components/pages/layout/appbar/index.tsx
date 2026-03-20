import {
    AppBar,
    Box,
    IconButton,
    Stack,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import { HamburgerMenu } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store/hook";
import { getGreetingKey } from "../../../../utils/greeting";
import NotificationModal from "./Notification";
import ProfileMenu from "./Profile";
import SettingMenu from "./Setting";
// const drawerWidth = 356;

export default function CustomAppbar({
    handleDrawerToggle,
}: {
    handleDrawerToggle: () => void;
}) {
    const theme = useTheme();
    const { mode } = useAppSelector((state) => state.smart_theme)
    const { user } = useAppSelector((state) => state.auth);
    const drawerWidth = 252;
    const { t } = useTranslation();
    // const days = [
    //     "Sunday",
    //     "Monday",
    //     "Tuesday",
    //     "Wednesday",
    //     "Thursday",
    //     "Friday",
    //     "Saturday",
    // ];
    return (
        <AppBar
            position="fixed"
            sx={{
                width: { lg: `calc(100% - ${drawerWidth}px)` },
                ml: { lg: `${drawerWidth}px` },
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 0,
                height: 58,
                justifyContent: "center",
                padding: { xs: "0 12px", lg: "0 24px" },
                backgroundColor: (theme) => mode === "dark" ? theme.palette.background.paper : theme.palette.primary.contrastText,
            }}
            color="default"
            elevation={0}
        >
            <Toolbar sx={{
                px: {
                    lg: 3
                }
            }}>
                <Stack sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "start",
                    width: "100%"
                }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            mr: 2,
                            display: { lg: "none" },
                            minHeight: "44px",
                            aspectRatio: "1/1",
                            ml: 0,
                            background: (theme) => theme.palette.separator.dark,
                            "&:hover": { backgroundColor: (theme) => theme.palette.action.hover },
                        }}

                    >
                        <HamburgerMenu color={theme.palette.separator.darkest} />
                    </IconButton>
                    <div className="flex justify-between flex-wrap">
                        <div className="user_message">
                            <Typography
                                className="w-full"
                                variant="body1"
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    lineHeight: 1.3,
                                    fontWeight: 700
                                }}
                            >
                                <span>
                                    {t(getGreetingKey())},{" "}
                                    <Box component="span" className="text-nowrap">
                                        {user?.name}
                                    </Box>
                                </span>
                            </Typography>
                            <Typography variant='subtitle2' className='mt-1! hidden md:block' fontWeight={400} sx={{ opacity: 0.85 }}>You're making great progress. Keep exploring!</Typography>
                        </div>
                    </div>
                </Stack>
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "end",
                        width: "100%",
                    }}
                >

                    <Box className="flex gap-2 items-center justify-end lg:gap-4 w-full">
                        <NotificationModal />
                        <SettingMenu />
                        <ProfileMenu />
                    </Box>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
