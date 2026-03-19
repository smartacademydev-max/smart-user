import { Box, Button, Stack, Typography } from "@mui/material";
import { Calendar } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { NotificationProps } from "../../../types/notification";
import { formatDateCustom } from "../../../utils/dateFormat";
import { renderHtml } from "../../../utils/renderHtml";

export default function NoticeCard({ data }: { data: NotificationProps }) {
    const { t } = useTranslation();
    const date = formatDateCustom(data?.sent_at, { shortMonth: true })
    const navigate = useNavigate();
    return (
        <Box sx={{
            background: (theme: any) => theme.palette.background.paper,
            boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.06)",
            border: (theme: any) => `1px solid ${theme.palette.divider}`
        }} className="notice__card p-4! rounded-md h-full flex flex-col justify-between">
            <div className="top">
                <Typography variant="h6" className="mb-2!">{data?.title}</Typography>
                <Typography variant="subtitle1" color="text.middle" className="mb-4! line-clamp-3">{renderHtml(data?.description)}</Typography>
            </div>

            <Stack className="justify-between">
                <Stack className="items-center gap-2">
                    <Calendar size={20} />
                    <Typography variant="subtitle2" color="text.dark">{date}</Typography>
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(PATH.NOTICE.VIEW_NOTICE.ROOT(Number(data?.id)))}
                >{t("messages.view_details")}</Button>
            </Stack>
        </Box>
    )
}
