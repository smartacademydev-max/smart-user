import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useGetPointsConfigQuery, useGetUserReferralStatsQuery } from "../../../services/referralApi";
import PageHeader from "../../organism/PageHeader";
import MyReferralCode from "./MyReferralCode";
import MyReferralsTable from "./MyReferralsTable";
import PointsHistoryTab from "./PointsHistoryTab";
import ReferralStatsCards from "./ReferralStatsCards";

export default function ReferralPage() {
    const [tab, setTab] = useState(0);

    const { data: statsData, isLoading: statsLoading } = useGetUserReferralStatsQuery();
    const { data: configData } = useGetPointsConfigQuery();

    const stats = statsData?.data;
    const conversionRate = configData?.data?.conversion_rate ?? 100;

    return (
        <Box className="h-full overflow-auto pb-4 px-1">
            <PageHeader
                breadcrumb={[{ title: "Referrals & Points" }]}
                description="Earn points by referring friends. Redeem them as discounts at checkout."
            />

            <Tabs
                value={tab}
                onChange={(_e, v) => setTab(v)}
                sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider" }}
            >
                <Tab label="My Referrals" />
                <Tab label="Points History" />
            </Tabs>

            {tab === 0 && (
                <>
                    {statsLoading ? (
                        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 3, mb: 4 }}>
                            <Skeleton width={160} height={24} sx={{ mb: 1 }} />
                            <Skeleton width="70%" height={18} sx={{ mb: 2.5 }} />
                            <Skeleton width={120} height={36} sx={{ mb: 2 }} />
                            <Skeleton width="100%" height={42} sx={{ mb: 2.5 }} />
                            <Box display="flex" gap={1}>
                                <Skeleton width={100} height={34} />
                                <Skeleton width={80} height={34} />
                                <Skeleton width={100} height={34} />
                            </Box>
                        </Box>
                    ) : (
                        <MyReferralCode referralCode={stats?.referral_code ?? ""} />
                    )}
                    <ReferralStatsCards
                        stats={stats}
                        isLoading={statsLoading}
                        conversionRate={conversionRate}
                    />
                    <MyReferralsTable />
                </>
            )}

            {tab === 1 && <PointsHistoryTab />}
        </Box>
    );
}
