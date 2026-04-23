import {
    Box,
    Button,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Eye, EyeSlash, Lock1 } from "iconsax-reactjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useThemeSettings } from "../../../../hooks/useThemeSettings";
import { useSetPasswordMutation } from "../../../../services/authApi";
import { setCredentials } from "../../../../slice/authSlice";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .required("Password is required")
        .min(8, "At least 8 characters"),
    password_confirmation: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export default function SetPasswordPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const { logoUrl, logoDarkUrl } = useThemeSettings();
    const { mode } = useAppSelector((state) => state.udaan_theme);
    const logo = mode === "light" ? logoDarkUrl : logoUrl;

    const [setPassword, { isLoading }] = useSetPasswordMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const formik = useFormik({
        initialValues: { password: "", password_confirmation: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await setPassword({
                    password: values.password,
                    password_confirmation: values.password_confirmation,
                }).unwrap();

                if (user) {
                    dispatch(setCredentials({ user: { ...user, has_password: true } }));
                }
                dispatch(
                    showToast({
                        message: response.message || "Password set successfully",
                        severity: "success",
                    }),
                );
                navigate("/", { replace: true });
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Failed to set password. Please try again.",
                        severity: "error",
                    }),
                );
            }
        },
    });

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                px: 3,
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 480 }}>
                <img src={logo} alt="" className="h-auto max-w-[160px] mb-8" />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            bgcolor: "primary.light",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <Lock1 size={22} color="var(--mui-palette-primary-main)" variant="Bold" />
                    </Box>
                    <div>
                        <Typography variant="h4" fontWeight={700}>
                            Set Your Password
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Create a secure password to protect your account. You'll use this to log in next time.
                        </Typography>
                    </div>
                </Box>

                <form onSubmit={formik.handleSubmit} className="mt-8">
                    <div className="input__field mb-5">
                        <InputLabel>New Password</InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter a new password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((p) => !p)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {formik.touched.password && formik.errors.password && (
                            <FormHelperText error sx={{ mt: 0.5 }}>
                                {formik.errors.password}
                            </FormHelperText>
                        )}
                    </div>

                    <div className="input__field mb-8">
                        <InputLabel>Confirm Password</InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="password_confirmation"
                            name="password_confirmation"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter your password"
                            value={formik.values.password_confirmation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.password_confirmation &&
                                Boolean(formik.errors.password_confirmation)
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirm((p) => !p)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showConfirm ? <EyeSlash size={18} /> : <Eye size={18} />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {formik.touched.password_confirmation &&
                            formik.errors.password_confirmation && (
                                <FormHelperText error sx={{ mt: 0.5 }}>
                                    {formik.errors.password_confirmation}
                                </FormHelperText>
                            )}
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={isLoading || !formik.dirty}
                    >
                        {isLoading ? "Setting up…" : "Set Password & Continue"}
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
