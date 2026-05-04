import { Chip, MenuItem, Select, TablePagination, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useGetUserPointsTransactionsQuery } from "../../../services/referralApi";
import type { PointsTransaction, PointsTransactionType } from "../../../types/referral";
import { formatDate } from "../../../utils/dateFormat";
import CustomTable from "../../molecules/Table";

const PAGE_SIZE = 10;

function formatActionType(actionType: string): string {
    return actionType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PointsHistoryTab() {
    const [page, setPage] = useState(0);
    const [typeFilter, setTypeFilter] = useState<PointsTransactionType | "">("");

    const { data, isFetching } = useGetUserPointsTransactionsQuery({
        pageIndex: page + 1,
        pageSize: PAGE_SIZE,
        transaction_type: typeFilter,
    });

    const rows = data?.data?.data ?? [];
    const total = data?.data?.pagination?.total ?? 0;

    const columns = useMemo<ColumnDef<PointsTransaction>[]>(
        () => [
            {
                accessorKey: "action_label",
                header: "Action",
                cell: ({ getValue, row }) => {
                    const actionType = row.original.action_type;
                    const label = actionType
                        ? formatActionType(actionType)
                        : (getValue() as string);
                    return label;
                },
            },
            {
                accessorKey: "transaction_type",
                header: "Type",
                cell: ({ getValue }) => {
                    const type = getValue() as PointsTransactionType;
                    return (
                        <Chip
                            label={type}
                            size="small"
                            color={type === "earned" ? "success" : "error"}
                            sx={{ textTransform: "capitalize" }}
                        />
                    );
                },
            },
            {
                accessorKey: "points",
                header: "Points",
                cell: ({ getValue, row }) => {
                    const pts = getValue() as number;
                    const type = row.original.transaction_type;
                    return (
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color={type === "earned" ? "success.main" : "error.main"}
                        >
                            {type === "earned" ? "+" : "−"}
                            {pts}
                        </Typography>
                    );
                },
            },
            {
                accessorKey: "balance_after",
                header: "Balance After",
                cell: ({ getValue }) => `${getValue() as number} pts`,
            },
            {
                accessorKey: "created_at",
                header: "Date",
                cell: ({ getValue }) => (
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(getValue() as string)}
                    </Typography>
                ),
            },
        ],
        []
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Typography variant="subtitle1" fontWeight={600}>
                    Points History
                </Typography>
                <Select
                    size="small"
                    value={typeFilter}
                    onChange={(e) => {
                        setTypeFilter(e.target.value as PointsTransactionType | "");
                        setPage(0);
                    }}
                    displayEmpty
                    sx={{ minWidth: 140 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="earned">Earned</MenuItem>
                    <MenuItem value="spent">Spent</MenuItem>
                </Select>
            </div>

            {!isFetching && rows.length === 0 ? (
                <div className="border border-dashed rounded-lg py-12 text-center">
                    <Typography variant="body2" color="text.secondary">
                        No points transactions yet.
                    </Typography>
                </div>
            ) : (
                <>
                    <CustomTable
                        data={rows}
                        columns={columns}
                        loading={isFetching}
                        skeletonRows={5}
                    />
                    {total > PAGE_SIZE && (
                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            rowsPerPage={PAGE_SIZE}
                            onPageChange={(_e, newPage) => setPage(newPage)}
                            rowsPerPageOptions={[PAGE_SIZE]}
                        />
                    )}
                </>
            )}
        </div>
    );
}
