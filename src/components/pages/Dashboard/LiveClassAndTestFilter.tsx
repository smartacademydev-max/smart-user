import { Box, Typography } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import { useGetAllLiveClassesQuery } from "../../../services/liveApi";
import { useGetUserAllTestQuery } from "../../../services/testApi";
import { EmptyList } from "../../molecules/EmptyList";
import LiveClassCard from "../../organism/Cards/LiveClassCard";
import TestCard from "../../organism/Cards/TestCard";
import DashboardCalendar from "./DashboardCalendar";

export default function LiveClassAndTestFilter() {
    const today = new Date();

    const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [customRange, setCustomRange] = useState({
        startDate: today.toISOString().split("T")[0],
        endDate: ""
    });
    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 12,
    })

    const { data } = useGetAllLiveClassesQuery({
        ...qp,
        ...customRange,
    });
    const { data: tests } = useGetUserAllTestQuery({
        ...qp,
        ...customRange,
    });

    const cardSx = {
        background: (theme: any) => theme.palette.background.paper,
        border: (theme: any) => `1px solid ${theme.palette.divider}`,
        borderRadius: '14px',
        padding: '15px',
    };

    return (
        <>
            {/* Calendar Card */}
            <Box sx={cardSx}>
                <Typography variant="subtitle1" fontWeight={700} mb={1.5} sx={{ fontSize: '14.5px' }}>
                    Calendar
                </Typography>
                <DashboardCalendar onDateSelect={(adDate) => {
                    setCustomRange((prev) => ({
                        ...prev,
                        startDate: formatLocalDate(adDate),
                    }));
                }} />
            </Box>

            {/* Live Classes Card */}
            <Box sx={cardSx}>
                <div className="flex items-center justify-between mb-2.5">
                    <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '14.5px' }}>
                        {t("menus.liveClasses")}
                    </Typography>
                    <Box component="span" sx={{
                        fontSize: '10px', fontWeight: 700,
                        padding: '2px 8px', borderRadius: '99px',
                        background: '#ECFDF5', color: '#065F46',
                    }}>
                        Today
                    </Box>
                </div>
                <div className="flex flex-col gap-3 max-h-72 overflow-auto">
                    {data?.data?.data && data.data.data.length > 0
                        ? data.data.data.map((item) => (
                            <LiveClassCard key={item.id} data={item} />
                        ))
                        : <EmptyList title="No Class Today" description="No live classes scheduled for this date." />
                    }
                </div>
            </Box>

            {/* Tests Card */}
            <Box sx={cardSx}>
                <Typography variant="subtitle1" fontWeight={700} mb={1.5} sx={{ fontSize: '14.5px' }}>
                    {t("menus.test")}
                </Typography>
                <div className="flex flex-col gap-3 max-h-72 overflow-auto">
                    {tests?.data?.data && tests.data.data.length > 0
                        ? tests.data.data.map((item, i) => (
                            <TestCard key={i} test={item} havePurchased={false} />
                        ))
                        : <EmptyList title="No Tests" description="No tests scheduled for this date." />
                    }
                </div>
            </Box>
        </>
    );
}
