import {
    Alert,
    AlertTitle,
    Box,
    Button,
    CircularProgress,
    Divider,
    Typography,
} from "@mui/material";
import { Maximize2 } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../../routes/PATH";
import { useGetMeetingSignatureMutation, useGetSingleLiveClassQuery } from "../../../../../services/courseApi";
import { useAppSelector } from "../../../../../store/hook";
import { renderHtml } from "../../../../../utils/renderHtml";
import WaterMark from "../../../../../Watermark";

type MeetingStatus =
    | "initial_loading"
    | "preparing_zoom"
    | "not_started"
    | "error"
    | "ready_to_join"
    | "ended";

export default function SingleLiveClassRoot() {
    const { courseId, liveId } = useParams();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    const [meetingStatus, setMeetingStatus] = useState<MeetingStatus>("initial_loading");
    const [error, setError] = useState<string | null>(null);
    const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
    const [_isSignatureLoading, setIsSignatureLoading] = useState(false);

    const { data: liveClassData, isLoading: isLoadingLiveClass } = useGetSingleLiveClassQuery({
        courseId: Number(courseId),
        liveId: Number(liveId),
    });

    const [generateSignature] = useGetMeetingSignatureMutation();


    const formatMeetingTime = (time: string | undefined) => {
        if (!time) return "";
        const startTime = new Date(time);
        return startTime.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: 'Asia/Kathmandu',
        }) + " (NPT)";
    };

    useEffect(() => {
        if (isLoadingLiveClass) {
            setMeetingStatus("initial_loading");
            return;
        }

        const meetingData = liveClassData?.data;

        if (!meetingData) {
            setMeetingStatus("error");
            setError("Live class data not found.");
            return;
        }

        if (meetingData.status as MeetingStatus === "ended") {
            setMeetingStatus("ended");
            return;
        }

        const checkStatusAndPrepare = async () => {
            const meetingStartTime = meetingData.start_time ? new Date(meetingData.start_time) : null;
            const currentTime = new Date();

            if (meetingStartTime && currentTime < meetingStartTime) {
                setMeetingStatus("not_started");
                return;
            }

            try {
                setMeetingStatus("preparing_zoom");
                setIsSignatureLoading(true);
                setError(null);

                const meetingNumber = meetingData.start_url.match(/\/j\/(\d+)/)?.[1];
                const password = new URL(meetingData.start_url).searchParams.get("pwd");
                let sdkKey: string;

                if (meetingData.account_id === 1) {
                    sdkKey = import.meta.env.VITE_ZOOM_MEETING_SDK_SECRET1;
                } else if (meetingData.account_id === 2) {
                    sdkKey = import.meta.env.VITE_ZOOM_MEETING_SDK_SECRET2;
                } else {
                    sdkKey = import.meta.env.VITE_ZOOM_MEETING_SDK_SECRET3;
                }

                if (!meetingNumber) throw new Error("Invalid Meeting URL in server data.");
                if (!sdkKey) throw new Error("Zoom SDK Key is not configured.");

                const sigRes = await generateSignature({
                    meeting_id: Number(meetingNumber),
                    account_id: Number(meetingData?.account_id),
                    role: 0,
                }).unwrap();

                const signature = sigRes.data.signature;
                if (!signature) throw new Error("Failed to generate meeting signature.");

                // Construct URL for the static HTML file
                const finalDestination = window.location.origin + PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(Number(courseId));
                // The 'leave' URL points to a breaker HTML which redirects to the course page
                const breakerUrl = `${window.location.origin}/end-meeting.html?target=${encodeURIComponent(finalDestination)}`;

                const params = new URLSearchParams({
                    mn: meetingNumber,
                    pwd: password || "",
                    sig: signature,
                    key: sdkKey,
                    name: user?.name || "Student",
                    email: user?.email || "",
                    leave: breakerUrl
                });

                setMeetingUrl(`/meeting.html?${params.toString()}`);
                setMeetingStatus("ready_to_join");

            } catch (err: any) {
                console.error("Zoom preparation error:", err);
                setMeetingStatus("error");
                setError(err.message || "An unknown error occurred during meeting preparation.");
            } finally {
                setIsSignatureLoading(false);
            }
        };


        if (liveClassData) checkStatusAndPrepare();

    }, [liveClassData, isLoadingLiveClass, generateSignature, user, courseId]);


    const handleClose = () => {
        navigate(PATH.COURSE_MANAGEMENT.COURSES.ROOT)
        // navigate(-1);
        // navigate(PATH.LIVE_CLASSES.ROOT);
    };

    const handleRetry = () => {
        setMeetingStatus("initial_loading");
        setError(null);
    };

    // ------------------ JSX for Status Screens ------------------

    const currentData = liveClassData?.data;

    const zoomContainerRef = useRef<HTMLDivElement>(null);

    const handleFullscreen = () => {
        if (zoomContainerRef.current) {
            if (zoomContainerRef.current.requestFullscreen) {
                zoomContainerRef.current.requestFullscreen();
            } else if ((zoomContainerRef.current as any).webkitRequestFullscreen) {
                (zoomContainerRef.current as any).webkitRequestFullscreen();
            } else if ((zoomContainerRef.current as any).msRequestFullscreen) {
                (zoomContainerRef.current as any).msRequestFullscreen();
            }
        }
    };


    // Loading State: Initial fetch or Zoom signature generation
    if (meetingStatus === "initial_loading" || meetingStatus === "preparing_zoom") {
        return (
            <Box sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "background.default",
                zIndex: 1000,
            }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    {meetingStatus === "initial_loading" ? "Fetching Live Class Data..." : "Preparing Zoom Session..."}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Please wait while we connect you
                </Typography>
            </Box>
        );
    }

    // Meeting Not Started
    if (meetingStatus === "not_started") {
        return (
            <Box sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "background.default",
                zIndex: 1000,
                p: 3,
            }}>
                <Box sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: "info.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                }}>
                    <Typography variant="h2">🕐</Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                    Meeting Not Started Yet
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 500, mt: 2 }}>
                    The host hasn't started this meeting yet. Please wait for the meeting to begin.
                </Typography>
                {currentData?.start_time && (
                    <Alert severity="info" sx={{ mt: 3, maxWidth: 500 }}>
                        <AlertTitle>Scheduled Start Time (Nepal Time)</AlertTitle>
                        {formatMeetingTime(currentData.start_time)}
                    </Alert>
                )}
                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button variant="outlined" onClick={handleClose} size="large">
                        Go Back
                    </Button>
                    <Button variant="contained" onClick={handleRetry} size="large">
                        Check Again
                    </Button>
                </Box>
            </Box>
        );
    }

    // Meeting Ended (Requires server-side check/status)
    if (meetingStatus === "ended") {
        return (
            <Box sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "background.default",
                zIndex: 1000,
                p: 3,
            }}>
                <Box sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: "success.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                }}>
                    <Typography variant="h2">✅</Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                    Meeting Has Ended
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 500, mt: 2 }}>
                    This meeting has already concluded. Thank you for participating!
                </Typography>
                <Button variant="contained" onClick={handleClose} size="large" sx={{ mt: 4 }}>
                    Go Back to Course
                </Button>
            </Box>
        );
    }

    // Error State
    if (meetingStatus === "error" && error) {
        return (
            <Box sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "background.default",
                zIndex: 1000,
                p: 3,
            }}>
                <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "error.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                }}>
                    <Typography variant="h3" color="error.main">⚠️</Typography>
                </Box>
                <Typography variant="h6" color="error.main" gutterBottom>
                    Unable to Join Meeting
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 400, mt: 1 }}>
                    {error}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={handleClose} size="large">
                        Close
                    </Button>
                    <Button variant="contained" onClick={handleRetry} size="large">
                        Try Again
                    </Button>
                </Box>
            </Box>
        );
    }


    // Ready to Join: Render the IFrame (Final state for successful launch)
    return (
        <>
            <div className=" items-end justify-between py-4 hidden lg:flex lg:px-8">
                <div className="title__wrapper">
                    <Typography variant="h4" fontWeight={600}>{liveClassData?.data?.name}</Typography>
                    {liveClassData?.data?.description ? (<>
                        <Typography variant="h4" className="mb-4!" fontWeight={600}>Agenda</Typography>
                        <Typography variant="subtitle2" color="text.middle">{renderHtml(liveClassData?.data?.agenda || "")}</Typography>
                    </>) : ""}
                    {liveClassData?.data?.description ? (<>
                        <Typography variant="h4" className="mb-4!" fontWeight={600}>More On {liveClassData?.data?.name}</Typography>
                        <Typography variant="subtitle2" color="text.middle">{renderHtml(liveClassData?.data?.description || "")}</Typography>
                    </>) : ""}
                </div>
                <Button variant="contained" onClick={handleFullscreen} startIcon={<Maximize2 />}>
                    Fullscreen Zoom
                </Button>
            </div>
            <Divider className="mt-2! hidden lg:block" />

            <Box
                ref={zoomContainerRef}
                sx={{
                    width: "100%",
                    height: {
                        xs: "100vh",
                        lg: "calc(100vh - 92px)"
                    },
                    bgcolor: "black",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {meetingUrl && (
                    <iframe
                        src={meetingUrl}
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                        }}
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                        title="Zoom Class"
                    />
                )}
                <WaterMark />
            </Box>
        </>

    );
}