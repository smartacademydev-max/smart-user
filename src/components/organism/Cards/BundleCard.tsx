import { Box, Button, Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { SetProps } from "../../../types/question";

export default function BundleCard({ data }: { data: SetProps }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <Box className="relative p-4" sx={{
            border: (theme) => `1px solid ${theme.palette.separator.dark}`,
            borderRadius: "8px"
        }}>
            <Box className="layer__01 absolute left-1/2 -translate-x-1/2 -top-1.5 -z-1" sx={{
                width: "calc(100% - 12px)",
                height: "8px",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                background: (theme) => theme.palette.primary.light
            }} />
            <Box className="layer__02 absolute left-1/2 -translate-x-1/2 -top-3 -z-2" sx={{
                width: "calc(100% - 32px)",
                height: "8px",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                background: (theme) => theme.palette.primary.light
            }} />
            <Box className="image__wrapper aspect-315/114 rounded-sm overflow-hidden mb-3" sx={{
                background: (theme) => theme.palette.primary.dark
            }}>
                <img src={data.thumbnail_url} alt="" className="max-w-full h-auto" />
            </Box>
            <Typography variant="h6" fontWeight={600} className="line-clamp-2">{data?.name}</Typography>
            <Divider className="my-2!" />

            <div className="flex justify-start gap-2">
                <Typography variant="h3" fontWeight={600}>{data?.set_count}</Typography>
                <div className="set__info">
                    <Typography variant="subtitle2" color="text.middle">No. of Set</Typography>
                    <Typography variant="subtitle2">({data?.sets?.objective} Mcqs {data?.sets?.subjective} Subjective {data?.sets?.omr} OMR)</Typography>
                </div>
            </div>
            <Divider className="my-2!" />
            <div className="flex  justify-between flex-wrap gap-4">

                <div className="price__details">
                    <Typography variant="subtitle2" color="text.middle">Price</Typography>
                    <Typography variant="subtitle1" fontWeight={600}><Typography
                        sx={{
                            textDecoration: "line-through",
                            color: "text.secondary",
                        }}
                        variant="caption"
                    >
                        {t("messages.npr")}{data?.marked_price}
                    </Typography> {t("messages.npr")}{data?.sale_price}</Typography>
                </div>
                <Button variant="contained" color="primary" onClick={() => navigate(PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.VIEW_BUNDLE.ROOT(data.id))}>{t("actions.view")}{t("messages.sets")}</Button>
            </div>
        </Box>
    )
}
