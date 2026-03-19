import {
    AppBar,
    Box,
    IconButton,
    Stack,
    Toolbar,
    useTheme
} from "@mui/material";
import { HamburgerMenu } from "iconsax-reactjs";
import { useAppSelector } from "../../../../store/hook";
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
    const drawerWidth = 252;
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
