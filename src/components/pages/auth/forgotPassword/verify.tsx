import {
    Box,
    Button,
    CircularProgress,
    FormHelperText,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import { useResendOtpMutation } from "../../../../services/authApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import AuthHeader from "../../../molecules/AuthHeader";

const validationSchema = Yup.object({
    otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .matches(/^\d+$/, "OTP must contain only digits")
        .required("Please enter the OTP"),
});

export default function ForgotPasswordVerify() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [phone, setPhone] = useState("");
    const [isCheckingPhone, setIsCheckingPhone] = useState(true);
    const [timer, setTimer] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [resendOtp, { isLoading: isSending }] = useResendOtpMutation();

    useEffect(() => {
        const phoneNumber = searchParams.get("phone");
        if (!phoneNumber) {
            dispatch(showToast({ message: "Phone number not found.", severity: "error" }));
            navigate(PATH.AUTH.FORGOT_PASSWORD.ROOT, { replace: true });
            return;
        }
        setPhone(phoneNumber);
        setIsCheckingPhone(false);
    }, [searchParams, navigate, dispatch]);

    useEffect(() => {
        const timerEnd = localStorage.getItem("fpOtpTimerEnd");
        if (timerEnd) {
            const remaining = Math.floor((parseInt(timerEnd) - Date.now()) / 1000);
            if (remaining > 0) setTimer(remaining);
            else localStorage.removeItem("fpOtpTimerEnd");
        }
    }, []);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    localStorage.removeItem("fpOtpTimerEnd");
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const startTimer = (seconds: number) => {
        localStorage.setItem("fpOtpTimerEnd", (Date.now() + seconds * 1000).toString());
        setTimer(seconds);
    };

    const formik = useFormik({
        initialValues: { otp: "" },
        validationSchema,
        onSubmit: (values) => {
            navigate(PATH.AUTH.FORGOT_PASSWORD.RESET.ROOT, {
                state: { phone, otp: values.otp },
            });
        },
    });

    const getOtpArray = (otp: string) => {
        const split = otp.split("");
        while (split.length < 6) split.push("");
        return split.slice(0, 6);
    };

    const otpArray = getOtpArray(formik.values.otp);

    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;
        const newOtpArray = [...otpArray];
        newOtpArray[index] = value;
        formik.setFieldValue("otp", newOtpArray.join("").replace(/\s/g, ""));
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
    ) => {
        if (e.key === "Backspace" && !otpArray[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").trim();
        if (!/^\d+$/.test(pasted)) return;
        const digits = pasted.slice(0, 6);
        formik.setFieldValue("otp", digits);
        inputRefs.current[Math.min(digits.length, 5)]?.focus();
    };

    const handleResendOTP = async () => {
        try {
            const response = await resendOtp({ phone }).unwrap();
            dispatch(showToast({ message: response.message || "OTP sent successfully.", severity: "success" }));
            startTimer(90);
            formik.resetForm();
            inputRefs.current[0]?.focus();
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Unable to send OTP.", severity: "error" }));
        }
    };

    if (isCheckingPhone) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <AuthHeader
                title="OTP Verification"
                description="Enter the One-Time Password (OTP) sent to your registered phone number."
            />

            <Typography textAlign="center" className="mb-3!" sx={{ fontSize: { xs: 14, lg: 16 } }}>
                We've sent a 6-digit code to <strong style={{ color: "#1976d2" }}>{phone}</strong>
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mb: 2 }}>
                    {otpArray.map((digit, index) => (
                        <OutlinedInput
                            key={index}
                            inputRef={(el) => { inputRefs.current[index] = el; }}
                            type="number"
                            inputMode="numeric"
                            inputProps={{
                                maxLength: 1,
                                style: { textAlign: "center", fontSize: 24, fontWeight: 600, padding: 0 },
                            }}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            error={formik.touched.otp && Boolean(formik.errors.otp)}
                            sx={{
                                width: { xs: 45, sm: 56 },
                                height: { xs: 50, sm: 60 },
                                p: { xs: 0, md: "10px 16px" },
                                "& input": { height: "100%" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                },
                            }}
                        />
                    ))}
                </Box>

                {formik.touched.otp && formik.errors.otp && (
                    <FormHelperText error sx={{ mb: 2, textAlign: "center" }}>
                        {formik.errors.otp}
                    </FormHelperText>
                )}

                <Typography variant="subtitle2" textAlign="end" color="text.secondary" className="my-2!">
                    Didn't get the code?{" "}
                    {timer > 0 ? (
                        <strong style={{ marginLeft: 4 }}>Resend in {timer}s</strong>
                    ) : (
                        <Button
                            variant="text"
                            color="primary"
                            onClick={handleResendOTP}
                            disabled={isSending}
                            sx={{ textTransform: "none", ml: 1 }}
                        >
                            {isSending ? "Sending..." : "Send Again"}
                        </Button>
                    )}
                </Typography>

                <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={!formik.isValid || !formik.dirty}
                    sx={{ mb: 3, py: 1.5 }}
                >
                    Continue
                </Button>
            </form>
        </>
    );
}
