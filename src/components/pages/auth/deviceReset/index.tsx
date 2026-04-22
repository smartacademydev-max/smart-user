import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import { useRequestDeviceResetMutation } from "../../../../services/authApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";

const REASON_OPTIONS = [
    { value: "lost_device", label: "Lost device" },
    { value: "new_browser", label: "Switched to a new browser" },
    { value: "factory_reset", label: "Factory reset / reinstall" },
    { value: "other", label: "Other" },
];

const validationSchema = Yup.object({
    reason: Yup.string(),
    situation: Yup.string()
        .trim()
        .min(10, "Please describe your situation in at least 10 characters")
        .required("Situation is required"),
});

export default function DeviceResetForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [requestDeviceReset, { isLoading }] = useRequestDeviceResetMutation();

    const [searchParams] = useSearchParams();
    const hasPendingRequest = location.state?.has_pending_request as boolean | undefined;
    const userId = (location.state?.user_id ?? searchParams.get("user_id")) as string | undefined;

    // If user already has a pending request, skip the form and go straight to success
    useEffect(() => {
        if (hasPendingRequest) {
            navigate(PATH.AUTH.DEVICE_RESET.SUCCESS.ROOT, { replace: true });
        }
    }, [hasPendingRequest, navigate]);

    const formik = useFormik({
        initialValues: { reason: "", situation: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await requestDeviceReset({
                    reason: values.reason || undefined,
                    situation: values.situation.trim(),
                    user_id: userId ?? "",
                    device_type: "web",
                }).unwrap();
                dispatch(showToast({ message: response.message || "Request submitted.", severity: "success" }));
                navigate(PATH.AUTH.DEVICE_RESET.SUCCESS.ROOT, { replace: true });
            } catch (e: any) {
                dispatch(showToast({
                    message: e?.data?.message || "Failed to submit request. Please try again.",
                    severity: "error",
                }));
            }
        },
    });

    if (hasPendingRequest) return null;

    return (
        <Box sx={{ maxWidth: 700, mx: "auto", width: "100%" }}>
            <div className="mb-6">
                <Typography variant="h4" fontWeight={500} className="mb-1.5">
                    Request device reset
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Your request will be reviewed. Access will be granted after approval.
                </Typography>
            </div>

            <Alert
                icon={<Box sx={{ color: "primary.main" }}><InfoOutlinedIcon fontSize="small" /></Box>}
                sx={{
                    mb: 3, borderRadius: 2, fontSize: 13, bgcolor: "primary.light",
                    border: "1px solid primary.dark",

                }}
            >
                Admin approval is required. You will be notified via SMS/email once a decision is made.
                Requests with insufficient explanation may be declined.
            </Alert>

            <form onSubmit={formik.handleSubmit}>
                <Stack flexDirection={"column"} spacing={1.5}>
                    {/* Reason */}
                    <FormControl fullWidth>
                        <Typography variant="body2" fontWeight={500} mb={0.75}>
                            Reason for reset
                        </Typography>
                        <Select
                            displayEmpty
                            name="reason"
                            value={formik.values.reason}
                            onChange={formik.handleChange}
                            input={<OutlinedInput />}
                            renderValue={(val) =>
                                val
                                    ? REASON_OPTIONS.find((o) => o.value === val)?.label
                                    : <span style={{ color: "#9CA3AF" }}>Select Reason</span>
                            }
                        >
                            {REASON_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Situation */}
                    <FormControl fullWidth error={formik.touched.situation && Boolean(formik.errors.situation)}>
                        <Typography variant="body2" fontWeight={500} mb={0.75}>
                            Situation<span style={{ color: "#EF4444" }}>*</span>
                        </Typography>
                        <OutlinedInput
                            name="situation"
                            multiline
                            minRows={4}
                            placeholder="Describe your situation"
                            value={formik.values.situation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.situation && formik.errors.situation && (
                            <FormHelperText>{formik.errors.situation}</FormHelperText>
                        )}
                    </FormControl>

                    <div className="mt-4 flex flex-col gap-2">
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={isLoading || !formik.isValid}
                        >
                            {isLoading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate(PATH.AUTH.LOGIN.ROOT)}
                        >
                            Back to Login
                        </Button>
                    </div>
                </Stack>
            </form>
        </Box>
    );
}
