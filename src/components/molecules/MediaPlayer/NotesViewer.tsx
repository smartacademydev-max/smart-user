import { Box, Button, CircularProgress, useTheme } from "@mui/material";
import { ExportSquare } from "iconsax-reactjs";
import { useState } from "react";

interface NotesViewerProps {
    src: string;
    /** When false, hides browser-level toolbar controls inside the PDF. */
    allowDownload?: boolean;
}

export default function NotesViewer({ src, allowDownload = true }: NotesViewerProps) {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    const suffix = allowDownload ? "" : "#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&view=FitH";

    return (
        <Box sx={{
            width: "100%",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column",
        }}>
            {/* Top bar — escape hatch in case the browser blocks the embed */}
            <Box sx={{
                display: "flex", justifyContent: "flex-end", alignItems: "center",
                px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.default,
            }}>
                <Button
                    component="a"
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<ExportSquare size={16} />}
                    sx={{ textTransform: "none" }}
                >
                    Open in new tab
                </Button>
            </Box>

            {/* PDF viewer — fills remaining height */}
            <Box sx={{ position: "relative", height: "70vh", overflow: "hidden" }}>
                {loading && (
                    <Box sx={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 1, bgcolor: theme.palette.background.paper,
                    }}>
                        <CircularProgress />
                    </Box>
                )}
                <iframe
                    key={src}
                    src={`${src}${suffix}`}
                    style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                    title="Notes Viewer"
                    onLoad={() => setLoading(false)}
                />
            </Box>
        </Box>
    );
}
