import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import { usePurchaseCourseMutation } from "../../../services/courseApi";
import { setPurchase } from "../../../slice/purchaseSlice";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import type { CourseExpiry, CourseSubscription, CourseTypeProps } from '../../../types/course';

interface Props {
    courseType?: CourseTypeProps;
    courseExpiry?: CourseExpiry;
    courseSubscription?: CourseSubscription[];
    purchaseStatus?: {
        has_taken_freetrial: false,
        is_free_trial_valid: false,
        has_purchased: false
    }
    canTakeFreeTrial?: boolean;
}



export default function BannerCourseTypeModule({ courseType, courseExpiry, courseSubscription, purchaseStatus, canTakeFreeTrial }: Props) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [purchaseCourse, isLoading] = usePurchaseCourseMutation();
    const user = useAppSelector((state) => state.auth.user);

    const getFreeTrialLabel = () => {
        if (!purchaseStatus?.has_taken_freetrial) {
            return t("messages.free_trial");
        }

        if (purchaseStatus?.has_taken_freetrial && purchaseStatus?.is_free_trial_valid) {
            return "Free Trial Ongoing";
        }

        return t("messages.free_trial_already_taken");
    };

    const renderButtons = () => {
        if (courseType === "free") {
            return <Button variant="contained" className="black__btn" fullWidth onClick={async () => {
                try {

                    const response = await purchaseCourse({
                        body: {
                            payment_method: "free",
                            transaction_amount: "0",
                            transaction_status: "success",
                            transaction_id: `UDAAN-TXN-${new Date()}-${user?.id}-${id}`,
                            reference_id: `UDAAN-INVOICE-${new Date()}-${user?.id}-${id}`,
                            is_trial: false,
                        },
                        id: Number(id),
                        moduleType: "course"
                    });
                    dispatch(
                        showToast({
                            message: response?.data?.message || "Enrolled Successfully",
                            severity: "success"
                        })
                    )
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Something went wrong. Try again Later.",
                            severity: "error"
                        })
                    )
                }
            }}>{!isLoading ? "Assigning Course" : t("messages.start_learning")}</Button>;
        }
        return (
            <div className="actions flex flex-col gap-2">
                {courseType === "subscription" && <Button variant="contained" className="black__btn" fullWidth onClick={() => {
                    navigate(PATH.COURSE_MANAGEMENT.COURSES.PLANS.ROOT)
                }}>View Subscription</Button>}
                {courseType === "expiry" && <Button variant="contained" className="black__btn" fullWidth onClick={() => dispatch(
                    setPurchase({
                        courseId: Number(id),
                        open: true
                    })
                )}>{t("messages.purchase_now")}</Button>}
                {canTakeFreeTrial ? <Button variant="contained" fullWidth className={`white__btn ${!purchaseStatus?.is_free_trial_valid && purchaseStatus?.has_taken_freetrial ? "opacity-60 pointer-events-none" : ""}`} disabled={!purchaseStatus?.is_free_trial_valid && purchaseStatus?.has_taken_freetrial}
                    onClick={async () => {
                        try {
                            const response = await purchaseCourse({
                                body: {
                                    payment_method: "free",
                                    transaction_amount: "0",
                                    transaction_status: "success",
                                    transaction_id: `TXN-FREE-${user?.id}-${id}`,
                                    reference_id: `RFF-FREE-${user?.id}-${id}`,
                                    is_trial: true,
                                },
                                id: Number(id),
                                moduleType: "course"
                            }).unwrap();
                            dispatch(
                                showToast({
                                    message: response?.message || "Enrolled Successfully",
                                    severity: "success"
                                })
                            )
                        }
                        catch (e: any) {
                            dispatch(
                                showToast({
                                    message: e?.data?.message || "Something went wrong. Try again Later.",
                                    severity: "error"
                                })
                            )
                        }
                    }}
                >{getFreeTrialLabel()}</Button> : ""}
            </div>
        );
    };

    const renderContent = () => {
        switch (courseType) {
            case "free":
                return (
                    <div className="free__course flex flex-col gap-4">
                        <Typography color="white" variant="body2" fontWeight={500}>Course Includes</Typography>
                        <ul className="list-disc pl-5 text-white">
                            <li>Allow students to access quality learning materials.</li>
                            <li>Encourage new users to explore the platform.</li>
                            <li>Promote lifelong learning with easily accessible resources.</li>
                        </ul>
                        {renderButtons()}
                    </div>
                );

            case "expiry":

                return (
                    <div className="expiry flex flex-col gap-4">
                        <Typography color="white" variant="body2" fontWeight={500}>Expiry Course</Typography>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Typography variant="caption" color="white">Starts from</Typography>
                                <Typography variant="subtitle2" color="white" className="block" fontWeight={600}>{courseExpiry?.start_date}</Typography>
                            </div>
                            <div>
                                <Typography variant="caption" color="white">Ends On</Typography>
                                <Typography variant="subtitle2" color="white" className="block" fontWeight={600}>{courseExpiry?.end_date}</Typography>
                            </div>

                        </div>
                        {renderButtons()}
                    </div>
                );

            case "subscription":
                return (
                    <div className="subscription__course flex flex-col gap-4">
                        <Typography color="white" variant="body2" fontWeight={500}>Subscription Plans</Typography>
                        {courseSubscription?.map((plan, index) => (
                            <div key={index} className="grid grid-cols-2 gap-2">
                                <Typography color="white">{plan.name}</Typography>
                                <Typography color="white">NRs. {plan.price} / {plan.number} {plan.billing_cycle}</Typography>
                            </div>
                        ))}
                        {renderButtons()}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="rounded-md p-4 bg-[rgba(255,255,255,0.12)] flex flex-col gap-4">
            {renderContent()}
        </div>
    );
}
