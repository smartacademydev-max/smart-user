import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { UserReferralStats } from "../../../types/referral";

interface Props {
    stats?: UserReferralStats;
    isLoading: boolean;
    conversionRate: number;
}

export default function ReferralStatsCards({ stats, isLoading, conversionRate }: Props) {
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={24} />
            </Box>
        );
    }
    if (!stats) return null;

    const cards = [
        {
            label: "Total Referred",
            value: stats.total_referred,
            icon: <PeopleIcon fontSize="small" />,
            color: "#1976d2",
            bg: "rgba(25, 118, 210, 0.08)",
        },
        {
            label: "Converted",
            value: stats.total_converted,
            icon: <CheckCircleIcon fontSize="small" />,
            color: "#2e7d32",
            bg: "rgba(46, 125, 50, 0.08)",
        },
        {
            label: "Points from Referrals",
            value: `${stats.points_from_referrals} pts`,
            icon: <StarIcon fontSize="small" />,
            color: "#ed6c02",
            bg: "rgba(237, 108, 2, 0.08)",
        },
        {
            label: "Total Balance",
            value: `${stats.total_points_balance} pts`,
            sub: `≈ Rs. ${Math.floor(stats.total_points_balance / conversionRate)}`,
            icon: <AccountBalanceWalletIcon fontSize="small" />,
            color: "#7b1fa2",
            bg: "rgba(123, 31, 162, 0.08)",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card) => (
                <Box
                    key={card.label}
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 2.5,
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: card.bg,
                            color: card.color,
                            mb: 1.5,
                        }}
                    >
                        {card.icon}
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                        {card.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                        {card.value}
                    </Typography>
                    {card.sub && (
                        <Typography variant="caption" color="text.secondary">
                            {card.sub}
                        </Typography>
                    )}
                </Box>
            ))}
        </div>
    );
}
