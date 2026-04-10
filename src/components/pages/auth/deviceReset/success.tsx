import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import {
    Box,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";

const NEXT_STEPS = [
    "Request submitted with your reason and proof",
    "Admin reviews your request — usually within 24–48 hrs",
    "You receive an SMS & email with the decision",
    "If approved, old device is signed out — log in here",
];

export default function DeviceResetSuccess() {
    const navigate = useNavigate();

    return (
        <Box sx={{ maxWidth: 480, mx: "auto", width: "100%" }}>
            <Stack flexDirection={"column"} alignItems="flex-start" spacing={2.5}>
                {/* Clock icon */}
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: "primary.light",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ScheduleOutlinedIcon sx={{ fontSize: 28, color: "text.secondary" }} />
                </Box>

                {/* Heading */}
                <Stack flexDirection={"column"} spacing={0.5}>
                    <Typography variant="h5" fontWeight={700}>
                        Request submitted!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your device reset request is under review. An admin will approve or reject it — you'll be
                        notified via SMS and email.
                    </Typography>
                </Stack>

                {/* What happens next */}
                <Box
                    sx={{
                        width: "100%",
                        border: "1px solid",
                        borderColor: "primary.main",
                        color: "primary.main",
                        bgcolor: "primary.light",
                        borderRadius: 2,
                        p: 2.5,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography sx={{ fontSize: 11, color: "#fff", lineHeight: 1 }}>i</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                            What happens next
                        </Typography>
                    </Stack>

                    <Stack flexDirection={"column"} spacing={1}>
                        {NEXT_STEPS.map((step, i) => (
                            <Stack key={i} direction="row" spacing={1.25} alignItems="flex-start">
                                <Box
                                    sx={{
                                        minWidth: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        bgcolor: "primary.main",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: 0.1,
                                    }}
                                >
                                    <Typography sx={{ fontSize: 11, color: "#fff", fontWeight: 700, lineHeight: 1 }}>
                                        {i + 1}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="primary.main">
                                    {step}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(PATH.AUTH.LOGIN.ROOT, { replace: true })}
                >
                    Sign in with another account
                </Button>

                <Box
                    sx={{
                        width: "100%",
                        border: "1px solid ",
                        borderRadius: 2,
                        p: 2,
                        bgcolor: "info.light",
                        color: "info.main"
                    }}
                >
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                        <NotificationsNoneOutlinedIcon sx={{ fontSize: 20, mt: 0.1 }} />
                        <Typography variant="body2" >
                            Make sure notifications are enabled so you don't miss the decision on your number
                            you've specified.
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
