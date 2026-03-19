import { Box, Divider, Typography } from "@mui/material";
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


    return (
        <div className="liveclass__test__filter mb-8">
            <Typography variant="h4" fontWeight={600}>Calendar</Typography>
            <Divider className="my-4!" />
            <div className="2xl:grid 2xl:grid-cols-12 gap-6">
                <div className="col-span-12 2xl:col-span-4">
                    <DashboardCalendar onDateSelect={(adDate) => {
                        setCustomRange((prev) => ({
                            ...prev,
                            startDate: formatLocalDate(adDate),
                        }));
                    }} />
                </div>
                <div className=" lg:col-span-8 h-full">
                    <div className="grid lg:grid-cols-2 h-full gap-6">
                        <div className="col-span-1 h-full">
                            <Box sx={{
                                padding: "16px 4px",
                                border: (theme) => `1px solid ${theme.palette.separator.dark}`,
                                borderRadius: "8px",
                                height: "100%"
                            }}>
                                <Typography variant="h5" fontWeight={600} className="px-4">{t("menus.liveClasses")}</Typography>
                                <div className="mt-4 flex flex-col gap-4 max-h-[530px] px-4 overflow-auto">
                                    {data?.data?.data && data?.data?.data.length > 0 ? data?.data?.data?.map((item) => <LiveClassCard data={item} />) : <EmptyList title="No Class Found" description="You don't have Any Live Class For Today." />}
                                </div>
                            </Box>
                        </div>
                        <div className="col-span-1 h-full">
                            <Box sx={{
                                padding: "16px 4px",
                                border: (theme) => `1px solid ${theme.palette.separator.dark}`,
                                borderRadius: "8px",
                                height: "100%"
                            }}>
                                <Typography variant="h5" fontWeight={600} className="px-4">{t("menus.test")}</Typography>
                                <div className="mt-4 flex flex-col gap-4 max-h-[530px] px-4 overflow-auto">
                                    {tests?.data?.data && tests?.data?.data.length > 0 ? tests?.data?.data?.map((item) => <TestCard test={item} havePurchased={false} />) : <EmptyList title="No Test Found" description="You don't have Any Test For Today." />}
                                </div>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
