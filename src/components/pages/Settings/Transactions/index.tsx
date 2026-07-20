import { Box, Chip, List, ListItem, Tooltip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetUserInstallmentsQuery } from "../../../../services/installmentApi";
import { useAppSelector } from "../../../../store/hook";
import type { InstallmentFilter, InstallmentRow } from "../../../../types/transactions";
import { formatDateForDisplay } from "../../../../utils/dateFormat";
import { getInstallmentStatus } from "../../../../utils/statusMap";
import StatusPill from "../../../atom/StatusPill";
import EmptyRoute from "../../../organism/EmptyRoute";
import TablePagination from "../../../molecules/Pagination";
import CustomTable from "../../../molecules/Table";

const filterTabs: { label: string; value: InstallmentFilter }[] = [
    { label: "Pending", value: "pending" },
    { label: "Settled", value: "settled" },
    { label: "All", value: "all" },
];

export default function SettingsTransactions() {
    const { t } = useTranslation();
    const user = useAppSelector((state) => state.auth.user);
    const [status, setStatus] = useState<InstallmentFilter>("pending");
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 10 });

    const { data, isLoading, isFetching } = useGetUserInstallmentsQuery(
        { userId: Number(user?.id), status, ...qp },
        { skip: !user?.id },
    );

    const rows = data?.data?.data ?? [];
    const total = data?.data?.pagination?.total ?? 0;
    const totalPages = data?.data?.pagination?.total_pages ?? 0;

    const handleFilterChange = (value: InstallmentFilter) => {
        setStatus(value);
        setQp((prev) => ({ ...prev, pageIndex: 1 }));
    };

    const columns = useMemo<ColumnDef<InstallmentRow>[]>(() => [
        {
            header: "S.No",
            accessorKey: "index",
            cell: ({ row }) => (
                <Typography variant="subtitle1" fontWeight={500}>
                    {(qp.pageIndex - 1) * qp.pageSize + row.index + 1}
                </Typography>
            ),
        },
        {
            header: "Course",
            accessorKey: "course_name",
            cell: ({ row }) => (
                <Tooltip title={row.original.course_name ?? ""} arrow>
                    <Typography variant="subtitle1" fontWeight={500} className="line-clamp-1 capitalize">
                        {row.original.course_name || "N/A"}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            header: "Installment",
            accessorKey: "installment_number",
            cell: ({ row }) => (
                <Typography variant="subtitle1">#{row.original.installment_number}</Typography>
            ),
        },
        {
            header: "Amount",
            accessorKey: "amount",
            cell: ({ row }) => (
                <Typography variant="subtitle1">NRs. {Number(row.original.amount).toLocaleString()}</Typography>
            ),
        },
        {
            header: "Due Date",
            accessorKey: "due_date",
            cell: ({ row }) => (
                <Typography variant="subtitle1">{formatDateForDisplay(row.original.due_date) || "N/A"}</Typography>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => {
                // Drive the red badge off is_overdue (live), not the stored status.
                const effective = row.original.is_overdue && row.original.status !== "paid"
                    ? "overdue"
                    : row.original.status;
                return <StatusPill status={effective} variant={getInstallmentStatus(effective)} />;
            },
        },
        {
            header: "Paid On",
            accessorKey: "paid_at",
            cell: ({ row }) => (
                <Typography variant="subtitle1">
                    {row.original.paid_at ? formatDateForDisplay(row.original.paid_at) : "—"}
                </Typography>
            ),
        },
    ], [qp.pageIndex, qp.pageSize]);

    return (
        <div className="user__installments__root">
            <Box className="flex items-center gap-3 flex-wrap mb-4">
                <Typography variant="h5" fontWeight={600}>
                    {t("messages.my_installments", "My Installments")}
                </Typography>
                {total > 0 && (
                    <Chip
                        size="small"
                        label={status === "settled" ? `${total} settled` : `${total} outstanding`}
                        color={status === "settled" ? "success" : "warning"}
                        variant="outlined"
                    />
                )}
            </Box>

            <List
                sx={{ background: (theme) => theme.palette.tab.background }}
                className="p-1! rounded-md max-w-fit flex items-center mb-6!"
            >
                {filterTabs.map((tab) => (
                    <ListItem
                        className={status === tab.value ? "active__tab__controller" : ""}
                        key={tab.value}
                        onClick={() => handleFilterChange(tab.value)}
                    >
                        <Typography
                            variant="subtitle2"
                            color="text.middle"
                            className="px-6 py-2.5 rounded-md cursor-pointer text-nowrap"
                        >
                            {tab.label}
                        </Typography>
                    </ListItem>
                ))}
            </List>

            {!isLoading && rows.length === 0 ? (
                <EmptyRoute
                    title={t("messages.no_installments", "No Installments")}
                    message={
                        status === "settled"
                            ? "You have no settled installments yet."
                            : "You have no outstanding installments."
                    }
                />
            ) : (
                <>
                    <CustomTable data={rows} columns={columns} loading={isLoading || isFetching} />
                    {totalPages > 1 && (
                        <TablePagination qp={qp} setQp={setQp} totalPages={totalPages} totalRecords={total} />
                    )}
                </>
            )}
        </div>
    );
}
