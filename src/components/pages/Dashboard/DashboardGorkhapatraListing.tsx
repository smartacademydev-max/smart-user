import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../routes/PATH';
import { useGetAllGorkhapatraQuery } from '../../../services/gorkhapatraApi';
import GorkhapatraCard from '../../organism/Cards/GorkhapatraCard';
import GorkhapatraCardSkeleton from '../../organism/Cards/GorkhapatraCardLoading';

export default function DashboardGorkhapatraListing() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 4,
    })

    const { data, isLoading } = useGetAllGorkhapatraQuery({
        ...qp,
        status: "published",
    });
    const gorkhapatras = data?.data?.data || []
    if (!gorkhapatras.length && !isLoading) {
        return null;
    }

    return (
        <Box className="gorkhapatra__dashboard__listing">
            <div className="flex justify-between items-center mb-3">
                <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '14.5px' }}>
                    {t("messages.gorkhapatra")}
                </Typography>
                <Box
                    component="span"
                    onClick={() => navigate(PATH.GORKHAPATRA.ROOT)}
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
                    {t("actions.view_all")} →
                </Box>
            </div>

            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, index) =>
                        <GorkhapatraCardSkeleton key={index + "gorkhapatra"} />)
                    : gorkhapatras.map((gorkhapatra) => (
                        <GorkhapatraCard
                            data={gorkhapatra} key={gorkhapatra.title + gorkhapatra.id}
                        />
                    ))
                }
            </div>
        </Box>
    )
}
