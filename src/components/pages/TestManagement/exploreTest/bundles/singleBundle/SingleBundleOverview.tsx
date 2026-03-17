import { Box, Button, Divider, Typography } from "@mui/material";
import { Notepad2, Profile2User, StatusUp } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../../../routes/PATH";
import type { QuestionTypeProps, SetOveriew } from "../../../../../../types/question";
import { renderHtml } from "../../../../../../utils/renderHtml";
import { getTestStatus } from "../../../../../../utils/statusMap";
import StatusPillWithBorder from "../../../../../atom/StatusPillWithBorder";

export default function SingleBundleOverview({ data }: { data: SetOveriew }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-4 lg:gap-0 lg:grid lg:grid-cols-12 items-stretch">
            <Box className="col-span-9 overview__wrapper p-4 lg:rounded-tl-md lg:rounded-bl-md flex gap-2" sx={{
                border: (theme) => `1px solid ${theme.palette.separator.dark}`
            }}>
                {data?.thumbnail_url ? <div className="aspect-222/176 sm:max-w-[222px] rounded-md overflow-hidden">
                    <img src={data?.thumbnail_url} alt={data.name} className="w-full h-full object-cover " />
                </div> : ""}
                <div className="content w-full">
                    <Typography variant="caption" className="mb-2!" fontWeight={500} sx={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        background: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.main,
                        mb: "12px"
                    }}>{data?.selections?.mega_category[0] || "Loksewa"}</Typography>
                    <Typography variant="h3" fontWeight={600} color="text.dark" className="mb-3! ">
                        {data?.name}
                    </Typography>
                    <div className="general__content__box">
                        {renderHtml(data?.description || "")}
                    </div>
                    <Divider className="my-3!" />
                    <div className="flex flex-wrap items-center gap-2">
                        {data?.set_count ? <>
                            <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
                                <Box sx={{ color: (theme) => theme.palette.info.main }}><Notepad2 size={16} variant="Bold" /></Box>  <strong>{data?.set_count}</strong> Total Set
                            </Typography>
                            <Divider orientation="vertical" className="h-6!" sx={{
                                color: (theme) => theme.palette.separator.dark
                            }} />
                        </> : ""}
                        <div className="flex flex-wrap gap-2">
                            {data?.sets.map((item) => <StatusPillWithBorder status={`${item.label} (${item.value})`} variant={getTestStatus(item.label as QuestionTypeProps)} />)}
                        </div>
                        <Divider orientation="vertical" className="h-4!" sx={{
                            color: (theme) => theme.palette.separator.darkest
                        }} />
                        <Typography variant="subtitle1" color="text.dark" className="flex items-center gap-1">
                            <Box sx={{ color: (theme) => theme.palette.info.main }}><Notepad2 size={20} variant="Bold" /></Box>  <strong>{data?.total_questions}</strong> Total Questions
                        </Typography>
                        <Divider orientation="vertical" className="h-4!" sx={{
                            color: (theme) => theme.palette.separator.darkest
                        }} />
                        <Typography variant="subtitle1" color="text.dark" className="flex items-center gap-1">
                            <Box sx={{ color: (theme) => theme.palette.error.main }}><Profile2User size={20} variant="Bold" /></Box>  <strong>{data?.total_questions}</strong> Enrolled
                        </Typography>
                        <Divider orientation="vertical" className="h-4!" sx={{
                            color: (theme) => theme.palette.separator.darkest
                        }} />
                        <Typography variant="subtitle1" color="text.dark" className="flex items-center gap-1">
                            <Box sx={{ color: (theme) => theme.palette.success.main }}><StatusUp size={20} variant="Bold" /></Box>  <strong>{data?.total_questions}</strong> Avg. Score
                        </Typography>
                    </div>
                </div>
            </Box>

            <div className="col-span-3 h-full purchase__wrapper lg:rounded-tr-md lg:rounded-br-md overflow-hidden relative">
                <Box sx={{
                    background: (theme) => theme.palette.primary.light,
                    padding: "16px 32px",
                    height: "100%"
                }}>
                    {data?.discount ? <Typography variant="subtitle2" fontWeight={500} sx={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: (theme) => theme.palette.success.light,
                        color: (theme) => theme.palette.success.main,
                        border: (theme) => `1px solid ${theme.palette.success.main}`,
                        maxWidth: "fit-content",
                        mb: "4px",
                    }}>{data?.discount}{data?.discount_type === "percentage" ? "%" : t("messages.npr")} {t("messages.off")}</Typography> : ""}
                    <Typography variant="h3" color="primary" fontWeight={600}>{t("messages.npr")}{data.sale_price}</Typography>
                    <Typography variant="subtitle2" color="error" className="line-through mt-1.5">{t("messages.npr")}{data.marked_price}</Typography>
                    <Typography variant="caption" color="text.middle">One time payment</Typography>
                    <Button fullWidth variant="contained" color="primary" onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.ROOT(Number(data.id), "bundle"))} className="mt-4!">{t("messages.purchase_now")}</Button>
                    {data?.discount ? <Box className="absolute -top-15 -right-15 w-30! h-30! flex justify-center items-end rotate-45 pb-2" sx={{
                        background: (theme) => theme.palette.error.main,
                    }}>
                        <Typography variant="h6" className="text-white font-medium" >{t("messages.offer")}</Typography>
                    </Box> : ""}
                </Box>
            </div>
        </div>
    )
}
