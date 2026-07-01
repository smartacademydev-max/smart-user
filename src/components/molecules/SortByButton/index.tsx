import { Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { ArrangeVerticalSquare, ArrowDown2 } from "iconsax-reactjs";
import { useState } from "react";

export type AlphabeticOrder = "a-z" | "z-a";

interface SortByButtonProps {
    value: AlphabeticOrder;
    onChange: (value: AlphabeticOrder) => void;
}

const OPTIONS: { label: string; value: AlphabeticOrder }[] = [
    { label: "A → Z", value: "a-z" },
    { label: "Z → A", value: "z-a" },
];

export default function SortByButton({ value, onChange }: SortByButtonProps) {
    const theme = useTheme();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const selected = OPTIONS.find((o) => o.value === value);

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<ArrangeVerticalSquare size={16} color={theme.palette.text.dark} variant="Bold" />}
                endIcon={<ArrowDown2 size={14} color={theme.palette.text.middle} />}
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{
                    whiteSpace: "nowrap",
                    border: `1px solid ${theme.palette.separator.dark}`,
                    px: 1.5,
                    py: "9px",
                }}
            >
                <Typography variant="subtitle2" color="text.dark">
                    Sort: {selected?.label}
                </Typography>
            </Button>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {OPTIONS.map((opt) => (
                    <MenuItem
                        key={opt.value}
                        selected={opt.value === value}
                        onClick={() => { onChange(opt.value); setAnchor(null); }}
                    >
                        <Typography variant="body2">{opt.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
