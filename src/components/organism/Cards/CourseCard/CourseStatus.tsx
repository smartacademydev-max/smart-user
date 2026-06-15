import { Typography, useTheme } from '@mui/material';
import type { CourseTypeProps } from '../../../../types/course';

interface Props {
    status: CourseTypeProps;
    label?: string;
}

export default function CourseStatus({ status, label }: Props) {
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

    const displayText = label?.trim()
        ? label
        : status === "expiry"
            ? "Till Exam Date"
            : status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <Typography
            className="text-center py-1! px-2! rounded-md! text-xs! max-w-fit font-medium! capitalize!"
            sx={getStyles()}
        >
            {displayText}
        </Typography>
    );
}
