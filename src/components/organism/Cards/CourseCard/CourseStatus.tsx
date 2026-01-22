import { Typography, useTheme } from '@mui/material';
import type { CourseTypeProps } from '../../../../types/course';

export default function CourseStatus({ status }: { status: CourseTypeProps }) {
    const theme = useTheme();

    const getStyles = () => {
        switch (status) {
            case "expiry":
                return {
                    background: theme.palette.error.main,
                    color: theme.palette.background.default
                };
            case "subscription":
                return {
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                };
            default: // free
                return {
                    background: theme.palette.success.main,
                    color: theme.palette.background.default
                };
        }
    };

    return (
        <Typography
            className="text-center py-1! px-2! rounded-md! text-xs! max-w-fit font-medium! capitalize!"
            sx={getStyles()}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Typography>
    );
}
