import { Box, Dialog, Grow, IconButton, Typography, useTheme } from '@mui/material';
import { CloseSquare, MessageQuestion } from 'iconsax-reactjs';
import React from 'react';

interface ChatDialogLauncherProps {
    title?: string;
    children: React.ReactNode;
    buttonIcon?: React.ReactNode;
    width?: number | string;
    maxHeight?: string;
}

export default function ChatDialogLauncher({
    title = 'Support Chat',
    children,
    buttonIcon,
    width = 420,
    maxHeight = 'calc(100vh - 96px)',
}: ChatDialogLauncherProps) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Box
                onClick={() => setOpen((prev) => !prev)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: theme.shadows[6],
                    transition: 'transform 180ms ease, background-color 180ms ease',
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'scale(1.04)',
                    },
                }}
            >
                {buttonIcon ?? <MessageQuestion size={22} />}
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                hideBackdrop
                TransitionComponent={Grow}
                TransitionProps={{ timeout: 220, style: { transformOrigin: 'bottom right' } }}
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                    },
                }}
                PaperProps={{
                    sx: {
                        position: 'absolute',
                        bottom: 24,
                        right: 24,
                        width: { xs: '100%', sm: width },
                        maxWidth: 420,
                        maxHeight,
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: theme.shadows[24],
                        transformOrigin: 'bottom right',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1.25,
                        backgroundColor: theme.palette.background.paper,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MessageQuestion size={20} />
                        <Typography variant="subtitle1" fontWeight={600}>
                            {title}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setOpen(false)}>
                        <CloseSquare size={18} />
                    </IconButton>
                </Box>

                <Box sx={{ height: 620, maxHeight, overflow: 'auto' }}>
                    {children}
                </Box>
            </Dialog>
        </>
    );
}
