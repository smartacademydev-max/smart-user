import {
    Button,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import { useResetPasswordMutation } from "../../../../services/authApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import AuthHeader from "../../../molecules/AuthHeader";

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .required("Password is required")
        .min(8, "At least 8 characters"),
    password_confirmation: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export default function ForgotPasswordReset() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { phone, otp } = (location.state as { phone?: string; otp?: string }) ?? {};

    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

  
    if (!phone || !otp) {
        return (
            <div className="text-center mt-20">
                <Typography color="error">Session expired. Please start over.</Typography>
                <RouterLink to={PATH.AUTH.FORGOT_PASSWORD.ROOT}>
                    <Button variant="text" color="primary" sx={{ mt: 2 }}>
                        Go back
                    </Button>
                </RouterLink>
            </div>
        );
    }

    const formik = useFormik({
        initialValues: { password: "", password_confirmation: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await resetPassword({
                    phone,
                    otp,
                    password: values.password,
                    password_confirmation: values.password_confirmation,
                }).unwrap();

                dispatch(
                    showToast({
                        message: response.message || "Password reset successfully. Please log in.",
                        severity: "success",
                    }),
                );
                navigate(PATH.AUTH.LOGIN.ROOT, { replace: true });
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Failed to reset password. Please try again.",
                        severity: "error",
                    }),
                );
            }
        },
    });

    return (
        <>
            <AuthHeader
                title="Reset Password"
                description="Enter your new password below. Make sure it's at least 8 characters."
            />

            <form onSubmit={formik.handleSubmit} className="login__form">
                <div className="input__field mb-5">
                    <InputLabel>New Password</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
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
                        placeholder="Re-enter your new password"
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
                    {isLoading ? "Resetting…" : "Reset Password"}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <RouterLink to={PATH.AUTH.FORGOT_PASSWORD.ROOT}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Start over
                    </Typography>
                </RouterLink>
            </div>
        </>
    );
}
