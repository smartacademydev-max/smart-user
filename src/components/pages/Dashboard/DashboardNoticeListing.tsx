import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../routes/PATH';
import { useGetAllNotificationsQuery } from '../../../services/notificationApi';
import NoticeCard from '../../organism/Cards/NoticeCard';

export default function DashboardNoticeListing() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [qp] = useState({
        pageIndex: 1,
        pageSize: 3,
    });

    const { data, isLoading } = useGetAllNotificationsQuery({
        ...qp,
        type: 'notice_board',
    });
    const notices = data?.data?.data || [];

    if (!notices.length && !isLoading) {
        return null;
    }

    return (
        <Box className="dashboard__notice__listing">
            <div className="flex justify-between items-center mb-3">
                <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '14.5px' }}>
                    {t('messages.notice')}
                </Typography>
                <Box
                    component="span"
                    onClick={() => navigate(PATH.NOTICE.ROOT)}
                    sx={{
                        fontSize: '12px',
                        color: 'primary.main',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        '&:hover': { opacity: 0.7 },
                    }}
                >
                    {t('actions.view_all')} →
                </Box>
            </div>

            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                {notices.map((notice) => (
                    <NoticeCard data={notice} key={notice.title + notice.id} />
                ))}
            </div>
        </Box>
    );
}
