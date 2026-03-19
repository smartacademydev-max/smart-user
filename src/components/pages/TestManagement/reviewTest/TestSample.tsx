import { Box, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { CloseCircle, Play } from "iconsax-reactjs";
import Plyr, { type APITypes, type PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";
import { useEffect, useRef, useState } from "react";
import { useGetTestSampleQuery } from "../../../../services/testApi";
import { extractYouTubeVideoId } from "../../../../utils/extractYoutubeVideoId";
import { EmptyList } from "../../../molecules/EmptyList";
import thumbnail from "/general-thumbnail.png";

const waveAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

interface PlyrInstance {
    plyr?: APITypes;
}

export default function TestSample({ id }: { id: number | null }) {
    const { data, isLoading } = useGetTestSampleQuery({ id }, { skip: !id });
    const [pdfError, setPdfError] = useState(false);
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const playerRef = useRef<PlyrInstance | null>(null);

    const sampleUrl = data?.data?.sample_url;
    const videoUrl = data?.data?.video_url;
    const videoId = videoUrl ? extractYouTubeVideoId(videoUrl) : null;

    const handleVideoClick = () => {
        if (videoUrl) {
            setVideoDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        if (playerRef.current?.plyr) {
            try {
                (playerRef.current.plyr as any).destroy?.();
            } catch (error) {
                console.error('Error destroying player:', error);
            }
        }
        setVideoDialogOpen(false);
    };

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

    const plyrSource: PlyrProps['source'] = {
        type: "video",
        sources: [
            {
                src: videoId || "",
                provider: "youtube",
            },
        ],
    };

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

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                <Box className="aspect-12/9 flex items-center justify-center rounded-lg" sx={{
                    background: (theme) => theme.palette.primary.dark
                }}>
                    <Typography color="primary.contrastText">Loading PDF...</Typography>
                </Box>
                <Box className="aspect-12/9 flex items-center justify-center rounded-lg" sx={{
                    background: (theme) => theme.palette.primary.dark
                }}>
                    <Typography color="primary.contrastText">Loading video...</Typography>
                </Box>
            </div>
        );
    }

    if (!isLoading && !sampleUrl && !videoUrl) {
        return <EmptyList
            title="Feedback Not Available"
            description=""
        />
    }

    return (
        <>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {sampleUrl && (
                    <div>
                        <Box
                            className="aspect-12/9 rounded-lg overflow-hidden"
                            sx={{
                                background: (theme) => theme.palette.primary.dark,
                                position: 'relative'
                            }}
                        >
                            {!pdfError ? (
                                <iframe
                                    src={`${sampleUrl}`}
                                    className="w-full h-full"
                                    title="Test Sample PDF"
                                    onError={() => setPdfError(true)}
                                />
                            ) : (
                                <Box className="w-full h-full flex flex-col items-center justify-center p-4">
                                    <Typography color="primary.contrastText" className="mb-4">
                                        Unable to display PDF
                                    </Typography>
                                    <a
                                        href={sampleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        Download PDF
                                    </a>
                                </Box>
                            )}
                        </Box>
                    </div>
                )}

                {videoUrl && (
                    <Box
                        onClick={handleVideoClick}
                        className="aspect-12/9 rounded-lg overflow-hidden relative cursor-pointer transition-transform"
                        sx={{
                            background: (theme) => theme.palette.primary.dark,
                            position: 'relative'
                        }}
                    >
                        <img src={thumbnail} alt="" className="w-full h-full object-cover absolute" />

                        <Box
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {[0, 0.5, 1].map((delay, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'absolute',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        border: (theme) => `2px solid ${theme.palette.primary.contrastText}`,
                                        animation: `${waveAnimation} 2s ease-out infinite`,
                                        animationDelay: `${delay}s`,
                                    }}
                                />
                            ))}

                            <Box sx={{
                                color: (theme) => theme.palette.primary.contrastText,
                                position: 'relative',
                                zIndex: 1,
                            }}>
                                <Play variant="Bold" size={40} />
                            </Box>
                        </Box>
                    </Box>
                )}
            </div>

            {/* Video Player Dialog */}
            <Dialog
                open={videoDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="lg"
                fullWidth
                sx={{
                    "& .MuiPaper-root": {
                        background: (theme) => theme.palette.primary.contrastText,
                        borderRadius: '16px',
                        maxHeight: '90vh',
                    },
                }}
            >
                <DialogContent sx={{ padding: '24px', position: 'relative' }}>
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: 16,
                            zIndex: 10,
                            color: (theme) => theme.palette.error.main
                        }}
                    >
                        <CloseCircle size={24} />
                    </IconButton>

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Sample Video
                    </Typography>

                    <Box sx={{
                        width: '100%',
                        '& .plyr': {
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }
                    }}>
                        {videoId && plyrSource ? (
                            <Plyr
                                ref={playerRef as any}
                                source={plyrSource}
                                options={plyrOptions}
                            />
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '400px',
                                    backgroundColor: '#000',
                                    borderRadius: '8px'
                                }}
                            >
                                <Typography color="white">Invalid video URL</Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}