import { ArrowBack } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { Calendar } from "iconsax-reactjs";
import { useNavigate, useParams } from "react-router-dom";
import { useGetNotificationByIdQuery } from "../../../../services/notificationApi";
import { formatDateForDisplay } from "../../../../utils/dateFormat";
import { renderHtml } from "../../../../utils/renderHtml";
import CopyLink from "../../../atom/CopyLink";

export default function SingleNoticeRoot() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading } = useGetNotificationByIdQuery({ id: Number(id) }, { skip: !id });

    const handleBackClick = () => {
        navigate(-1);
    };

    const noticeData = data?.data;
    const date: string = formatDateForDisplay(noticeData?.sent_at);

    return (
        <div className="single__notice__root h-full overflow-auto pr-4">
            <Button
                variant="text"
                sx={{
                    color: (theme) => theme.palette.separator.darkest
                }}
                startIcon={<ArrowBack />}
                onClick={handleBackClick}
            >
                <Typography color="text.middle">Back to Gorkhapatras</Typography>
            </Button>

            <Typography className="text-center mt-8!" variant="h3" fontWeight={600}>
                {noticeData?.title}
            </Typography>

            <Divider className="mt-2! mb-6!" />

            <Stack className="justify-between">
                <Stack className="items-center! gap-2 mb-6">

                    {noticeData?.sent_at && (
                        <Stack className="items-center! gap-1">
                            <Calendar />
                            <Typography variant="subtitle2" color="text.middle">
                                {date}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
                <Stack>
                    <CopyLink />
                </Stack>
            </Stack>

            {noticeData?.description && (
                <div
                    className="content general__content__box styled__list lg:col-span-8 "
                >
                    {renderHtml(noticeData.description)}
                </div>
            )}
        </div>
    )
}
