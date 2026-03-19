import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Calendar, Clock, Medal, Notepad2 } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { TestProps } from "../../../types/question";
import { formatDateTime } from "../../../utils/dateFormat";
import { getTestProgressStatus } from "../../../utils/statusMap";
import StatusPillWithBorder from "../../atom/StatusPillWithBorder";

export default function ExploreTestCard({ test }: { test: TestProps; }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const variant = getTestProgressStatus(test?.has_taken_test ? "completed" : "not_started");

    const markedPrice = test?.marked_price;
    const sellingPrice = test?.sale_price;
    return (
        <Box
            className="test__card rounded-md flex flex-col justify-between p-4"
            sx={{
                border: (theme) => `1px solid ${theme.palette[variant].main}`,
                borderTop: (theme) => `4px solid ${theme.palette[variant].main}`,
            }}
        >
            <div className="card__top">
                <div className="flex justify-between items-center mb-3">
                    <Typography variant="caption" className="uppercase" fontWeight={500} sx={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        background: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.main,
                    }}>{test.test_type}</Typography>
                    <StatusPillWithBorder showIcon={true} variant={variant} status={!test?.has_taken_test ? "Not Started" : "Completed"} />
                </div>
                <Typography variant="subtitle1" fontWeight={600} color="text.dark" className="mb-3!">
                    {test?.name}
                </Typography>
                {test?.start_datetime ?
                    <Stack gap={1} color="text.middle" className="mb-3" alignItems={"center"}>
                        <Box sx={{
                            color: (theme) => theme.palette.text.middle
                        }}>
                            <Calendar size={16} variant="Bold" />
                        </Box>
                        <Typography variant="subtitle2" color="text.middle" className="flex">
                            Start Date:
                        </Typography>
                        <Typography variant="subtitle2" color="text.dark" fontWeight={600}>{formatDateTime(test?.start_datetime)}</Typography>
                    </Stack>
                    : ""}

                <Box className="flex justify-between items-center gap-2">
                    <Typography variant="subtitle2" color="text.secondary" className="flex items-center gap-1">
                        <Box sx={{ color: (theme) => theme.palette.info.main }}><Notepad2 size={16} variant="Bold" /></Box>  <strong>{test?.total_questions}</strong> Total Questions
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" className="flex items-center gap-1">
                        <Box sx={{ color: (theme) => theme.palette.success.main }}><Clock variant="Bold" size={16} /></Box>
                        <strong>{test?.duration.hours}</strong> Hrs  <strong>: {test?.duration.minutes}</strong> Mins
                    </Typography>
                </Box>

                <Divider className="my-1.5!" />

                <Box className="flex justify-between items-center gap-2">
                    <Typography variant="subtitle2" color="text.secondary" className="flex items-center gap-1">
                        <Box sx={{ color: (theme) => theme.palette.error.main }}><Medal variant="Bold" size={16} /></Box>
                        <strong>{test?.full_mark}</strong> Total Marks
                    </Typography>


                    <Typography variant="subtitle2" color="text.secondary" className="flex items-center gap-1">
                        <Box sx={{ color: (theme) => theme.palette.warning.main }}><Medal variant="Bold" size={16} /></Box>
                        <strong> {test?.pass_mark}</strong> Pass marks
                    </Typography>

                </Box>
            </div>

            <div className="flex flex-wrap justify-between mt-3">
                <div className="expiry__price flex gap-1 items-end">
                    {sellingPrice ? <Typography variant='subtitle1' fontWeight={600} className='text-nowrap'>{t("messages.npr")} {sellingPrice}</Typography> : ""}
                    {markedPrice ? <Typography variant='caption' color='text.middle' className='text-nowrap'><del>{t("messages.npr")} {markedPrice}</del></Typography> : ""}
                </div>
                <Button variant="contained" color="primary" onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.ROOT(test?.id ? Number(test.id) : undefined, "test"))}>
                    Buy Now
                </Button>
            </div>
        </Box>

    )
}
