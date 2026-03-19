
import { Phone } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import { ArrowLeft } from 'iconsax-reactjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCourseByIdQuery, usePurchaseCourseWithEsewaMutation, usePurchaseWithKhaltiMutation } from "../../../services/courseApi";
import { useGetBundleByOverviewQuery, useGetTestOverviewQuery } from '../../../services/testApi';
import { showToast } from '../../../slice/toastSlice';
import { useAppDispatch } from '../../../store/hook';
import type { PaymentOption, PurchaseFormValues, PurchaseModuleTypes } from "../../../types/purchase";
import Quote from '../../molecules/Quote';
import PageHeader from '../../organism/PageHeader';
import CoursePaymentCard from './CoursePaymentCard';
import PurchaseGuideLines from './PurchaseGuideLines';
import PurchasePaymentOption from './PurchasePaymentOption';

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
    const { id, type } = useParams();
    const paymentOptions: PaymentOption[] = [
        { id: 1, label: "Esewa", value: "esewa", image: "/esewa.svg" },
        { id: 2, label: "Khalti", value: "khalti", image: "/khalti.svg" },
    ];

    const { data: course } = useGetCourseByIdQuery({ id: Number(id) }, { skip: !id || type !== "course" });
    const { data: test } = useGetTestOverviewQuery({ id: Number(id) }, { skip: !id || type !== "test" });
    const { data: bundle } = useGetBundleByOverviewQuery({ id: Number(id) }, { skip: !id || type !== "bundle" })
    const [payViaEsewa, { isLoading: payingViaEsewa }] = usePurchaseCourseWithEsewaMutation();
    const [payViaKhalti, { isLoading: isKhaltiLoading }] = usePurchaseWithKhaltiMutation();

    let data;
    let price = 0;

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
    // const vat = price * 0.13;
    const vat = 0;



    const formik = useFormik<PurchaseFormValues>({
        initialValues: {
            paymentOption: "esewa",
            amount: vat + price,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (values.paymentOption === "esewa") {
                    const coursePurchaseData = await payViaEsewa({ id: Number(id), moduleType: type as PurchaseModuleTypes }).unwrap();

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
                        id: Number(id),
                        type: values.paymentOption,
                        moduleType: type as PurchaseModuleTypes,
                        amount: vat + price
                    }).unwrap();

                    const paymentUrl = response?.data?.payment_url;
                    if (paymentUrl) {
                        window.location.replace(paymentUrl);
                    }
                }

            } catch (e: any) {
                console.error("Payment Error:", e);
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
                Back to {type} Details
            </Button>

            <PageHeader
                breadcrumb={[{ title: "Choose Payment" }]}
                description="Choose the payment according to your will."
            />

            <form onSubmit={formik.handleSubmit}>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="col-span-1">
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
                            data={data}
                            vat={vat}
                            isLoading={payingViaEsewa || isKhaltiLoading}
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