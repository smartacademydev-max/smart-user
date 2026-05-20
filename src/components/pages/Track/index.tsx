import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrackMarketingClickMutation } from "../../../services/referralApi";
import { setAttribution } from "../../../utils/attribution";

export default function TrackRedirect() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [trackClick] = useTrackMarketingClickMutation();

    useEffect(() => {
        if (code) {
            setAttribution("marketing", code);
            trackClick({ code }).unwrap().catch(() => { });
        }
        navigate("/", { replace: true });
    }, [code, navigate, trackClick]);

    return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
            <CircularProgress size={28} />
        </Box>
    );
}
