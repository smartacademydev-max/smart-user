import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { ArrowRight, DocumentText } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { QuestionTypeProps, SetProps } from "../../../types/question";
import { formatDate } from "../../../utils/dateFormat";
import { renderHtml } from "../../../utils/renderHtml";
import { getTestStatus } from "../../../utils/statusMap";
import StatusPillWithBorder from "../../atom/StatusPillWithBorder";

import MyProgress from "../../atom/MyProgress";
import placeholder1 from "/blue-bg.png";
import placeholder2 from "/green-bg.png";
import placeholder3 from "/yellow-bg.png";

export default function BundleCard({ data, placeholderIndex, havePurchased }: { data: SetProps; placeholderIndex: number; havePurchased?: boolean }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const placeholders = [placeholder1, placeholder2, placeholder3];

    const fallbackImage =
        placeholderIndex >= 0
            ? placeholders[placeholderIndex % placeholders.length]
            : "/blue-bg.png";
    return (
        <Paper className="relative overflow-hidden flex flex-col justify-between" sx={{
            borderRadius: "8px",
            background: (theme) => theme.palette.primary.contrastText,
            boxShadow: ` 0 2px 4px 0 rgba(0, 0, 0, 0.20);`
        }}>
            <div className="card__top">
                <Box className="image__wrapper aspect-347/147 rounded-sm rounded-b-none overflow-hidden relative" sx={{
                    background: (theme) => theme.palette.primary.dark
                }}>
                    <img src={data?.thumbnail_url || fallbackImage} alt={data.name} className="w-full h-full object-cover" />
                    {!data?.thumbnail_url && <Typography variant="h6" fontWeight={500} className="line-clamp-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center" >{data?.name}</Typography>
                    }
                    {data?.selections?.mega_category.length > 0 ? <Typography variant="caption" className="absolute top-3.5 left-3.5" sx={{
                        padding: "3px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#fff"
                    }}>{data?.selections?.mega_category[0] || "Loksewa"}</Typography> : ""}

                    {data?.discount ? <Typography variant="subtitle2" fontWeight={500} className="absolute top-3.5 right-3.5" sx={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: (theme) => theme.palette.success.light,
                        color: (theme) => theme.palette.success.main,
                        border: (theme) => `1px solid ${theme.palette.success.main}`,
                    }}>{data?.discount}{data?.discount_type === "percentage" ? "%" : t("messages.npr")} {t("messages.off")}</Typography> : ""}
                </Box>
                <div className="content py-3 px-3.5">
                    {data?.thumbnail_url ? <Typography variant="h6" fontWeight={600} className="line-clamp-2 mb-2!">{data?.name}</Typography> : <div className="line-clamp-2 mb-2.5 general__content__box [&_p]:m-0!">
                        {renderHtml(data?.description || "")}</div>}
                    <div className="flex flex-wrap items-center mb-2">
                        <div className="flex gap-1 items-center">
                            <Box sx={{
                                color: (theme) => theme.palette.info.main
                            }}>
                                <DocumentText variant="Bold" />
                            </Box>
                            <Typography variant="subtitle1" fontWeight={700}>{data?.set_count}</Typography>
                            <Typography variant="subtitle2" fontWeight={400}>{t("messages.total_tests")}</Typography>
                        </div>
                        <Divider orientation="vertical" className="mx-2! lg:mx-2! h-3.5!" />
                        <Typography variant="caption" color="text.middle">{t("messages.published_date")}: {formatDate(data?.created_at || "")}</Typography>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data?.sets.length > 0 && data?.sets.map((item) => <StatusPillWithBorder status={`${item.label} (${item.value})`} variant={getTestStatus(item.label as QuestionTypeProps)} />)}
                    </div>
                    {havePurchased ? <div className="">
                        <div className="flex items-center justify-between">
                            <Typography color="text.middle" sx={{
                                fontSize: "10px !important"
                            }}>Your Progress</Typography>
                            <Typography color="text.dark" fontWeight={500} sx={{
                                fontSize: "10px !important"
                            }}>{data?.progress || 0} % Completed</Typography>
                        </div>
                        <MyProgress progress={data?.progress} />
                    </div> : ""}
                </div>
            </div>
            <Box className="card__bottom py-2.5 px-3.5 flex justify-between items-center flex-wrap gap-2" sx={{
                background: (theme) => theme.palette.primary.light
            }}>
                {havePurchased ? <div className="progress__wrapper">
                    <Typography variant="overline" color="primary" fontWeight={500}>Test completed</Typography>
                    <Typography variant="subtitle2" color="text.dark" fontWeight={600}>{data.completed_set || 0} out of {data.set_count} Tests</Typography>
                </div> : <div className="price__wrapper">
                    <Typography variant="caption" color="primary" fontWeight={500}>{t("messages.price")}</Typography>
                    <div className="flex items-end gap-1">
                        <Typography variant="subtitle1" color="text.dark" fontWeight={600}>{t("messages.npr")}{data?.sale_price}</Typography>
                        <Typography variant="caption" color="text.middle" className="line-through">{t("messages.npr")}{data?.marked_price}</Typography>
                    </div>
                </div>}
                <Button variant="contained" color="primary" onClick={() => navigate(PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.VIEW_BUNDLE.ROOT(data.id))} endIcon={havePurchased ? <ArrowRight /> : ""}>
                    {havePurchased ? t("messages.continue") : t("messages.purchase_now")}
                </Button>
            </Box>
        </Paper>
    )
}
