import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import * as React from "react";

import Toolbar from "@mui/material/Toolbar";
import { Link, useLocation } from "react-router-dom";
import CustomAppbar from "../appbar";
import PrimaryMenu from "./PrimaryMenu";


interface Props {
    window?: () => Window;
    children: React.ReactNode;
}

const DRAWER_EXPANDED = 252;
const DRAWER_COLLAPSED = 68;

export default function ResponsiveDrawer(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [desktopCollapsed, setDesktopCollapsed] = React.useState(false);
    const location = useLocation();

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleDesktopCollapse = () => {
        setDesktopCollapsed((prev) => !prev);
    };

    React.useEffect(() => {
        if (mobileOpen) {
            handleDrawerClose();
        }
    }, [location.pathname]);

    const desktopWidth = desktopCollapsed ? DRAWER_COLLAPSED : DRAWER_EXPANDED;

    const mobileDrawerContent = (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar
                sx={{
                    padding: "20px 18px 18px",
                    justifyContent: "flex-start",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    minHeight: "72px !important",
                }}>
                <Link to={"/"}>
                    <img src="/logo.svg" alt="" style={{ height: 40, width: "auto", margin: "0 auto" }} />
                </Link>
            </Toolbar>
            <PrimaryMenu isCollapsed={false} />
        </div>
    );

    const desktopDrawerContent = (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar
                sx={{
                    padding: desktopCollapsed ? "20px 14px 18px" : "20px 18px 18px",
                    justifyContent: desktopCollapsed ? "center" : "flex-start",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    minHeight: "72px !important",
                    transition: "padding 0.25s ease",
                }}>
                <Link to={"/"}>
                    <img
                        src={desktopCollapsed ? "/favicon.svg" : "/logo.svg"}
                        alt=""
                        style={{
                            height: 40,
                            width: "auto",
                            maxWidth: desktopCollapsed ? 36 : "none",
                            objectFit: "contain",
                        }}
                    />
                </Link>
            </Toolbar>
            <PrimaryMenu isCollapsed={desktopCollapsed} />
        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex", overflowX: "hidden", width: "100%" }}>
            <CustomAppbar
                handleDrawerToggle={handleDrawerToggle}
                handleDesktopCollapse={handleDesktopCollapse}
                desktopCollapsed={desktopCollapsed}
            />
            <Box
                component="nav"
                sx={{
                    width: { lg: desktopWidth },
                    flexShrink: { md: 0 },
                    transition: "width 0.25s ease",
                }}
                aria-label="mailbox folders">
                {/* Mobile drawer */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { sm: "block", lg: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: DRAWER_EXPANDED,
                            backgroundColor: (theme) => theme.palette.background.sidebar,
                        },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true,
                        },
                    }}>
                    {mobileDrawerContent}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", lg: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: desktopWidth,
                            backgroundColor: (theme) => theme.palette.background.sidebar,
                            overflow: "hidden",
                            transition: "width 0.25s ease",
                        },
                    }}
                    open>
                    {desktopDrawerContent}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: {
                        lg: `calc(100% - ${desktopWidth}px)`
                    },
                    padding: {
                        xs: "0",
                        lg: "0"
                    },
                    overflow: "hidden",
                    backgroundColor: (theme) => theme.palette.background.default,
                    transition: "width 0.25s ease",
                }}>
                <Toolbar sx={{
                    height: {
                        xs: 58,
                        xl: 58
                    },
                    minHeight: "58px !important",
                }} />
                <Box
                    className="content flex flex-col overflow-hidden"
                    sx={{
                        backgroundColor: (theme) => theme.palette.primary.contrastText,
                        height: {
                            xs: "calc(100vh - 58px)",
                            lg: "calc(100vh - 58px)"
                        },
                        padding: {
                            xs: "20px 16px 20px",
                            lg: "20px 24px 24px"
                        },
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}>
                    {props.children}
                </Box>
            </Box>
        </Box>
    );
}
