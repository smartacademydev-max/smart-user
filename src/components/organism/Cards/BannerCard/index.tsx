import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import type { BannerProps } from "../../../../types/content";
import type { NotifiableTypes } from "../../../../types/notification";

export default function BannerCard({ data }: { data: BannerProps }) {
    const navigate = useNavigate();
    const handleBannerClick = (type: NotifiableTypes) => {
        switch (type) {
            case "general":
                return
            case "live_class":
                return navigate(PATH.LIVE_CLASSES.ROOT)
        }
    }
    return (
        <Box className="banner__card rounded-2xl 2xl:rounded-4xl flex items-center justify-start overflow-hidden h-full" onClick={() => handleBannerClick(data?.notifiable_type)}>
            <img src={data?.image_url} alt="" className="object-cover w-full h-full" />
        </Box>
    )
}
