import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CourseTypeProps } from '../../../../types/course';

export default function CourseCardButton({ courseType, sellingPrice, markedPrice, to, havePurchased, freeTrialCount }: { courseType: CourseTypeProps, sellingPrice?: string, markedPrice?: string, to: string, havePurchased: boolean; freeTrialCount: number }) {
    const { t } = useTranslation();
    const renderPrice = () => {
        switch (courseType) {
            case "free":
                return (
                    <div className="free__price">
                        <span className='text-[12px]!  block leading-3.5'>This course is free. You can learn anytime you want.</span>
                    </div>
                );

            case "expiry":
                return (
                    <div className="expiry__price flex gap-1 items-end">
                        {markedPrice ? <Typography variant='caption' color='text.middle' className='text-nowrap'><del>{t("messages.npr")} {markedPrice}</del></Typography> : ""}
                        {sellingPrice ? <Typography variant='subtitle1' fontWeight={600} className='text-nowrap'>{t("messages.npr")} {sellingPrice}</Typography> : ""}
                    </div>
                );

            case "subscription":
                return (
                    <div className="subscription__price">
                        <Typography className='text-[8px]! lg:text-[12px]!' color='text.middle'>{t("messages.starting_from")}</Typography>
                        {sellingPrice ? <Typography variant='subtitle1' fontWeight={600}>{t("messages.npr")} {sellingPrice}</Typography> : ""}
                    </div>
                );
        }
    };

    const renderButton = () => {
        if (courseType === "free") {
            return (
                <Button href={to} fullWidth variant="contained" color='primary'>
                    {t("messages.start_learning")}
                </Button>
            );
        }
        return (
            <Button href={to} fullWidth variant="contained" color='primary'>
                {freeTrialCount > 3 ? t("messages.purchase") : havePurchased ? t("messages.continue_learning") : t("messages.enroll_now")}
            </Button>
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="pricing__box">
                {renderPrice()}
            </div>

            <div className="button__wrapper text-right w-full">
                {renderButton()}
            </div>
        </div>
    );
}
