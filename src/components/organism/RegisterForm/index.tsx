import { Button, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useLoginType } from "../../../hooks/useLoginType";
import { PATH } from "../../../routes/PATH";
import { useRegisterMutation } from "../../../services/authApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { captureAttribution, clearAttribution, getAttribution } from "../../../utils/attribution";
import Password from "../../atom/Password";

export default function RegisterForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const user = useAppSelector((state) => state.auth.user);
    const { loginType } = useLoginType();
    const isPasswordBased = loginType === "password" || loginType === "both";

    // Capture attribution from URL on register page mount (handles direct navigation)
    useEffect(() => {
        captureAttribution(new URLSearchParams(window.location.search));
    }, []);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            const redirectUrl = getPendingRedirectUrl();
            if (redirectUrl) {
                navigate(redirectUrl);
            } else {
                navigate(PATH.DASHBOARD.ROOT);
            }
        }
    }, [user, navigate]);

    const getPendingRedirectUrl = (): string => {
        const courseId = searchParams.get("course");
        const testId = searchParams.get("test");
        const bundleId = searchParams.get("bundle");
        if (courseId) return PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(Number(courseId));
        if (testId) return PATH.TEST.ROOT;
        if (bundleId) return PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.VIEW_BUNDLE.ROOT(Number(bundleId));
        return "";
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Full name is required"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        phone: Yup.string()
            .matches(/^\d+$/, "Phone must contain only digits")
            .min(7, "Phone number too short")
            .required("Phone number is required"),
        ...(isPasswordBased && {
            password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .required("Password is required"),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords do not match")
                .required("Confirm password is required"),
        }),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const basePayload = isPasswordBased
                    ? values
                    : { name: values.name, email: values.email, phone: values.phone };

                const attribution = getAttribution();
                const payload = {
                    ...basePayload,
                    ...(attribution?.type === "referral" && { referral_code: attribution.code }),
                    ...(attribution?.type === "marketing" && { campaign_code: attribution.code }),
                };

                const response = await registerUser(payload).unwrap();
                clearAttribution();
                dispatch(
                    showToast({
                        message: response?.message || "Registered Succesfully.",
                        severity: "success",
                    }),
                );
                const redirectUrl = getPendingRedirectUrl();
                const otpPath = isPasswordBased ? PATH.AUTH.LOGIN.ROOT : `${PATH.AUTH.VERIFY_OTP.ROOT}?phone=${values.phone}${redirectUrl ? `&redirect_url=${encodeURIComponent(redirectUrl)}` : ""}`;
                navigate(otpPath);
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to Login",
                        severity: "error",
                    }),
                );
            }
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
            {/* Full Name */}
            <div className="input__field mb-6">
                <InputLabel>Full Name</InputLabel>
                <OutlinedInput
                    fullWidth
                    name="name"
                    placeholder="Enter your full name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                />
                {formik.touched.name && formik.errors.name && (
                    <FormHelperText error={true}>
                        {formik.errors.name}
                    </FormHelperText>
                )}
            </div>

            {/* Email */}
            <div className="input__field mb-6">
                <InputLabel>Email Address</InputLabel>
                <OutlinedInput
                    fullWidth
                    name="email"
                    placeholder="Enter your email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                />
                {formik.touched.email && formik.errors.email && (
                    <FormHelperText error={true}>
                        {formik.errors.email}
                    </FormHelperText>
                )}
            </div>

            {/* Phone */}
            <div className="input__field mb-6">
                <InputLabel>Phone No.</InputLabel>
                <OutlinedInput
                    fullWidth
                    name="phone"
                    placeholder="Enter your phone no."
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                />
                {formik.touched.phone && formik.errors.phone && (
                    <FormHelperText error={true}>
                        {formik.errors.phone}
                    </FormHelperText>
                )}
            </div>

            {/* Password — only shown for password-based login types */}
            {isPasswordBased && (
                <>
                    <div className="input__field mb-6">
                        <InputLabel>Password</InputLabel>
                        <Password
                            name="password"
                            placeholder="Enter your password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password ? formik.errors.password : ""}
                        />
                    </div>

                    <div className="input__field mb-6">
                        <InputLabel>Confirm Password</InputLabel>
                        <Password
                            name="password_confirmation"
                            placeholder="Confirm your password"
                            value={formik.values.password_confirmation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password_confirmation && Boolean(formik.errors.password_confirmation)}
                            helperText={formik.touched.password_confirmation ? formik.errors.password_confirmation : ""}
                        />
                    </div>
                </>
            )}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                disabled={isLoading || !formik.isValid}
            >
                {isLoading ? "Registering..." : "Register"}
            </Button>
        </form>
    )
}
