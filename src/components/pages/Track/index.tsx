import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
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
        // A deep link from the WordPress site (/track/CODE?course=47) goes on to register with
        // its params intact, so the course reaches the sign-up and a free one is auto-enrolled.
        // Already signed-in users are bounced from register straight to the course.
        const search = new URLSearchParams(window.location.search);
        const isDeepLink = ["course", "test", "bundle"].some((key) => search.has(key));
        // Carry the code along so register knows this visitor came from a campaign
        if (code) search.set("campaign", code);
        navigate(isDeepLink ? `${PATH.AUTH.REGISTER.ROOT}?${search.toString()}` : "/", { replace: true });
    }, [code, navigate, trackClick]);

    return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
            <CircularProgress size={28} />
        </Box>
    );
}
