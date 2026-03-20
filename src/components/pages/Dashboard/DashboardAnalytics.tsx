import { Box } from '@mui/material';
import { useGetAnalyticsQuery } from '../../../services/dashboardApi';
import DashboardAnalyticsCard from '../../organism/Cards/DashboardAnalyticsCard';
import DashboardAnalyticsLoading from '../../organism/Cards/DashboardAnalyticsCard/Loading';

export default function DashboardAnalytics() {
    const { data: analytics, isLoading } = useGetAnalyticsQuery();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' },
                gap: '10px',
            }}
        >
            {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <DashboardAnalyticsLoading key={i} />
                ))
                : analytics?.data?.map((item, i) => (
                    <DashboardAnalyticsCard
                        data={item}
                        index={i}
                        key={item.description + item.value}
                    />
                ))}
        </Box>
    );
}
