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

export default function ResponsiveDrawer(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
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

    React.useEffect(() => {
        if (mobileOpen) {
            handleDrawerClose();
        }
    }, [location.pathname]);

    const drawer = (
        <div>
            <Toolbar
                sx={{
                    padding: "20px 18px 18px",
                    justifyContent: "flex-start",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    minHeight: "72px !important",
                }}>
                <Link to={"/"}>
                    <img src="/logo.svg" alt="" style={{ height: 40, width: "auto" }} />
                </Link>
            </Toolbar>
            <PrimaryMenu />
        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container =
        window !== undefined ? () => window().document.body : undefined;

    const drawerWidth = 252;

    return (
        <Box sx={{ display: "flex" }}>
            <CustomAppbar handleDrawerToggle={handleDrawerToggle} />
            <Box
                component="nav"
                sx={{ width: { lg: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders">
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
                            width: drawerWidth,
                            backgroundColor: (theme) => theme.palette.background.sidebar,
                        },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true,
                        },
                    }}>
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", lg: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            backgroundColor: (theme) => theme.palette.background.sidebar,
                        },
                    }}
                    open>
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: {
                        lg: `calc(100% - ${drawerWidth}px)`
                    },
                    padding: {
                        xs: "0",
                        lg: "0"
                    },
                    overflow: "hidden",
                    backgroundColor: (theme) => theme.palette.background.default,
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
                    }}>
                    {props.children}
                </Box>
            </Box>
        </Box>
    );
}