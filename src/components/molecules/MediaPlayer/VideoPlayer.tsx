import { Box, CircularProgress, useTheme } from "@mui/material";
import Plyr, { type APITypes, type PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";
import { useEffect, useRef, useState } from "react";
import { extractYouTubeVideoId } from "../../../utils/extractYoutubeVideoId";

interface PlyrInstance {
    plyr?: APITypes;
}

interface VideoPlayerProps {
    src: string;
    poster?: string;
    /** Seek here once metadata loads (resume support). */
    initialPosition?: number;
    /** Lightweight UI progress callback (every timeupdate). */
    onProgressChange?: (percent: number) => void;
    /** Throttled progress tick suitable for persisting to a server (every ~5s while playing + on pause/end). */
    onProgressTick?: (percent: number, positionSeconds: number) => void;
}

const TICK_INTERVAL_MS = 5000;

export default function VideoPlayer({
    src,
    poster,
    initialPosition,
    onProgressChange,
    onProgressTick,
}: VideoPlayerProps) {
    const theme = useTheme();
    const playerRef = useRef<PlyrInstance | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastTickRef = useRef<number>(0);
    const seekedRef = useRef<boolean>(false);
    const [loading, setLoading] = useState(true);

    const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
    const youtubeId = isYouTube ? extractYouTubeVideoId(src) : null;

    // Apply YouTube security overlays (mirrors ReadingDialog so YouTube branding is hidden)
    useEffect(() => {
        if (!isYouTube) {
            setLoading(false);
            return;
        }

        const t = setTimeout(() => {
            const container = containerRef.current;
            if (container) {
                const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
                if (iframe) {
                    iframe.style.pointerEvents = "none";
                    iframe.style.userSelect = "none";
                }
                const wrap = container.querySelector(".plyr__video-wrapper") as HTMLElement | null;
                if (wrap && !wrap.querySelector(".yt-overlay")) {
                    const overlay = document.createElement("div");
                    overlay.className = "yt-overlay";
                    overlay.style.cssText = "position:absolute;inset:0;background:transparent;z-index:20;pointer-events:auto;";
                    wrap.appendChild(overlay);
                }
                const controls = container.querySelector(".plyr__controls") as HTMLElement | null;
                if (controls) {
                    controls.style.pointerEvents = "auto";
                    controls.style.zIndex = "30";
                }
            }
            setLoading(false);
        }, 1200);

        return () => clearTimeout(t);
    }, [isYouTube, src]);

    // Progress reporting + resume + throttled tick (every 5s while playing, on pause/end, on unmount)
    useEffect(() => {
        // Wait one tick for Plyr's instance to mount
        const timer = setTimeout(() => {
            const inst = playerRef.current?.plyr as any;
            if (!inst) return;

            const maybeSeekToInitial = () => {
                if (!seekedRef.current && initialPosition && inst.duration > 0 && initialPosition < inst.duration) {
                    inst.currentTime = initialPosition;
                    seekedRef.current = true;
                }
            };

            const fireTick = () => {
                if (!onProgressTick || !(inst.duration > 0)) return;
                const now = Date.now();
                if (now - lastTickRef.current < TICK_INTERVAL_MS) return;
                lastTickRef.current = now;
                onProgressTick((inst.currentTime / inst.duration) * 100, inst.currentTime);
            };

            const onTime = () => {
                if (!(inst.duration > 0)) return;
                if (onProgressChange) onProgressChange((inst.currentTime / inst.duration) * 100);
                fireTick();
            };
            const onLoaded = () => maybeSeekToInitial();
            const onPause = () => {
                if (onProgressTick && inst.duration > 0) {
                    onProgressTick((inst.currentTime / inst.duration) * 100, inst.currentTime);
                    lastTickRef.current = Date.now();
                }
            };
            const onEnded = () => {
                if (onProgressTick && inst.duration > 0) onProgressTick(100, inst.duration);
            };

            inst.on?.("timeupdate", onTime);
            inst.on?.("loadedmetadata", onLoaded);
            inst.on?.("pause", onPause);
            inst.on?.("ended", onEnded);

            // If metadata already loaded (e.g., cached), seek immediately
            maybeSeekToInitial();
        }, 0);

        return () => {
            clearTimeout(timer);
            const inst = playerRef.current?.plyr as any;
            if (inst && onProgressTick && inst.duration > 0) {
                // Final save on unmount
                onProgressTick((inst.currentTime / inst.duration) * 100, inst.currentTime);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    // Cleanup
    useEffect(() => {
        return () => {
            try { (playerRef.current?.plyr as any)?.destroy?.(); } catch { /* noop */ }
        };
    }, []);

    const plyrSource: PlyrProps["source"] = isYouTube && youtubeId
        ? { type: "video", sources: [{ src: youtubeId, provider: "youtube" }] }
        : { type: "video", sources: [{ src, type: "video/mp4" }], poster };

    const plyrOptions: PlyrProps["options"] = {
        autoplay: false,
        controls: ["play-large", "play", "rewind", "progress", "fast-forward", "current-time", "duration", "mute", "volume", "settings", "pip", "fullscreen"],
        keyboard: { focused: true, global: false },
        clickToPlay: true,
        disableContextMenu: true,
        fullscreen: { enabled: true, iosNative: true },
        seekTime: 10,
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        youtube: { noCookie: false, rel: 0, iv_load_policy: 3, cc_load_policy: 0, playsinline: 1 },
    };

    return (
        <Box ref={containerRef} sx={{
            position: "relative",
            width: "100%",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#000",
            "& .plyr": { borderRadius: 2 },
        }}>
            {loading && isYouTube && (
                <Box sx={{
                    position: "absolute", inset: 0, zIndex: 5,
                    bgcolor: "#000",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <CircularProgress sx={{ color: theme.palette.primary.main }} />
                </Box>
            )}
            <Plyr ref={playerRef as any} source={plyrSource} options={plyrOptions} />
        </Box>
    );
}
