import { Box, Typography } from "@mui/material";

interface Props {
    icon: React.ReactElement;
    title: string;
    description: string;

}
export default function AnalyticsCard({ icon }: Props) {
    return (
        <Box className="analytics-card p-4 rounded-lg flex justify-between items-center" sx={{
            bgcolor: (theme) => theme.palette.primary.contrastText,
        }}>
            <div className="content__wrapper">
                <Typography variant="h6" color="text.middle" fontWeight={500}>Total Courses</Typography>
                <Typography variant="h3" fontWeight={600} className="mt-5.5!">1,250</Typography>
                <Typography variant="subtitle2" color="text.middle">20% increase in last 4 days</Typography>
            </div>

            <Box className="min-w-16 min-h-16 aspect-square rounded-lg flex items-center justify-center" sx={{
                bgcolor: (theme) => theme.palette.warning.light
            }}>
                {icon}
            </Box>
        </Box>
    )
}
