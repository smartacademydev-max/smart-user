import { Button, Typography } from '@mui/material';
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
    if (!gorkhapatras.length) {
        return null;
    }

    return (

        <div className="gorkhapatra__dashboard__listing mb-8">
            <div className="flex justify-between items-center gap-4">
                <Typography variant="h4" fontWeight={600} className="mb-4! mt-8!">{t("messages.gorkhapatra")}</Typography>
                <Button variant="contained" onClick={() => navigate(PATH.GORKHAPATRA.ROOT)}>{t("actions.view_all")}</Button>
            </div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {isLoading ? Array.from({ length: 4 }).map((_, index) =>
                    <GorkhapatraCardSkeleton key={index + "gorkhapatra"} />) : gorkhapatras.map((gorkhapatra) => (
                        <GorkhapatraCard
                            data={gorkhapatra} key={gorkhapatra.title + gorkhapatra.id}
                        />
                    ))}
            </div>
        </div>
    )
}
