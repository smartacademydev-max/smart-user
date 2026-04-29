import {
    Box,
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useGetUserReferralsQuery } from "../../../services/referralApi";
import type { ReferralStatus } from "../../../types/referral";
import { formatDate } from "../../../utils/dateFormat";

const STATUS_COLOR: Record<ReferralStatus, "default" | "info" | "success"> = {
    pending: "default",
    registered: "info",
    purchased: "success",
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

    return (
        <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                My Referrals
            </Typography>

            {isFetching ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress size={24} />
                </Box>
            ) : rows.length === 0 ? (
                <Box
                    sx={{
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                        py: 6,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        No referrals yet. Share your link to start earning points!
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{ overflowX: "auto" }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Referred User</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Points Earned</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {row.referred_user_name ?? "—"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                size="small"
                                                color={STATUS_COLOR[row.status]}
                                                sx={{ textTransform: "capitalize" }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                color={row.points_earned > 0 ? "success.main" : "text.secondary"}
                                            >
                                                {row.points_earned > 0 ? `+${row.points_earned}` : "—"} pts
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(row.created_at)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        rowsPerPage={PAGE_SIZE}
                        onPageChange={(_e, newPage) => setPage(newPage)}
                        rowsPerPageOptions={[PAGE_SIZE]}
                    />
                </>
            )}
        </Box>
    );
}
