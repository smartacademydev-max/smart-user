import { Box, Stack, Typography } from "@mui/material";
import { Video } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { PlaylistProps } from "../../../types/course";

export default function PlaylistCard({ data, courseId, countLabel = "Videos", onClick }: { data: PlaylistProps; courseId?: number; countLabel?: string; onClick?: () => void }) {
    const navigate = useNavigate();
    const handleClick = onClick ?? (() => navigate(PATH.VIDEOS.VIEW_PLAYLIST.ROOT(Number(data.chapter_id), courseId)));
    return (
        <Box className="relative cursor-pointer mt-4! z-10" onClick={handleClick}>
            <Box className="layer__01 absolute left-1/2 -translate-x-1/2 -top-1.5 -z-1" sx={{
                width: "calc(100% - 12px)",
                height: "8px",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                background: (theme) => theme.palette.separator.darker
            }} />
            <Box className="layer__02 absolute left-1/2 -translate-x-1/2 -top-3 -z-2" sx={{
                width: "calc(100% - 32px)",
                height: "8px",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                background: (theme) => theme.palette.separator.dark
            }} />
            <Box className="aspect-120/70 relative flex flex-col gap-4 justify-center items-center text-center rounded-md mb-1.5 overflow-hidden" sx={{
                background: (theme) => theme.palette.separator.dark,
                color: (theme) => theme.palette.primary.contrastText,
            }}>
                {/* <Typography variant="subtitle1">{data?.chapter_name}</Typography> */}
                <img src="/fallback.png" alt="" className="w-full h-full object-cover" />
                <Stack className="items-center gap-1 absolute bottom-4 right-4 rounded-lg py-2 px-4" sx={(theme) => ({
                    background:
                        theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.9)"
                            : "rgba(255,255,255,0.9)",
                })}>
                    <Video size={16} />
                    <Typography variant="subtitle2">{data?.count} {countLabel}</Typography>
                </Stack>
            </Box>
            <Typography variant="h6" className="line-clamp-3" fontWeight={600}>{data?.chapter_name}</Typography>
        </Box>
    )
}
