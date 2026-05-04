
import { LocalOffer, Phone, Toll } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    InputAdornment,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { ArrowLeft } from 'iconsax-reactjs';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePaymentGateways } from "../../../hooks/usePaymentGateways";
import { useGetCourseByIdQuery, usePurchaseCourseWithEsewaMutation, usePurchaseWithKhaltiMutation } from "../../../services/courseApi";
import {
    useApplyPointsMutation,
    useGetPointsBalanceQuery,
    useGetPointsConfigQuery,
    useRestorePointsMutation,
    useValidateCouponMutation,
} from '../../../services/referralApi';
import { useGetBundleByOverviewQuery, useGetTestOverviewQuery } from '../../../services/testApi';
import { showToast } from '../../../slice/toastSlice';
import { useAppDispatch } from '../../../store/hook';
import type { CouponValidateResponse } from '../../../types/referral';
import type { PaymentMethods, PurchaseFormValues, PurchaseModuleTypes } from "../../../types/purchase";
import Quote from '../../molecules/Quote';
import PageHeader from '../../organism/PageHeader';
import CoursePaymentCard from './CoursePaymentCard';
import PurchaseGuideLines from './PurchaseGuideLines';
import PurchasePaymentOption from './PurchasePaymentOption';

export const POINTS_SESSION_KEY = "checkout_points_applied";

// eSewa Configuration
export const ESEWA_CONFIG = {
    PAYMENT_URL: import.meta.env.VITE_ESEWA_PAYMENT_URL,
} as const;


function submitEsewaForm(action: string, params: Record<string, any>) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;

    Object.keys(params).forEach(key => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
}

