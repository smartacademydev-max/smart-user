import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Stack,
    Typography,
} from "@mui/material";
import { Warning2 } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";

interface Props {
    open: boolean;
    onClose: () => void;
    deviceLocation?: string;
    hasPendingRequest?: boolean;
    userId?: string;
}

export default function NewDeviceDetectedDialog({
    open,
    onClose,
    deviceLocation,
    hasPendingRequest,
    userId,
}: Props) {
    const navigate = useNavigate();

    const handleRequestReset = () => {
        onClose();
        navigate(PATH.AUTH.DEVICE_RESET.ROOT, {
            state: { has_pending_request: hasPendingRequest, user_id: userId },
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
            <DialogContent>
                <Stack flexDirection={"column"} spacing={.5}>
                    {/* Icon */}
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            bgcolor: "primary.light",
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Warning2 size={32} variant="Bold" />
                    </Box>

                    <Typography variant="h6" fontWeight={700} className="mb-4! mt-6!">
                        Already logged in on another device
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Your account is active on a device
                        {deviceLocation ? (
                            <> in <strong style={{ color: "inherit" }}>{deviceLocation}</strong></>
                        ) : null}
                        . Only 1 mobile &amp; 1 web session is allowed per account.
                    </Typography>

                    {/* Actions */}
                    <Stack gap={1} className="mt-8!">
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleRequestReset}
                        >
                            Request Device Reset
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
