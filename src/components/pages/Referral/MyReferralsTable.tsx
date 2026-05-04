import { Chip, TablePagination, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useGetUserReferralsQuery } from "../../../services/referralApi";
import type { ReferralEntry, ReferralStatus } from "../../../types/referral";
import { formatDate } from "../../../utils/dateFormat";
import CustomTable from "../../molecules/Table";

const STATUS_COLOR: Record<ReferralStatus, "default" | "info" | "success"> = {
    pending: "default",
    registered: "info",
    purchased: "success",
    course_purchased: "success",
    test_purchased: "success",
    bundle_purchased: "success",
};

const STATUS_LABEL: Record<ReferralStatus, string> = {
    pending: "Pending",
    registered: "Registered",
    purchased: "Purchased",
    course_purchased: "Course Purchased",
    test_purchased: "Test Purchased",
    bundle_purchased: "Bundle Purchased",
};

const PAGE_SIZE = 10;

export default function MyReferralsTable() {
    const [page, setPage] = useState(0);

    const { data, isFetching } = useGetUserReferralsQuery({
        pageIndex: page + 1,
        pageSize: PAGE_SIZE,
    });

    const rows = data?.data?.data ?? [];
    const total = data?.data?.pagination?.total ?? 0;

    const columns = useMemo<ColumnDef<ReferralEntry>[]>(
        () => [
            {
                accessorKey: "referred_user_name",
                header: "Referred User",
                cell: ({ getValue }) => (getValue() as string) ?? "—",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ getValue }) => {
                    const status = getValue() as ReferralStatus;
                    return (
                        <Chip
                            label={STATUS_LABEL[status] ?? status}
                            size="small"
                            color={STATUS_COLOR[status] ?? "default"}
                        />
                    );
                },
            },
            {
                accessorKey: "points_earned",
                header: "Points Earned",
                cell: ({ getValue }) => {
                    const pts = getValue() as number;
                    return (
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color={pts > 0 ? "success.main" : "text.secondary"}
                        >
                            {pts > 0 ? `+${pts}` : "—"} pts
                        </Typography>
                    );
                },
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
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                My Referrals
            </Typography>

            {!isFetching && rows.length === 0 ? (
                <div className="border border-dashed rounded-lg py-12 text-center">
                    <Typography variant="body2" color="text.secondary">
                        No referrals yet. Share your link to start earning points!
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
