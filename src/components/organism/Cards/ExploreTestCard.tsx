import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Calendar } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { QuestionTypeProps, TestProps } from "../../../types/question";
import { formatDateTime } from "../../../utils/dateFormat";
import { getStatus } from "../../../utils/getStatus";
import { getTestStatus } from "../../../utils/statusMap";
import StatusPill from "../../atom/StatusPill";

export default function ExploreTestCard({ test, }: { test: TestProps; }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const status = getStatus(test?.start_datetime, test?.end_datetime);

    const variant = getTestStatus(test?.test_type as QuestionTypeProps || "subjective" as QuestionTypeProps);

    const markedPrice = test?.marked_price;
    const sellingPrice = test?.sale_price;
    return (
        <Box
            className="test__card rounded-md p-4 flex flex-col justify-between"
            sx={{
                border: (theme) => `1px solid ${theme.palette.separator.dark}`,
            }}
        >
            <div className="mb-2">
                <StatusPill variant={variant} status={test.test_type || ""} />
            </div>
            <Box className="w-full flex justify-between items-start gap-4">
                <Typography variant="body2" fontWeight={600} color="text.dark">
                    {test?.name}
                </Typography>

                <Typography
                    color="text.main"
                    bgcolor={"gray.gray1"}
                    className="text-[11px]! px-2.5 py-1.5 rounded-md ml-2 font-semibold! capitalize"
                >
                    {status}
                </Typography>
            </Box>

            {test?.start_datetime || test?.end_datetime ? <div className="mt-3 flex flex-col gap-3">
                {test?.start_datetime ? <Stack gap={1} color="text.middle">
                    <Calendar size={16} />
                    <Typography variant="subtitle2" color="text.middle" className="flex">
                        Start Date:
                    </Typography>
                    <Typography variant="subtitle2" color="text.dark">{formatDateTime(test?.start_datetime)}</Typography>
                </Stack> : ""}
                {test?.end_datetime ? <Stack gap={1} color="text.middle">
                    <Calendar size={16} />
                    <Typography variant="subtitle2" color="text.middle" className="flex">
                        End Date:
                    </Typography>
                    <Typography variant="subtitle2" color="text.dark">{formatDateTime(test?.end_datetime)}</Typography>
                </Stack> : ""}
            </div> : ""}

            <Divider className="my-3!" />

            <div className="bottom__wrapper">
                <Box
                    component="div"
                    bgcolor={"gray.gray1"}
                    px={3}
                    py={1.75}
                    borderRadius="6px"
                    my="12px"
                >
                    <Box className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Typography variant="subtitle2" color="text.secondary" className="inline-flex">
                                Questions:
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={500} color="text.dark" >
                                {test?.total_questions}
                            </Typography>
                        </div>

                        <div className="flex items-center gap-2">
                            <Typography variant="subtitle2" color="text.secondary" className="inline-flex">
                                Duration:
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                fontWeight={500}
                                color="text.dark"

                                sx={{ textWrap: "nowrap" }}
                            >
                                {test?.duration.hours} Hrs {test?.duration.minutes} Mins
                            </Typography>
                        </div>
                    </Box>

                    <Divider className="my-2!" />

                    <Box className="flex justify-between items-center gap-2">
                        <div className="flex gap-1 itesm-center">
                            <Typography variant="subtitle2" color="text.secondary" className="inline-flex">
                                Full marks:
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={500} color="text.dark" >
                                {test?.full_mark}
                            </Typography>
                        </div>

                        <div className="flex gap-1 items-center">
                            <Typography variant="subtitle2" color="text.secondary" className="inline-flex">
                                Pass marks:
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={500} color="text.dark" >
                                {test?.pass_mark}
                            </Typography>
                        </div>
                    </Box>

                </Box>
                <Divider className="my-3!" />

                <div className="flex flex-wrap justify-between">
                    <div className="expiry__price flex gap-1 items-end">
                        {markedPrice ? <Typography variant='caption' color='text.middle' className='text-nowrap'><del>{t("messages.npr")} {markedPrice}</del></Typography> : ""}
                        {sellingPrice ? <Typography variant='subtitle1' fontWeight={600} className='text-nowrap'>{t("messages.npr")} {sellingPrice}</Typography> : ""}
                    </div>
                    <Button variant="contained" color="primary" onClick={() => navigate(PATH.TEST.PURCHASE.ROOT(test?.id ? Number(test.id) : null))}>
                        Buy Now
                    </Button>
                </div>
            </div>

        </Box>

    )
}
