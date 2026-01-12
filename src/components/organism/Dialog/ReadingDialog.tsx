import { Box, Button, CircularProgress, Dialog, DialogContent, Typography, useTheme } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { DocumentDownload, Maximize2 } from 'iconsax-reactjs';
import Plyr, { type APITypes, type PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";
import { useEffect, useRef, useState } from 'react';
import { useGetCourseMediaByTypeQuery } from '../../../services/courseApi';
import { useGetPlayableUrlMutation } from '../../../services/mediaApi';
import { resetReadingScreen } from '../../../slice/ReadingScreenSlice';
import { showToast } from '../../../slice/toastSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import type { courseTabType, CurriculumMediaType } from '../../../types/course';
import type { MediaProps } from '../../../types/media';
import WaterMark from '../../../Watermark';

interface PlyrInstance {
    plyr?: APITypes;
}

const SpotifyAudioPlayer = ({ audioUrl, imageUrl, title }: { audioUrl: string, imageUrl: string, title: string }) => {
    return (
        <div
            style={{
                width: "100%",
                background: "#121212",
                borderRadius: "12px",
                padding: "16px",
                color: "white",
                height: "100%"
            }}
        >
            <Box sx={{ width: "100%", marginBottom: "12px", height: "calc(100% - 100px)" }}>
                <img
                    src={imageUrl}
                    alt="cover"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                    }}
                />
            </Box>

            <div className="audio__bottom">
                {title && (
                    <h3 style={{ margin: "8px 0", fontSize: "18px" }}>{title}</h3>
                )}

                {audioUrl ? (
                    <audio
                        controls
                        controlsList="nodownload"
                        src={audioUrl}
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                        }}
                    />
                ) : (
                    <p>No audio available</p>
                )}
            </div>
        </div>
    );
};

