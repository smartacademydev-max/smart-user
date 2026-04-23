import { Box, Button, Dialog, DialogContent, IconButton, Typography, useTheme } from "@mui/material";
import { CloseCircle } from "iconsax-reactjs";
import { useNavigate, useParams } from "react-router-dom";
import { usePaymentGateways } from "../../../hooks/usePaymentGateways";
import { PATH } from "../../../routes/PATH";
import { resetPurchase } from "../../../slice/purchaseSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import type { AppDispatch } from "../../../store/store";
import type { CourseTypeProps } from "../../../types/course";
const renderButton = (
    type: CourseTypeProps,
    id: string | undefined,
    navigate: (url: string) => void,
    dispatch: AppDispatch,
    canPurchase: boolean
) => {
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
                    onClick={() => {
                        navigate(PATH.COURSE_MANAGEMENT.COURSES.PLANS.ROOT);
                        dispatch(resetPurchase())
                    }}
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
                    onClick={
                        () => {
                            navigate("/purchase");
                            dispatch(resetPurchase())
                        }
                    }  >
                    Enroll Now
                </Button >
            );
    }
};

export default function PurchaseCourseDialog({ type }: { type?: CourseTypeProps }) {
    const theme = useTheme();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const purchase = useAppSelector((state) => state.purchase);
    const { anyActive, isLoading: gatewaysLoading } = usePaymentGateways();
    const canPurchase = gatewaysLoading || anyActive;

    const handlePurchaseClose = () => {
        dispatch(resetPurchase());
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
                    {type && renderButton(type, id, navigate, dispatch, canPurchase)}
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
