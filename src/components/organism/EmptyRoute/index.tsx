import { Add } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface Props {
    icon?: React.ReactNode;
    title?: string;
    message?: string;
    cta?: {
        url: string;
        label: string
    };
    handleClick?: () => void;
    variant?: "success" | "error";
}

export default function EmptyRoute({ icon, title, message, cta, handleClick, variant }: Props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div className="empty__roles flex justify-center items-center mt-12">
            <div className="empty_content flex justify-center items-center flex-col gap-6 max-w-[444px] text-center">
                <Box sx={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: variant === "error" ? theme.palette.error.main : theme.palette.success.light
                }} className="flex justify-center items-center ">
                    {icon || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.19C2 19 3.29 20.93 5.56 21.66C6.22 21.89 6.98 22 7.81 22H16.19C17.02 22 17.78 21.89 18.44 21.66C20.71 20.93 22 19 22 16.19V7.81C22 4.17 19.83 2 16.19 2ZM20.5 16.19C20.5 18.33 19.66 19.68 17.97 20.24C17 18.33 14.7 16.97 12 16.97C9.3 16.97 7.01 18.32 6.03 20.24H6.02C4.35 19.7 3.5 18.34 3.5 16.2V7.81C3.5 4.99 4.99 3.5 7.81 3.5H16.19C19.01 3.5 20.5 4.99 20.5 7.81V16.19Z" fill="#1D82F5" />
                        <path d="M11.9999 8C10.0199 8 8.41992 9.6 8.41992 11.58C8.41992 13.56 10.0199 15.17 11.9999 15.17C13.9799 15.17 15.5799 13.56 15.5799 11.58C15.5799 9.6 13.9799 8 11.9999 8Z" fill="#1D82F5" />
                    </svg>}
                </Box>
                <div className="content">
                    <Typography variant="h4" fontWeight={500} className="mb-2! capitalize">{title || t("messages.empty_states.roles.title")}</Typography>
                    <Typography variant="subtitle1" color="text.middle">{message || ""}</Typography>
                </div>
                {cta ? <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => {
                    if (handleClick) {
                        return handleClick()
                    }
                    else {
                        navigate(cta?.url || "")
                    }
                }}>{cta.label || t("messages.empty_states.roles.action")}</Button> : ""}
            </div>
        </div>
    )
}
