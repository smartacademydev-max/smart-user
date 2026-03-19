import { Typography } from "@mui/material";
import { renderHtml } from "../../../utils/renderHtml";

export default function AuthHeader({ title, description }: { title?: string; description?: string }) {
    if (!title && !description) {
        return
    }
    return (
        <div className="mb-8">
            {title ? <Typography variant="h5" className="mb-1.5! font-medium block">{title} </Typography > : ""}
            {description ? <Typography variant="subtitle2" color="text.secondary" >{renderHtml(description)}</Typography> : ""}
        </div>
    )
}