export default function PurchaseLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    // For subscription routes: /subscription/:courseId/:subscriptionId/purchase
    // For other routes: /:type/:id/purchase
    const { id, type, courseId, subscriptionId } = useParams();

    const isSubscription = !!courseId && !!subscriptionId;
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | undefined>(
        subscriptionId ? Number(subscriptionId) : undefined
    );

    const { paymentOptions, activeGateways } = usePaymentGateways();

    const defaultPaymentOption = useMemo<PaymentMethods>(() => {
        return (activeGateways[0]?.slug as PaymentMethods) ?? "esewa";
    }, [activeGateways]);

    const { data: course } = useGetCourseByIdQuery({ id: Number(id) }, { skip: !id || type !== "course" });
    const { data: subscriptionCourse } = useGetCourseByIdQuery({ id: Number(courseId) }, { skip: !isSubscription });
    const { data: test } = useGetTestOverviewQuery({ id: Number(id) }, { skip: !id || type !== "test" });
    const { data: bundle } = useGetBundleByOverviewQuery({ id: Number(id) }, { skip: !id || type !== "bundle" })
    const [payViaEsewa, { isLoading: payingViaEsewa }] = usePurchaseCourseWithEsewaMutation();
    const [payViaKhalti, { isLoading: isKhaltiLoading }] = usePurchaseWithKhaltiMutation();

    // ── Discount state ────────────────────────────────────────────────────────
    const [discountMode, setDiscountMode] = useState<"points" | "coupon">("coupon");
    const [couponInput, setCouponInput] = useState("");
    const [couponResult, setCouponResult] = useState<CouponValidateResponse["data"] | null>(null);
    const [pointsApplied, setPointsApplied] = useState(false);

    const { data: balanceData } = useGetPointsBalanceQuery();
    const { data: configData } = useGetPointsConfigQuery();
    const [applyPoints, { isLoading: applyingPoints }] = useApplyPointsMutation();
    const [restorePoints] = useRestorePointsMutation();
    const [validateCoupon, { isLoading: validatingCoupon }] = useValidateCouponMutation();

    const pointsBalance = balanceData?.data?.balance ?? 0;
    const conversionRate = configData?.data?.conversion_rate ?? 100;

    const subscriptionPlans = subscriptionCourse?.data?.subscriptions || [];
    const activePlan = subscriptionPlans.find(p => p.id === selectedSubscriptionId);

    let data;
    let price = 0;

    if (isSubscription) {
        data = subscriptionCourse?.data;
        price = Number(activePlan?.price) || 0;
    } else {
        switch (type) {
            case "course":
                data = course?.data;
                price = Number(course?.data?.sale_price) || 0;
                break;
            case "test":
                data = test?.data;
                price = Number(test?.data?.sale_price) || 0;
                break;
            case "bundle":
                data = bundle?.data;
                price = Number(bundle?.data?.sale_price) || 0;
                break;
            default:
                data = null;
        }
    }
    // const vat = price * 0.13;
    const vat = 0;

    // Max points discount: min(balance → Rs., order value) — never below Rs. 0
    const maxPointsDiscountRs = Math.min(Math.floor(pointsBalance / conversionRate), price + vat);
    const pointsDiscount = discountMode === "points" && pointsApplied ? maxPointsDiscountRs : 0;
    const couponDiscount = discountMode === "coupon" && couponResult ? couponResult.discount_amount : 0;
    const totalDiscount = pointsDiscount + couponDiscount;
    const finalPrice = Math.max(0, price + vat - totalDiscount);

    const handleDiscountModeChange = (val: "points" | "coupon") => {
        setDiscountMode(val);
        if (val !== "points") setPointsApplied(false);
        if (val !== "coupon") { setCouponInput(""); setCouponResult(null); }
    };

    // ── Discount section (rendered inside the right-side payment card) ────────
    const discountSection = (
        <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
                Apply Discount
            </Typography>

            <Select
                size="small"
                fullWidth
                value={discountMode}
                onChange={(e) => handleDiscountModeChange(e.target.value as "points" | "coupon")}
                sx={{ mb: 1.5 }}
            >
                <MenuItem value="coupon">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <LocalOffer sx={{ fontSize: 16 }} />
                        Coupon Code
                    </Box>
                </MenuItem>
                <MenuItem value="points" disabled={pointsBalance === 0}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Toll sx={{ fontSize: 16 }} />
                        Points{pointsBalance > 0
                            ? ` (${pointsBalance} pts ≈ Rs. ${Math.floor(pointsBalance / conversionRate)})`
                            : " (no balance)"}
                    </Box>
                </MenuItem>
            </Select>

            {discountMode === "coupon" && (
                <Box>
                    <Box display="flex" gap={1}>
                        <OutlinedInput
                            size="small"
                            placeholder="Enter coupon code"
                            value={couponInput}
                            onChange={(e) => {
                                setCouponInput(e.target.value.toUpperCase());
                                setCouponResult(null);
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <LocalOffer fontSize="small" />
                                </InputAdornment>
                            }
                            sx={{ flex: 1 }}
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={!couponInput || validatingCoupon}
                            onClick={async () => {
                                try {
                                    const res = await validateCoupon({
                                        code: couponInput,
                                        order_amount: price + vat,
                                    }).unwrap();
                                    setCouponResult(res.data);
                                    dispatch(showToast({ message: "Coupon applied!", severity: "success" }));
                                } catch (e: any) {
                                    setCouponResult(null);
                                    dispatch(showToast({
                                        message: e?.data?.message || "Invalid coupon code.",
                                        severity: "error",
                                    }));
                                }
                            }}
                        >
                            {validatingCoupon ? <CircularProgress size={16} /> : "Apply"}
                        </Button>
                    </Box>
                    {couponResult && (
                        <Typography variant="body2" color="success.main" fontWeight={600} mt={1}>
                            − Rs. {couponResult.discount_amount} discount applied
                        </Typography>
                    )}
                </Box>
            )}

            {discountMode === "points" && (
                <Box>
                    {pointsApplied ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                                − Rs. {maxPointsDiscountRs} applied
                            </Typography>
                            <Button
                                size="small"
                                color="error"
                                variant="text"
                                onClick={() => setPointsApplied(false)}
                                sx={{ minWidth: 0 }}
                            >
                                Remove
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            size="small"
                            variant="outlined"
                            fullWidth
                            onClick={() => setPointsApplied(true)}
                            disabled={maxPointsDiscountRs === 0}
                        >
                            Apply {maxPointsDiscountRs > 0 ? `(−Rs. ${maxPointsDiscountRs})` : "(no balance)"}
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
    // ─────────────────────────────────────────────────────────────────────────

    const formik = useFormik<PurchaseFormValues>({
        initialValues: {
            paymentOption: defaultPaymentOption,
            amount: vat + price,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                // Apply points on the server before initiating payment
                if (discountMode === "points" && pointsApplied && maxPointsDiscountRs > 0) {
                    // Frontend guard: never send more points than the user actually holds
                    const pointsToDeduct = Math.min(
                        maxPointsDiscountRs * conversionRate,
                        pointsBalance,
                    );
                    if (pointsToDeduct <= 0) throw new Error("Invalid points amount.");
                    await applyPoints({ points: pointsToDeduct }).unwrap();
                    // Flag so failure page can restore if payment gateway fails
                    sessionStorage.setItem(POINTS_SESSION_KEY, "1");
                }

                const couponCode = discountMode === "coupon" && couponResult ? couponResult.code : undefined;

                if (values.paymentOption === "esewa") {
                    const coursePurchaseData = await payViaEsewa({
                        id: isSubscription ? Number(courseId) : Number(id),
                        moduleType: isSubscription ? "course" : type as PurchaseModuleTypes,
                        subscriptionId: isSubscription ? selectedSubscriptionId : undefined,
                        coupon_code: couponCode,
                    }).unwrap();
                    if (coursePurchaseData) {
                        const paymentData = coursePurchaseData?.data;

                        const esewaParams = {
                            amount: paymentData?.amount,
                            tax_amount: paymentData?.tax_amount,
                            total_amount: paymentData?.total_amount,
                            transaction_uuid: paymentData?.transaction_uuid,
                            product_code: paymentData?.product_code,
                            product_service_charge: paymentData?.product_service_charge || "0",
                            product_delivery_charge: paymentData?.product_delivery_charge || "0",
                            success_url: paymentData?.success_url,
                            failure_url: paymentData?.failure_url,
                            signed_field_names: "total_amount,transaction_uuid,product_code",
                            signature: paymentData?.signature,
                        };
                        submitEsewaForm(ESEWA_CONFIG.PAYMENT_URL, esewaParams);
                    }
                } else if (values.paymentOption === "khalti") {
                    const response = await payViaKhalti({
                        id: isSubscription ? Number(courseId) : Number(id),
                        type: values.paymentOption,
                        moduleType: isSubscription ? "course" : type as PurchaseModuleTypes,
                        amount: finalPrice,
                        subscriptionId: isSubscription ? selectedSubscriptionId : undefined,
                        coupon_code: couponCode,
                    }).unwrap();
                    const paymentUrl = response?.data?.payment_url;
                    if (paymentUrl) {
                        window.location.replace(paymentUrl);
                    } else {
                        dispatch(showToast({
                            message: "Unable to proceed for payment. Try Again Later.",
                            severity: "error"
                        }));
                    }
                }

            } catch (e: any) {
                console.error("Payment Error:", e);
                // Payment initiation failed after points were applied — restore them immediately
                if (sessionStorage.getItem(POINTS_SESSION_KEY)) {
                    try { await restorePoints().unwrap(); } catch {}
                    sessionStorage.removeItem(POINTS_SESSION_KEY);
                }
                dispatch(showToast({
                    message: e?.data?.message || "Unable to proceed for payment. Try Again Later.",
                    severity: "error"
                }));
            }
        }
    });

    return (
        <div className="purchase__options overflow-auto pb-4 px-1">
            <Button
                variant="text"
                startIcon={<ArrowLeft />}
                onClick={() => navigate(-1)}
            >
                Back to {isSubscription ? "Course" : type} Details
            </Button>

            <PageHeader
                breadcrumb={[{ title: "Choose Payment" }]}
                description="Choose the payment according to your will."
            />

            <form onSubmit={formik.handleSubmit}>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="col-span-1">
                        {isSubscription && subscriptionPlans.length > 0 && (
                            <div className="mb-6 flex flex-col gap-3">
                                <Typography variant="body2" fontWeight={500}>Subscription Plans</Typography>
                                {subscriptionPlans.map((plan) => (
                                    <div key={plan.id}>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={plan.id === selectedSubscriptionId}
                                                        onChange={() => setSelectedSubscriptionId(plan.id)}
                                                        sx={(theme: any) => ({
                                                            color: theme.palette.gray.gray2,
                                                            "&.Mui-checked": { color: theme.palette.primary.main }
                                                        })}
                                                    />
                                                }
                                                label={<Typography variant="subtitle2">{plan.name}</Typography>}
                                            />
                                            <Typography variant="subtitle2">NRs. {plan.price} / {plan.number} {plan.billing_cycle}</Typography>
                                        </div>
                                        <Divider />
                                    </div>
                                ))}
                            </div>
                        )}
                        <PurchasePaymentOption
                            options={paymentOptions}
                            selected={formik.values.paymentOption}
                            onSelect={(value) => formik.setFieldValue("paymentOption", value)}
                        />

                        <div className="mt-6 hidden lg:block">
                            <PurchaseGuideLines />
                            <div className="mt-4 lg:mt-6">
                                <Quote icon={<Phone />} message='If you experience any issues during the payment process or have any questions, please feel free to contact our support team for assistance at ' phone='' />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <CoursePaymentCard
                            data={isSubscription ? { ...data, sale_price: activePlan?.price ?? "0" } : data}
                            vat={vat}
                            discountAmount={totalDiscount}
                            isLoading={payingViaEsewa || isKhaltiLoading || applyingPoints}
                            discountSection={discountSection}
                        />
                        <div className="mt-4 lg:mt-6 lg:hidden">
                            <PurchaseGuideLines />
                            <div className="mt-4 lg:mt-6">
                                <Quote icon={<Phone />} message='If you experience any issues during the payment process or have any questions, please feel free to contact our support team for assistance at ' phone='' />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
