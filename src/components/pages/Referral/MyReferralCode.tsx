import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import { Box, Button, Chip, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";

interface Props {
    referralCode: string;
}

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL ?? window.location.origin;

export default function MyReferralCode({ referralCode }: Props) {
    const dispatch = useAppDispatch();
    const shareUrl = `${APP_BASE_URL}/auth/register?ref=${referralCode}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            dispatch(showToast({ message: "Referral link copied!", severity: "success" }));
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ url: shareUrl, title: "Join SMART via my referral link" });
        } else {
            copyToClipboard();
        }
    };

    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 3,
                mb: 4,
            }}
        >
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Your Referral Link
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2.5}>
                Share this link — earn points when friends register and make their first purchase.
            </Typography>

            <Box mb={2}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Referral Code
                </Typography>
                <Chip
                    label={referralCode}
                    color="primary"
                    variant="outlined"
                    sx={{
                        fontFamily: "monospace",
                        fontSize: "1rem",
                        fontWeight: 700,
                        letterSpacing: 3,
                        height: 36,
                        px: 1,
                    }}
                />
            </Box>

            <Box mb={2.5}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Shareable Link
                </Typography>
                <OutlinedInput
                    fullWidth
                    readOnly
                    value={shareUrl}
                    size="small"
                    inputProps={{ style: { fontFamily: "monospace", fontSize: "0.78rem" } }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={copyToClipboard} edge="end" size="small" title="Copy link">
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Box>

            <div className="flex flex-wrap gap-2">
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={copyToClipboard}
                >
                    Copy Link
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                >
                    Share
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    component="a"
                    href={`https://wa.me/?text=${encodeURIComponent(`Join using my referral link: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ borderColor: "#25D366", color: "#25D366", "&:hover": { borderColor: "#1da851", background: "rgba(37,211,102,0.06)" } }}
                >
                    WhatsApp
                </Button>
            </div>
        </Box>
    );
}
