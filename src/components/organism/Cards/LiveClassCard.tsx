import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { Clock, People } from "iconsax-reactjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { LiveClassProps } from "../../../types/liveClass";
import { getTime } from "../../../utils/formatTime";
import StatusPillWithBorder from "../../atom/StatusPillWithBorder";
import ZoomMeetingModal from "./ZoomMeetingModal";

type StatusVariantKey = "error" | "info" | "success";
const statusVariantMap: Record<string, StatusVariantKey> = {
    ended: "error",
    upcoming: "info",
    ongoing: "error",
};

export default function LiveClassCard({ data, courseId }: { data: LiveClassProps; courseId?: number; }) {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

    const canJoinLive = () => {
        if (!data.start_time) return false;

        const startTime = new Date(data.start_time).getTime();
        const now = Date.now();

        return now >= startTime - 2 * 60 * 1000;
    };




    const startTimeLabel = getTime(data.start_time);


    const handleJoinClass = () => {
        navigate(PATH.COURSE_MANAGEMENT.COURSES.JOIN_LIVE.ROOT(Number(courseId ? courseId : id), Number(data?.id)))
    };
    const variant = statusVariantMap[data?.status] ?? "info";

    return (
        <>
            <Box
                className="test__card rounded-md p-4 w-full"
                sx={{
                    border: `1px solid ${theme.palette.separator.dark}`,
                    borderTop: `4px solid ${theme.palette[variant].main}`,
                }}
            >
                {/* Top row: category badge + status pill */}
                <div className="flex justify-between items-center mb-3">
                    {/* <Box sx={{
                        display: "inline-flex", alignItems: "center", gap: 1,
                        padding: "6px 10px", borderRadius: "8px",
                        background: theme.palette.primary.light,
                        color: theme.palette.primary.main,
                    }}>
                        <Devices size={14} />
                        <Typography variant="caption" fontWeight={500}>Live Class</Typography>
                    </Box> */}
                </div>

                {/* Title + teacher */}
                <div className="flex justify-between items-center gap-2 mb-3">
                    {/* <IconButton color="primary" sx={{
                        backgroundColor: theme.palette.button.light,
                        height: "40px",
                        width: "40px",
                        flexShrink: 0,
                    }}>
                        <Devices size={18} />
                    </IconButton> */}
                    <div className="flex flex-col gap-0.5">
                        <Typography variant="caption" fontWeight={600} color="text.dark">
                            {data.name}
                        </Typography>
                        <Typography variant="overline" color="text.middle">
                            {data?.teachers?.map((teacher) => teacher.name).join(", ")}
                        </Typography>
                    </div>
                    <StatusPillWithBorder showIcon variant={variant} status={data?.status} />
                </div>

                {/* Meta row */}
                <Box className="flex justify-between items-center gap-2">
                    <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
                        <Box sx={{ color: theme.palette.info.main }}><Clock size={14} variant="Bold" /></Box>
                        {getTime(data.start_time)} – {getTime(data.end_time)}
                    </Typography>
                    <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
                        <Box sx={{ color: theme.palette.success.main }}><People size={14} variant="Bold" /></Box>
                        <strong>{data?.active_students}</strong> active
                    </Typography>
                </Box>
                <Divider className="my-1.5!" />

                {/* <Button
                    variant={data?.status === "upcoming" ? "text" : "contained"}
                    size="small"
                    color={data?.status === "upcoming" ? "inherit" : "primary"}
                    className="mt-4"
                    fullWidth
                    sx={{
                        backgroundColor: data?.status === "upcoming" ? "button.light" : "button.main",
                        fontWeight: 500,
                        fontSize: "16px",
                    }}
                    startIcon={
                        data?.status === "upcoming" ? (
                            <NotificationBing size={24} />
                        ) : null
                    }
                    onClick={data?.status === "ongoing" ? handleJoinClass : () => { }}
                    disabled={data?.status === "ended"}

                >
                    {data?.status === "upcoming" && "Remind Me"}
                    {data?.status === "ongoing" && "Join Live"}
                    {data?.status === "ended" && "Class Already Ended"}

                </Button> */}
                <Button
                    variant={data.status === "ongoing" && canJoinLive() ? "contained" : "text"}
                    size="small"
                    color={data.status === "ongoing" && canJoinLive() ? "primary" : "inherit"}
                    className="mt-4"
                    fullWidth
                    sx={{
                        backgroundColor:
                            data.status === "ongoing" && canJoinLive()
                                ? "button.main"
                                : "button.light",
                        fontWeight: 500,
                        fontSize: "14px",
                    }}
                    startIcon={
                        data.status === "upcoming" ? <Clock size={20} /> : null
                    }
                    onClick={
                        data.status === "ongoing" && canJoinLive()
                            ? handleJoinClass
                            : undefined
                    }
                    disabled={
                        data.status === "ended" ||
                        (data.status === "ongoing" && !canJoinLive())
                    }
                >
                    {data.status === "upcoming" &&
                        `Class starts at ${startTimeLabel}`}

                    {data.status === "ongoing" &&
                        (canJoinLive()
                            ? "Join Live"
                            : `Join available at ${startTimeLabel}`)}

                    {data.status === "ended" && "Class Already Ended"}
                </Button>

            </Box>
            <ZoomMeetingModal
                open={isZoomModalOpen}
                onClose={() => setIsZoomModalOpen(false)}
                meetingData={data}
            />
        </>

    );
}
