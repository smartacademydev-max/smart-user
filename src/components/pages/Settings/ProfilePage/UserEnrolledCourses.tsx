import { Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetUserPurchasedCourseQuery } from "../../../../services/courseApi";
import type { CourseProps } from "../../../../types/course";
import { getCourseStatus } from "../../../../utils/statusMap";
import StatusPill from "../../../atom/StatusPill";
import CustomTable from "../../../molecules/Table";

export default function UserEnrolledCourses() {
    const { t } = useTranslation();
    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 50,
    });
    const { data, isLoading } = useGetUserPurchasedCourseQuery({ ...qp });

    const courses = data?.data?.data || [];


    const columns = useMemo<ColumnDef<CourseProps>[]>(() => [
        {
            header: "S.No",
            accessorKey: "index",
            cell: ({ row }) => (
                <Typography fontWeight={500} variant="subtitle1">
                    {row.index + 1 || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Course Name",
            accessorKey: "name",
            cell: ({ row }) => (
                <Tooltip title={row.original.name} arrow>
                    <Typography fontWeight={500} variant="subtitle1" className="line-clamp-1">
                        {row.original.name || "N/A"}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            header: "Price",
            accessorKey: "price",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original.sale_price || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Purchased Date",
            accessorKey: "purchased_date",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original.started_from || "N/A"}
                </Typography>
            ),
        },
        {
            header: "End Date",
            accessorKey: "end_date",
            cell: ({ row }) => (
                <Typography variant="subtitle1" className="capitalize">
                    {row.original?.ends_at || "N/A"}
                </Typography>
            ),
        },
        {
            header: "Status",
            accessorKey: "course_completion_status",
            cell: ({ row }) => {
                const progress = Number(row.original?.progress ?? 0);

                const getLabel = () => {
                    if (progress === 0) return "Not Started";
                    if (progress === 100) return "Completed";
                    return "In Progress";
                };

                return (
                    <StatusPill
                        status={getLabel()}
                        variant={getCourseStatus(progress)}
                    />
                );
            },
        },


    ], [qp])

    if (!courses.length) {
        return null;
    }
    return (
        <div className="user__enrolled__course__root mt-6 lg:mt-8">
            <Typography variant="h5" className="mb-4!" fontWeight={600}>{t("messages.enrolled_courses")}</Typography>
            <CustomTable
                data={courses}
                columns={columns}
                loading={isLoading}
            />
        </div>
    )
}
