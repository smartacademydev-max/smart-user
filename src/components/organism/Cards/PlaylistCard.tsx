import { Box, Stack, Typography } from "@mui/material";
import { Video } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { PlaylistProps } from "../../../types/course";

export default function PlaylistCard({ data, courseId }: { data: PlaylistProps; courseId?: number }) {
    const navigate = useNavigate();
    return (
        <Box className="relative cursor-pointer mt-4! z-10" onClick={() => navigate(PATH.VIDEOS.VIEW_PLAYLIST.ROOT(Number(data.chapter_id), courseId))}>
            <Box className="layer__01 absolute left-1/2 -translate-x-1/2 -top-1.5 -z-1 rounded-md" sx={{
                width: "calc(100% - 12px)",
                height: "8px",
                background: (theme) => theme.palette.separator.darker
            }} />
            <Box className="layer__02 absolute left-1/2 -translate-x-1/2 -top-3 -z-2 rounded-md" sx={{
                width: "calc(100% - 32px)",
                height: "8px",
                background: (theme) => theme.palette.separator.dark
            }} />
            <Box className="aspect-120/70 relative flex flex-col gap-4 justify-center items-center text-center rounded-md mb-1.5 px-4" sx={{
                background: (theme) => theme.palette.primary.dark,
                color: (theme) => theme.palette.primary.contrastText,
            }}>
                <Typography variant="subtitle1">{data?.chapter_name}</Typography>
                <Stack className="items-center gap-1 absolute bottom-4 right-4 rounded-lg py-2 px-4" sx={{
                    background: "rgba(255,255,255,0.3)"
                }}>
                    <Video size={16} />
                    <Typography variant="subtitle2">{data?.count} Videos</Typography>
                </Stack>
            </Box>
            <Typography variant="h6" fontWeight={600}>{data?.chapter_name}</Typography>
        </Box>
    )
}
