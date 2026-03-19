import { Box, Typography } from '@mui/material';
import {
    Notification
} from 'iconsax-reactjs';
import { useReadNotificationMutation } from '../../../services/notificationApi';
import { showToast } from '../../../slice/toastSlice';
import { useAppDispatch } from '../../../store/hook';
import type { NotificationProps } from '../../../types/notification';
import { getTimeDifference } from '../../../utils/formatTime';
import { renderHtml } from '../../../utils/renderHtml';

interface Props {
    data: NotificationProps;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'general':
            return <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.75 20.7501H3.25C1.86929 20.7501 0.75 19.6308 0.75 18.2501M0.75 18.2501V9.43374C0.75 6.44913 0.75 4.95682 1.50662 3.90857C1.75717 3.56144 2.06183 3.25679 2.40895 3.00623C3.45721 2.24961 4.94952 2.24961 7.93413 2.24961C8.91051 2.24961 10.0996 2.30106 11.0858 2.3144C11.985 2.32656 12.4346 2.33265 13.2722 2.18464C14.1097 2.03663 14.1992 2.0026 14.3782 1.93454C15.1482 1.64176 15.8772 1.18641 16.75 0.75V10.2501C16.75 12.1139 16.75 13.0458 16.4455 13.7809C16.0395 14.761 15.2608 15.5397 14.2807 15.9457C13.5456 16.2501 12.6138 16.2501 10.75 16.2501H2.75C1.64543 16.2501 0.75 17.1456 0.75 18.2501Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.75 15.75L14.75 20.75" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M4.75 2.75L4.75 6.75" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>;
        case 'message':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 8L16 12L22 16V8Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 6H4C2.89543 6 2 6.89543 2 8V16C2 17.1046 2.89543 18 4 18H14C15.1046 18 16 17.1046 16 16V8C16 6.89543 15.1046 6 14 6Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>;
        case 'alert':
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21M19 9L14 14L10 10L7 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>;
        default:
            return <Notification size={20} color='#fff' />;
    }
};

const formatTimeAgo = (date: string | number | Date) => {
    const diff = getTimeDifference(date);

    if (diff.days > 0) return `${diff.days} Days ago`;
    if (diff.hours > 0) return `${diff.hours} Hrs ago`;
    if (diff.minutes > 0) return `${diff.minutes} Min ago`;
    return `${diff.seconds} Sec ago`;
};

export default function NotificationCard({ data }: Props) {
    const dispatch = useAppDispatch();
    const [readNotification] = useReadNotificationMutation();

    return (
        <Box className="notification__item  flex flex-wrap gap-3 py-1.5 px-0 lg:px-4 lg:py-3.5 2xl:py-6 2xl:px-6 cursor-pointer last:border-b-0!"
            sx={{
                backgroundColor: (theme) => data?.has_seen ? "transparent" : theme.palette.primary.light,
                borderBottom: (theme) => `1px solid ${theme.palette.separator.darker}`,
            }}
            onClick={async () => {
                try {
                    await readNotification({ id: Number(data.id) }).unwrap();
                    if (data?.external_link) {
                        window.open(data.external_link, "_blank", "noopener,noreferrer");
                    }

                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Something went wrong",
                            severity: "error",
                        }));
                }
            }}>
            <Box
                className="mt-1 text-primary min-w-10 h-10 aspect-square rounded-full flex items-center justify-center"
                sx={{
                    backgroundColor: (theme) => data?.has_seen ? theme.palette.error.main : theme.palette.error.main,
                    color: (theme) =>
                        data?.has_seen
                            ? theme.palette.text.dark
                            : theme.palette.common.white,
                }}
            >
                {getNotificationIcon(data.notification_type)}
            </Box>

            <div className="notification__content flex-1">
                <div className="flex mb-1.5 justify-between items-start gap-4">
                    <Typography
                        variant="h6"
                        color="primary"
                        fontWeight={500}
                        className="line-clamp-1 leading-6!"
                    >
                        {data.title}
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        color="text.middle"
                    >
                        {formatTimeAgo(data.sent_at)}
                    </Typography>
                </div>

                <Typography
                    variant="subtitle2"
                    color="text.dark"
                    className="line-clamp-2 leading-4!"
                >
                    {renderHtml(data.description)}
                </Typography>
            </div>
        </Box >
    );
}
