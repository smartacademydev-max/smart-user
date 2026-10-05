import { Box, Button, Dialog, DialogContent, IconButton, Typography, useTheme } from "@mui/material";
import { CloseCircle } from "iconsax-reactjs";
import { useNavigate, useParams } from "react-router-dom";
import { usePaymentGateways } from "../../../hooks/usePaymentGateways";
import { PATH } from "../../../routes/PATH";
import { usePurchaseCourseMutation } from "../../../services/courseApi";
import { resetPurchase } from "../../../slice/purchaseSlice";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import type { CourseTypeProps } from "../../../types/course";

export default function PurchaseCourseDialog({ type }: { type?: CourseTypeProps }) {
    const theme = useTheme();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const purchase = useAppSelector((state) => state.purchase);
    const user = useAppSelector((state) => state.auth.user);
    const { anyActive, isLoading: gatewaysLoading } = usePaymentGateways();
    const canPurchase = gatewaysLoading || anyActive;
    const [purchaseCourse, { isLoading: enrolling }] = usePurchaseCourseMutation();

    const handlePurchaseClose = () => {
        dispatch(resetPurchase());
    };

    // Subscription plans are picked in the course banner (BannerCourseTypeModule) — there is
    // no standalone plans route. Scroll to it, or open the course page when it isn't on screen.
    const goToPlans = () => {
        dispatch(resetPurchase());
        const enrollment = document.getElementById("course-enrollment");
        if (enrollment) {
            enrollment.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            navigate(PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(Number(id)));
        }
    };

    // Same request as the free course's button in BannerCourseTypeModule
    const enrollFree = async () => {
        try {
            const response = await purchaseCourse({
                body: {
                    payment_method: "free",
                    transaction_amount: "0",
                    transaction_status: "success",
                    transaction_id: `SMART-TXN-${new Date()}-${user?.id}-${id}`,
                    reference_id: `SMART-INVOICE-${new Date()}-${user?.id}-${id}`,
                    is_trial: false,
                },
                id: Number(id),
                moduleType: "course",
            }).unwrap();
            dispatch(showToast({ message: response?.message || "Enrolled Successfully", severity: "success" }));
            dispatch(resetPurchase());
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Something went wrong. Try again Later.", severity: "error" }));
        }
    };

    const renderButton = () => {
        switch (type) {
            case "expiry":
                return canPurchase ? (
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        className="primary__btn"
                        onClick={() => {
                            navigate(PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.ROOT(Number(id), "course"));
                            dispatch(resetPurchase())
                        }}
                    >
                        Purchase Course
                    </Button>
                ) : null;

            case "subscription":
                return (
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        className="primary__btn"
                        onClick={goToPlans}
                    >
                        Explore Plans
                    </Button>
                );

            case "free":
                return (
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        className="primary__btn"
                        disabled={enrolling}
                        onClick={enrollFree}
                    >
                        {enrolling ? "Enrolling..." : "Enroll Now"}
                    </Button>
                );
        }
    };

    return (
        <Dialog
            open={purchase.open}
            sx={{
                "& .Muipaper-root": {
                    background: theme.palette.primary.contrastText,
                },
            }}
        >
            <DialogContent
                className="py-8! px-13! rounded-2xl relative"
                sx={{
                    minWidth: "409px",
                    background: theme.palette.primary.contrastText,
                }}
            >
                <IconButton
                    className="absolute! right-2 top-2"
                    onClick={handlePurchaseClose}
                >
                    <CloseCircle
                        variant="Bulk"
                        color={theme.palette.error.main}
                    />
                </IconButton>

                <Box
                    sx={{ background: theme.palette.primary.light }}
                    className="rounded-full min-w-20 h-20 aspect-square flex items-center justify-center mb-6"
                >
                    <img src="/no-money.svg" alt="" className="object-contain" />
                </Box>

                <Typography variant="h3" fontWeight={600}>
                    {purchase.title}
                </Typography>

                <Typography
                    variant="subtitle1"
                    color="text.middle"
                    className="block mt-4"
                >
                    {purchase.message}
                </Typography>

                <div className="action__group flex gap-4 mt-8">
                    {renderButton()}
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        className="secondary__btn"
                        onClick={handlePurchaseClose}
                    >
                        Back to Course Details
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
