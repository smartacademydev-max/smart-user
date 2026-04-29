import {
    Box,
    Chip,
    CircularProgress,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useGetUserPointsTransactionsQuery } from "../../../services/referralApi";
import type { PointsTransactionType } from "../../../types/referral";
import { formatDate } from "../../../utils/dateFormat";

const PAGE_SIZE = 10;

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

    return (
        <Box>
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
                        No points transactions yet.
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{ overflowX: "auto" }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Action</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">Points</TableCell>
                                    <TableCell align="right">Balance After</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            <Typography variant="body2">{row.action_label}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.transaction_type}
                                                size="small"
                                                color={row.transaction_type === "earned" ? "success" : "error"}
                                                sx={{ textTransform: "capitalize" }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                color={row.transaction_type === "earned" ? "success.main" : "error.main"}
                                            >
                                                {row.transaction_type === "earned" ? "+" : "−"}{row.points}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" color="text.secondary">
                                                {row.balance_after} pts
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