export default function ReadingDialog() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { open, type, media, title, isYouTube, mediaId, courseId } = useAppSelector(
        state => state.readScreen
    );

    const playerRef = useRef<PlyrInstance | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [_isLoading, setIsLoading] = useState(true);
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 15,
    });
    const [allMedia, setAllMedia] = useState<MediaProps[]>([]);


    const mediaUrl = media?.url || null;

    const videoRef = useRef<HTMLDivElement>(null);

    function switchType(type: CurriculumMediaType): courseTabType {
        switch (type) {
            case "temp_audios":
                return "audios";
            case "temp_video":
                return "videos";
            case "temp_notes":
                return "notes";
            default:
                return "videos";
        }
    }

    const { data, isFetching } = useGetCourseMediaByTypeQuery(
        { id: courseId!, type: switchType(type as CurriculumMediaType), qp: qp },
        { skip: !courseId || !open }
    );

    const [getPlayableUrl, { isLoading: loadingVideoUrl }] = useGetPlayableUrlMutation();
    const [playableUrl, setPlayableUrl] = useState<string | null>(null);
    const handleGetPlayableUrl = async () => {
        try {
            setPlayableUrl(null);
            const response = await getPlayableUrl({ url: media?.url }).unwrap();
            // dispatch(showToast({
            //     message: "Successfully fetched the url",
            //     severity: "success",
            // }))
            setPlayableUrl(response?.data?.url);

        } catch (e: any) {
            dispatch(showToast({
                message: e?.data?.message || "Error Getting URL",
                severity: "error",
            }))
        }
    }

    useEffect(() => {
        if (media?.id) {
            handleGetPlayableUrl();
        }
    }, [media?.id, media?.url])


    const mediaList = data?.data?.data || [];
    const totalPages = data?.data?.pagination?.total_pages || 0;
    const currentPage = qp.pageIndex;
    const hasMore = currentPage < totalPages;

    useEffect(() => {
        if (mediaList.length > 0) {
            if (qp.pageIndex === 1) {
                setAllMedia(mediaList);
            } else {
                setAllMedia(prev => {
                    const existingIds = new Set(prev.map(v => v.id));
                    const newMedia = mediaList.filter(v => !existingIds.has(v.id));
                    return [...prev, ...newMedia];
                });
            }
        }
    }, [mediaList, qp.pageIndex]);

    useEffect(() => {
        if (open) {
            setQp({ pageIndex: 1, pageSize: 15 });
            setAllMedia([]);
        }
    }, [open, courseId, type]);

    useEffect(() => {
        if (!open || !media?.id) return;

        const currentIndex = allMedia.findIndex(v => v.id === media?.id);
        if (currentIndex === -1) return;

        const remainingMedia = allMedia.length - currentIndex - 1;
        if (remainingMedia < 6 && hasMore && !isFetching) {
            setQp(prev => ({
                ...prev,
                pageIndex: prev.pageIndex + 1
            }));
        }
    }, [media?.id, allMedia.length, hasMore, isFetching, open]);

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if ((videoRef.current as any).webkitRequestFullscreen) {
                (videoRef.current as any).webkitRequestFullscreen();
            } else if ((videoRef.current as any).msRequestFullscreen) {
                (videoRef.current as any).msRequestFullscreen();
            }
        }
    };

    const handleClose = () => {
        if (playerRef.current?.plyr) {
            try {
                (playerRef.current.plyr as any).destroy?.();
            } catch (error) {
                console.error('Error destroying player:', error);
            }
        }
        dispatch(resetReadingScreen());
    };

    const applyYouTubeSecurityMeasures = () => {
        if (!containerRef.current) return;

        const iframe = containerRef.current.querySelector('iframe') as HTMLIFrameElement | null;
        if (!iframe) return;

        iframe.style.pointerEvents = 'none';
        iframe.style.userSelect = 'none';

        let overlay = containerRef.current.querySelector('.youtube-security-overlay') as HTMLElement | null;
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'youtube-security-overlay';
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: transparent;
                z-index: 20;
                pointer-events: auto;
                user-select: none;
            `;

            const videoWrapper = containerRef.current.querySelector('.plyr__video-wrapper') as HTMLElement | null;
            if (videoWrapper) {
                videoWrapper.appendChild(overlay);
            }
        }

        const plyrControls = containerRef.current.querySelector('.plyr__controls') as HTMLElement | null;
        if (plyrControls) {
            plyrControls.style.pointerEvents = 'auto';
            plyrControls.style.zIndex = '30';
        }
    };

    useEffect(() => {
        if (open && isYouTube) {
            const securityTimeout = setTimeout(() => {
                applyYouTubeSecurityMeasures();
                setIsLoading(false);
            }, 2000);

            const style = document.createElement('style');
            style.id = 'youtube-security-styles';
            style.textContent = `
                .youtube-security-overlay ~ iframe,
                .plyr__video-wrapper iframe {
                    pointer-events: none !important;
                }
                
                .plyr__video-wrapper::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: transparent;
                    z-index: 25;
                    pointer-events: auto;
                }
                
                .plyr__controls,
                .plyr__control {
                    z-index: 35 !important;
                    pointer-events: auto !important;
                }
            `;

            if (!document.querySelector('#youtube-security-styles')) {
                document.head.appendChild(style);
            }

            return () => {
                clearTimeout(securityTimeout);
                const styleElement = document.querySelector('#youtube-security-styles');
                if (styleElement) {
                    styleElement.remove();
                }
            };
        } else if (open) {
            setIsLoading(false);
        }
    }, [open, isYouTube]);

    useEffect(() => {
        if (open) {
            setIsLoading(true);
        }
    }, [open]);

    useEffect(() => {
        return () => {
            if (playerRef.current?.plyr) {
                try {
                    (playerRef.current.plyr as any).destroy?.();
                } catch (error) {
                    console.error('Error destroying player:', error);
                }
            }
        };
    }, []);

    // const handleRelatedVideoClick = (relatedVideo: MediaProps) => {
    //     const isYoutube = relatedVideo.url.includes('youtube.com') || relatedVideo.url.includes('youtu.be');
    //     const vidId = isYoutube ? extractYouTubeVideoId(relatedVideo.url) : null;

    //     dispatch(
    //         setReadingScreen({
    //             isYouTube: isYoutube,
    //             mediaId: vidId || undefined,
    //             media: relatedVideo,
    //             title: relatedVideo.file_name
    //         })
    //     );
    // };

    const renderContent = () => {
        switch (type) {
            case 'temp_video':
                if (isYouTube && mediaId) {

                    const plyrSource: PlyrProps['source'] = {
                        type: "video",
                        sources: [
                            {
                                src: mediaId,
                                provider: "youtube",
                            },
                        ],
                    };

                    // const plyrOptions: PlyrProps['options'] = {
                    //     autoplay: false,
                    //     controls: [
                    //         'play-large',
                    //         'play',
                    //         'rewind',
                    //         'progress',
                    //         'fast-forward',
                    //         'current-time',
                    //         'duration',
                    //         'mute',
                    //         'volume',
                    //         'settings',
                    //     ],
                    //     keyboard: { focused: true, global: false },
                    //     clickToPlay: true,
                    //     disableContextMenu: true,
                    //     fullscreen: { enabled: true },
                    //     seekTime: 10,
                    //     youtube: {
                    //         noCookie: false,
                    //         rel: 0,
                    //         showinfo: 0,
                    //         iv_load_policy: 3,
                    //         modestbranding: 1,
                    //         controls: 0,
                    //         disablekb: 0,
                    //         fs: 1,
                    //         cc_load_policy: 0,
                    //         autoplay: 0,
                    //         origin: window.location.origin
                    //     },
                    // };

                    const plyrOptions: PlyrProps['options'] = {
                        autoplay: false,
                        controls: [
                            'play-large',
                            'play',
                            'rewind',
                            'progress',
                            'fast-forward',
                            'current-time',
                            'duration',
                            'mute',
                            'volume',
                            'settings',
                        ],
                        keyboard: { focused: true, global: false },
                        clickToPlay: true,
                        disableContextMenu: true,
                        fullscreen: { enabled: true },
                        seekTime: 10,
                        youtube: {
                            noCookie: false,
                            rel: 0,
                            iv_load_policy: 3,
                            cc_load_policy: 0,
                            playsinline: 1,

                        },
                    };
                    return (
                        <div className='h-full min-h-[400px] flex justify-center items-center' ref={containerRef}>
                            <div className="hidden">
                                <Plyr
                                    ref={playerRef as any}
                                    source={plyrSource}
                                    options={plyrOptions}
                                />
                            </div>
                            {/* {responseStatus === 422 ? <div className='w-full' style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '400px',
                            }}>
                                <Button >Retry</Button>
                            </div> : ""} */}
                            {loadingVideoUrl ? <div className='w-full' style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '400px',
                                backgroundColor: '#000',
                            }}>
                                <CircularProgress size={60} />
                            </div> :
                                playableUrl ? <Plyr
                                    source={{
                                        type: "video",
                                        sources: [
                                            {
                                                src: playableUrl,
                                                type: "video/mp4",
                                            },
                                        ],
                                    }}
                                    options={{
                                        controls: [
                                            "play",
                                            "progress",
                                            "current-time",
                                            "mute",
                                            "volume",
                                            // "fullscreen",
                                        ],
                                        hideControls: false,
                                    }}
                                /> : (<div className="flex flex-col gap-4">
                                    <div className="text-center">
                                        <Typography variant="h4" className="mb-2!">
                                            Unable to load video
                                        </Typography>
                                        <Typography variant="subtitle2" fontWeight={400} color="text.middle">
                                            We couldn’t fetch the playable URL from the server.
                                            Please try again or sign in with Google.
                                        </Typography>
                                    </div>

                                    <div className="flex gap-4 justify-between">
                                        <GoogleLogin onSuccess={handleGetPlayableUrl} />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleGetPlayableUrl}
                                        >
                                            Retry
                                        </Button>
                                    </div>
                                </div>)
                            }
                        </div>
                    );
                } else if (mediaUrl) {
                    return <video controls src={mediaUrl} style={{ width: '100%' }} controlsList="nodownload" />;
                }
                return <p>No video available</p>;

            case 'temp_audios':
                return (
                    <SpotifyAudioPlayer
                        audioUrl={mediaUrl || ""}
                        imageUrl="/fallback.png"
                        title="Sample Audio"
                    />
                );

            case 'temp_notes':
                return mediaUrl ? (
                    // <iframe
                    //     className='h-full'
                    //     src={`https://docs.google.com/viewer?url=${encodeURIComponent(mediaUrl)}&embedded=true`}
                    //     style={{ width: '100%', border: 'none' }}
                    // />

                    // <DocumentReader fileUrl={mediaUrl} />
                    <iframe
                        className='h-full'
                        src={`${mediaUrl}`}
                        style={{ width: '100%', border: 'none' }}
                    />
                ) : (
                    <p>No PDF available</p>
                );

            default:
                return <p>Unsupported media type</p>;
        }
    };

    // const getUpcomingMedia = () => {
    //     if (!media?.id || allMedia.length === 0) return [];

    //     const currentIndex = allMedia.findIndex(v => v.id === media?.id);
    //     if (currentIndex === -1) return allMedia.slice(0, 6);

    //     const upcomingItems = allMedia.slice(currentIndex + 1, currentIndex + 7);

    //     if (upcomingItems.length < 6 && !hasMore) {
    //         return allMedia.slice(-6);
    //     }

    //     return upcomingItems;
    // };

    if (!open) {
        return null;
    }

    // const upcomingMedia = getUpcomingMedia();
    // const currentMediaId = media?.id;

    const handleDownloadNote = async () => {
        if (!mediaUrl) return;

        const link = document.createElement("a");
        link.href = mediaUrl;
        link.setAttribute("download", title ? `${title}.pdf` : "note.pdf");
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    console.log(playableUrl)
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            sx={{
                "& .MuiPaper-root": {
                    background: theme.palette.primary.contrastText,
                    borderRadius: '16px'
                },
            }}
        >
            <DialogContent sx={{ padding: '24px' }}>
                <div className='mb-4 flex justify-between items-end'>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                        {title || 'Media Viewer'}
                    </h2>
                    <div className="flex justify-end items-center gap-4">
                        <Button variant="contained" onClick={handleFullscreen} startIcon={<Maximize2 />}>
                            Fullscreen Zoom
                        </Button>
                        {type === "temp_notes" &&
                            <Button variant="contained" startIcon={<DocumentDownload />} onClick={handleDownloadNote}>
                                Download Note
                            </Button>
                        }
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 gap-4">
                    <div className="col-span-12 max-h-[500px] overflow-auto">
                        <div className="h-full overflow-auto" ref={videoRef}>
                            <WaterMark />
                            {renderContent()}
                        </div>
                    </div>
                    {/* <div className="hidden lg:block col-span-3">
                        <Typography variant='subtitle1' className='block! mb-3!' sx={{ fontWeight: 600 }}>
                            Up Next
                        </Typography>
                        <Box className="flex flex-col gap-3" sx={{
                            maxHeight: `440px`,
                            overflowY: "auto",
                        }}>
                            {upcomingMedia.length > 0 ? (
                                upcomingMedia.map((relatedVideo) => {
                                    const vidId = extractYouTubeVideoId(relatedVideo.url);
                                    const thumbnailUrl = vidId ? getYouTubeThumbnail(vidId) : '';
                                    const isCurrentlyPlaying = relatedVideo.id === currentMediaId;

                                    return (
                                        <div
                                            key={relatedVideo.id}
                                            onClick={() => !isCurrentlyPlaying && handleRelatedVideoClick(relatedVideo)}
                                            className='cursor-pointer'
                                            style={{
                                                opacity: isCurrentlyPlaying ? 0.6 : 1,
                                                pointerEvents: isCurrentlyPlaying ? 'none' : 'auto',
                                                border: isCurrentlyPlaying ? `2px solid ${theme.palette.primary.main}` : 'none',
                                                borderRadius: '8px',
                                                padding: isCurrentlyPlaying ? '4px' : '0',
                                                position: 'relative'
                                            }}
                                        >
                                            {isCurrentlyPlaying && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        right: '8px',
                                                        backgroundColor: theme.palette.primary.main,
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        zIndex: 10
                                                    }}
                                                >
                                                    Now Playing
                                                </Box>
                                            )}
                                            <div style={{
                                                position: 'relative',
                                                paddingBottom: '56.25%',
                                                background: '#000',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            }}>
                                                <img
                                                    src={thumbnailUrl || "/fallback.png"}
                                                    alt={relatedVideo.file_name}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                            <Tooltip title={relatedVideo.file_name}>
                                                <Typography
                                                    variant='subtitle1'
                                                    className='font-bold mt-1! line-clamp-1'
                                                    sx={{
                                                        color: isCurrentlyPlaying ? theme.palette.primary.main : 'inherit'
                                                    }}
                                                >
                                                    {relatedVideo.file_name}
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                    );
                                })
                            ) : (
                                <Typography variant="subtitle2" color="text.middle">
                                    {isFetching ? 'Loading more...' : 'No upcoming media available'}
                                </Typography>
                            )}
                        </Box>
                    </div> */}
                </div>

                <div className='flex flex-col gap-4 md:flex md:flex-row-reverse mt-4'>
                    <Button variant='contained' className='primary__btn'>
                        Mark as Completed
                    </Button>
                    <Button variant='contained' onClick={handleClose} className='cancel__btn'>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}