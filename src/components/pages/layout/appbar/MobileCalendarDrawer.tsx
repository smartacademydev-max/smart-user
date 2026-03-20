import {
    Box,
    Drawer,
    IconButton,
    Typography,
    useTheme,
} from "@mui/material";
import { Calendar } from "iconsax-reactjs";
import { useState } from "react";
import LiveClassAndTestFilter from "../../Dashboard/LiveClassAndTestFilter";

export default function MobileCalendarDrawer() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Trigger button — only visible up to md */}
            <Box
                onClick={() => setOpen(true)}
                sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: theme.palette.separator.dark,
                    cursor: "pointer",
                    flexShrink: 0,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
            >
                <Calendar size={18} color={theme.palette.separator.darkest} />
            </Box>

            {/* Drawer */}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: "100vw", sm: 380 },
                            backgroundColor: theme.palette.background.default,
                        },
                    },
                }}
            >
                {/* Header */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Calendar & Updates
                    </Typography>
                    <IconButton size="small" onClick={() => setOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </IconButton>
                </Box>

                {/* Scrollable content — reuses the same LiveClassAndTestFilter */}
                <Box sx={{
                    overflowY: "auto",
                    flex: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}>
                    <LiveClassAndTestFilter />
                </Box>
            </Drawer>
        </>
    );
}
