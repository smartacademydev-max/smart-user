import { Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthRoot() {
    const theme = useTheme();
    return (
        <Box
            className="auth__root px-4 xl:px-0"
            sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.palette.primary.light,
            }}>
            <Box
                sx={{
                    background: theme.palette.primary.contrastText,
                    padding: {
                        xs: "24px",
                        lg: "56px",
                    },
                    borderRadius: "24px",
                    minWidth: {
                        xs: "100%",
                        md: "576px",
                    },
                }}>
                <Outlet />
            </Box>
        </Box>
    );
}
