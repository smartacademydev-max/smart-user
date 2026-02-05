import { Box } from "@mui/material";
import type { BannerProps } from "../../../../types/content";

export default function BannerCard({ data }: { data: BannerProps }) {
    return (
        <Box className="banner__card rounded-2xl 2xl:rounded-4xl flex items-center justify-start overflow-hidden h-full" >
            {/* <div className="content px-6 py-8 2xl:py-14 2xl:px-11 flex flex-col gap-4">
                <Typography variant="h3" fontWeight={600}>{data?.title}</Typography>
                <Typography variant="subtitle2">{renderHtml(data?.description)}</Typography>
                <Button className="max-w-fit" variant="contained" color="error">{data?.btn_title}</Button>
            </div> */}
            <img src={data?.image_url} alt="" className="object-cover w-full h-full" />
        </Box>
    )
}
