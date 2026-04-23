import {
    alpha,
    Box,
    Button,
    Typography,
    useTheme
} from "@mui/material";
import { ArrowRight, DocumentDownload } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { useThemeSettings } from "../../../../hooks/useThemeSettings";
import { PATH } from "../../../../routes/PATH";
import { useAppSelector } from "../../../../store/hook";

export default function ChoosePlatform() {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const { lang: selectedLanguage } = useAppSelector((state) => state.udaan_theme);
    const { logoUrl } = useThemeSettings();
    const handleContinueWeb = () => {
        if (selectedLanguage) {
            navigate(PATH.AUTH.LOGIN.ROOT);
        }
        else {
            navigate(PATH.AUTH.CHOOSE_PREFERED_LANG.ROOT);
        }
    };

    const handleAppRedirect = () => {
        window.location.href =
            "https://onelink.to/45cn2t";
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg,
          ${theme.palette.primary.light} 0%,
          ${theme.palette.primary.light} 100%)`,
                px: 3
            }}
        >
            {/* Main Container */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1100,
                    bgcolor: "background.paper",
                    borderRadius: 4,
                    boxShadow: 8,
                    p: { xs: 4, md: 6 },
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 6
                }}
            >
                {/* Left Content */}
                <Box>
                    <img src={logoUrl} alt="" className="max-w-[120px]" />
                    <Typography variant="h3" fontWeight={800} mb={2}>
                        Continue Your Learning
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={4}>
                        For the best experience, use our mobile app.
                        You’ll get faster access, smoother performance,
                        and offline support.
                    </Typography>

                    {!isMobile ? (
                        <Box
                            sx={{
                                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                                borderRadius: 3,
                                p: 4,
                                textAlign: "center",
                                maxWidth: 320
                            }}
                        >
                            <img src="/qr.png" alt="" className="mx-auto w-40! h-40!" />
                            <Typography variant="body2" fontWeight={600} mt={2}>
                                Scan to download the app
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Android & iOS supported
                            </Typography>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<DocumentDownload />}
                            onClick={handleAppRedirect}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                fontSize: 16,
                                textTransform: "none"
                            }}
                        >
                            Download App
                        </Button>
                    )}
                </Box>

                {/* Right Actions */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                >
                    <img src="/auth-image.png" alt="" />

                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        my={2}
                    >
                        Prefer to continue on the web?
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight />}
                        onClick={handleContinueWeb}
                        color="primary"
                    >
                        Continue with Web
                    </Button>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={3}
                    >
                        You can switch to the app anytime.
                        Your progress stays in sync.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
