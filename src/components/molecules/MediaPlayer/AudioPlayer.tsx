import { Box, IconButton, Slider, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
    src: string;
    title?: string;
    cover?: string;
    allowDownload?: boolean;
    /** Seek here once metadata loads (resume support). */
    initialPosition?: number;
    /** Lightweight UI progress callback (every timeupdate). */
    onProgressChange?: (percent: number) => void;
    /** Throttled progress tick suitable for persisting to a server (every ~5s while playing + on pause). */
    onProgressTick?: (percent: number, positionSeconds: number) => void;
}

const TICK_INTERVAL_MS = 5000;

function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

const PlayIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>);
const PauseIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>);
const Replay10Icon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" /><text x="9" y="16" fontSize="7" fontWeight="bold" fill="currentColor" textAnchor="middle">10</text></svg>);
const Forward10Icon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" /><text x="14.5" y="16" fontSize="7" fontWeight="bold" fill="currentColor" textAnchor="middle">10</text></svg>);
const VolumeUpIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>);
const VolumeMuteIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z" /></svg>);
const DownloadIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>);

export default function AudioPlayer({
    src,
    title,
    cover,
    allowDownload = false,
    initialPosition,
    onProgressChange,
    onProgressTick,
}: AudioPlayerProps) {
    const theme = useTheme();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastTickRef = useRef<number>(0);
    const seekedRef = useRef<boolean>(false);

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const maybeSeekToInitial = () => {
            if (!seekedRef.current && initialPosition && audio.duration > 0 && initialPosition < audio.duration) {
                audio.currentTime = initialPosition;
                seekedRef.current = true;
            }
        };

        const fireTick = () => {
            if (!onProgressTick || audio.duration <= 0) return;
            const now = Date.now();
            if (now - lastTickRef.current < TICK_INTERVAL_MS) return;
            lastTickRef.current = now;
            onProgressTick((audio.currentTime / audio.duration) * 100, audio.currentTime);
        };

        const onTimeUpdate = () => { setCurrentTime(audio.currentTime); fireTick(); };
        const onDurationChange = () => { setDuration(audio.duration); maybeSeekToInitial(); };
        const onLoadedMetadata = () => { maybeSeekToInitial(); };
        const onEnded = () => {
            setPlaying(false);
            if (onProgressTick && audio.duration > 0) {
                onProgressTick(100, audio.duration); // final tick at end
            }
        };
        const onPlay = () => setPlaying(true);
        const onPause = () => {
            setPlaying(false);
            if (onProgressTick && audio.duration > 0) {
                onProgressTick((audio.currentTime / audio.duration) * 100, audio.currentTime);
                lastTickRef.current = Date.now();
            }
        };
        const onProgress = () => {
            if (audio.buffered.length > 0) setBuffered(audio.buffered.end(audio.buffered.length - 1));
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("durationchange", onDurationChange);
        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);
        audio.addEventListener("progress", onProgress);

        return () => {
            // Final save on unmount (best-effort)
            if (onProgressTick && audio.duration > 0) {
                onProgressTick((audio.currentTime / audio.duration) * 100, audio.currentTime);
            }
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("durationchange", onDurationChange);
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("ended", onEnded);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
            audio.removeEventListener("progress", onProgress);
        };
        // initialPosition / onProgressTick are stable refs from the parent; src change resets the effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    useEffect(() => {
        if (onProgressChange && duration > 0) onProgressChange((currentTime / duration) * 100);
    }, [currentTime, duration, onProgressChange]);

    const togglePlay = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        if (a.paused) a.play();
        else a.pause();
    }, []);

    const skip = (seconds: number) => {
        const a = audioRef.current;
        if (!a) return;
        a.currentTime = Math.max(0, Math.min(duration, a.currentTime + seconds));
    };

    const seek = (_: Event, value: number | number[]) => {
        const a = audioRef.current;
        if (!a) return;
        const t = typeof value === "number" ? value : value[0];
        a.currentTime = t;
        setCurrentTime(t);
    };

    const handleVolume = (_: Event, value: number | number[]) => {
        const a = audioRef.current;
        if (!a) return;
        const v = typeof value === "number" ? value : value[0];
        a.volume = v;
        setVolume(v);
        if (v > 0 && muted) { a.muted = false; setMuted(false); }
    };

    const toggleMute = () => {
        const a = audioRef.current;
        if (!a) return;
        a.muted = !a.muted;
        setMuted(a.muted);
    };

    const cycleSpeed = () => {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
        setPlaybackRate(next);
        if (audioRef.current) audioRef.current.playbackRate = next;
    };

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = src;
        a.download = title || "audio";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <audio ref={audioRef} src={src} preload="metadata" controlsList="nodownload" style={{ display: "none" }} />

            {/* Cover + title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Box
                    sx={{
                        width: 64, height: 64, borderRadius: 2,
                        bgcolor: theme.palette.primary.light,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backgroundImage: cover ? `url(${cover})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        flexShrink: 0,
                    }}
                >
                    {!cover && (
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <path d="M12.8935 18.5605C11.9068 18.5605 11.1201 19.3605 11.1201 20.3472C11.1201 21.3339 11.9201 22.1205 12.8935 22.1205C13.8801 22.1205 14.6801 21.3205 14.6801 20.3472C14.6801 19.3605 13.8801 18.5605 12.8935 18.5605Z" fill={theme.palette.primary.main} />
                            <path d="M21.5868 2.66602H10.4134C5.56008 2.66602 2.66675 5.55935 2.66675 10.4127V21.5727C2.66675 26.4393 5.56008 29.3327 10.4134 29.3327H21.5734C26.4268 29.3327 29.3201 26.4393 29.3201 21.586V10.4127C29.3334 5.55935 26.4401 2.66602 21.5868 2.66602ZM22.8267 13.066C22.8267 13.8793 22.4801 14.5993 21.8934 15.026C21.5201 15.2927 21.0667 15.4393 20.5867 15.4393C20.3067 15.4393 20.0267 15.386 19.7334 15.2927L16.6801 14.2793C16.6667 14.2793 16.6401 14.266 16.6267 14.2527V20.3327C16.6267 22.386 14.9467 24.066 12.8934 24.066C10.8401 24.066 9.16008 22.386 9.16008 20.3327C9.16008 18.2793 10.8401 16.5993 12.8934 16.5993C13.5467 16.5993 14.1467 16.786 14.6801 17.066V11.506V10.6927C14.6801 9.87935 15.0267 9.15935 15.6134 8.73268C16.2134 8.30602 17.0001 8.19935 17.7734 8.46602L20.8267 9.47935C21.9734 9.86602 22.8401 11.066 22.8401 12.266V13.066H22.8267Z" fill={theme.palette.primary.main} />
                        </svg>
                    )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {title || "Audio Track"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </Typography>
                </Box>
            </Box>

            {/* Progress */}
            <Box sx={{ px: 2.5, pt: 1.5 }}>
                <Box sx={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
                    <Box sx={{
                        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                        height: 4, width: `${bufferedPct}%`, bgcolor: theme.palette.action.disabled, borderRadius: 2,
                    }} />
                    <Slider
                        value={currentTime}
                        max={duration || 100}
                        onChange={seek}
                        size="small"
                        sx={{
                            color: theme.palette.primary.main,
                            height: 4,
                            p: "0!important",
                            "& .MuiSlider-thumb": {
                                width: 14, height: 14,
                                "&:hover, &.Mui-focusVisible": { boxShadow: `0 0 0 6px ${theme.palette.primary.light}` },
                            },
                            "& .MuiSlider-rail": { opacity: 0.3 },
                        }}
                    />
                </Box>
            </Box>

            {/* Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 2, pb: 1.5 }}>
                <IconButton size="small" onClick={() => skip(-10)}><Replay10Icon /></IconButton>
                <IconButton size="medium" onClick={togglePlay} sx={{ color: theme.palette.primary.main }}>
                    {playing ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
                <IconButton size="small" onClick={() => skip(10)}><Forward10Icon /></IconButton>

                <Box sx={{ flex: 1 }} />

                <IconButton size="small" onClick={toggleMute}>
                    {muted || volume === 0 ? <VolumeMuteIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                    value={muted ? 0 : volume}
                    max={1} step={0.05}
                    onChange={handleVolume}
                    size="small"
                    sx={{
                        color: theme.palette.primary.main,
                        width: 80,
                        "& .MuiSlider-thumb": { width: 12, height: 12 },
                    }}
                />

                <IconButton
                    size="small"
                    onClick={cycleSpeed}
                    sx={{ fontSize: 12, fontWeight: 700, minWidth: 38, color: theme.palette.text.secondary }}
                >
                    {playbackRate}x
                </IconButton>

                {allowDownload && (
                    <IconButton size="small" onClick={handleDownload}><DownloadIcon /></IconButton>
                )}
            </Box>
        </Box>
    );
}
