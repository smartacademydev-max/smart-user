import { Box, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { ArrowRight2 } from "iconsax-reactjs";
import { Link } from "react-router-dom";

type Variant = "playlist" | "card" | "row";

interface Props {
    extra: number;
    url: string;
    label?: string;
    variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
    // Matches PlaylistCard footprint (aspect-120/70 thumbnail + title line).
    playlist: "aspect-120/70 mt-4!",
    // Matches LiveClassCard / TestCard footprint (general purpose card).
    card: "min-h-[180px]",
    // Matches small MediaCard horizontal row.
    row: "min-h-[78px]",
};

export default function ViewAllTile({ extra, url, label = "items", variant = "playlist" }: Props) {
    return (
        <Link to={url} className="block">
            <Box
                className={`rounded-md flex flex-col gap-1 items-center justify-center text-center cursor-pointer transition ${variantStyles[variant]}`}
                sx={(theme: Theme) => ({
                    border: `1px dashed ${theme.palette.divider}`,
                    background: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                    "&:hover": {
                        background: theme.palette.action.selected,
                    },
                })}
            >
                <Typography variant="h5" fontWeight={700}>
                    +{extra} More
                </Typography>
                <Box className="flex items-center gap-1 text-sm" sx={{ color: "text.secondary" }}>
                    <span>View all {label}</span>
                    <ArrowRight2 size={14} />
                </Box>
            </Box>
        </Link>
    );
}
