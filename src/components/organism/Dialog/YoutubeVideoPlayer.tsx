import { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ mediaId }: { mediaId: string }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const onYouTubeIframeAPIReady = () => {
            if (!iframeRef.current) return;

            playerRef.current = new (window as any).YT.Player(iframeRef.current, {
                videoId: mediaId,
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    playsinline: 1,
                    controls: 0, // we’ll render custom controls
                    disablekb: 1, // disable keyboard shortcuts
                },
                events: {
                    onReady: () => setIsReady(true),
                },
            });
        };

        if (!(window as any).YT) {
            // Load API
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
            (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        } else {
            onYouTubeIframeAPIReady();
        }
    }, [mediaId]);

    const play = () => playerRef.current?.playVideo();
    const pause = () => playerRef.current?.pauseVideo();
    const forward = (seconds: number) => {
        const current = playerRef.current?.getCurrentTime() || 0;
        playerRef.current?.seekTo(current + seconds, true);
    };
    const backward = (seconds: number) => {
        const current = playerRef.current?.getCurrentTime() || 0;
        playerRef.current?.seekTo(Math.max(0, current - seconds), true);
    };

    return (
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
            <iframe
                ref={iframeRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    pointerEvents: 'none', // disables right-click & dragging
                }}
                src={`https://www.youtube.com/embed/${mediaId}?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
                allow="autoplay; encrypted-media; fullscreen"
            />
            {isReady && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        paddingBottom: '8px',
                        gap: '8px',
                    }}
                >
                    <button onClick={() => backward(10)}>⏪ 10s</button>
                    <button onClick={play}>▶️</button>
                    <button onClick={pause}>⏸️</button>
                    <button onClick={() => forward(10)}>10s ⏩</button>
                </div>
            )}
        </div>
    );
};
