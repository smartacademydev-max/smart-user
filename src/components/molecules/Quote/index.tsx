import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetAppSettingsQuery } from "../../../services/settingApi";

export default function Quote({ icon, message, phone }: { icon: React.ReactElement, message: string, phone: string }) {

    const { data } = useGetAppSettingsQuery();
    return (
        <Box className="rounded-md p-3 flex gap-4 " sx={{
            borderLeft: (theme) => `3px solid ${theme.palette.success.main}`,
            background: (theme) => theme.palette.success.light
        }}>
            {icon && icon}
            <Typography variant="subtitle2" color="text.dark" fontWeight={400}>
                {message}
                <Link to={`tel:${data?.data?.support_contact_no}`} className="underline inline-block">
                    <Typography color="primary" variant="subtitle2" fontWeight={400}> {data?.data?.support_contact_no}</Typography>
                </Link>
            </Typography>
        </Box>
    )
}
