import {
    Button,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import { useValidateUserExistanceMutation } from "../../../../services/authApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import AuthHeader from "../../../molecules/AuthHeader";

const validationSchema = Yup.object().shape({
    phone: Yup.string().required("Phone number is required"),
});

export default function ForgotPasswordPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [validateUser, { isLoading }] = useValidateUserExistanceMutation();

    const formik = useFormik({
        initialValues: { phone: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await validateUser({ data: values.phone }).unwrap();
                navigate(
                    `${PATH.AUTH.FORGOT_PASSWORD.VERIFY.ROOT}?phone=${values.phone}`,
                );
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Phone number not found. Please try again.",
                        severity: "error",
                    }),
                );
            }
        },
    });

    return (
        <>
            <AuthHeader
                title="Forgot Password"
                description="Enter your registered phone number. We'll send you a verification code to reset your password."
            />

            <form onSubmit={formik.handleSubmit} className="login__form">
                <div className="input__field mb-6">
                    <InputLabel>Phone Number</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <FormHelperText error sx={{ mt: 0.5 }}>
                            {formik.errors.phone}
                        </FormHelperText>
                    )}
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading || !formik.dirty}
                >
                    {isLoading ? "Checking…" : "Continue"}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <Typography variant="subtitle2" color="text.light">
                    Remember your password?{" "}
                    <RouterLink to={PATH.AUTH.LOGIN.ROOT}>
                        <Typography color="primary" variant="subtitle2" component="span">
                            Back to Login
                        </Typography>
                    </RouterLink>
                </Typography>
            </div>
        </>
    );
}
