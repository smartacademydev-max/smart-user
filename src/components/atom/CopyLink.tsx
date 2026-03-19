"use client";

import { Button } from "@mui/material";
import { Share, TickCircle } from "iconsax-reactjs";
import { useState } from "react";

export default function CopyLink() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 3000);
        } catch (error) {
            console.error("Failed to copy link:", error);
        }
    };

    return (
        <Button variant="contained" color="primary" disabled={copied} onClick={handleCopy} startIcon={copied ? <TickCircle /> : <Share />} sx={{
            // color: (theme) => theme.palette.separator.darkest
        }}>
            {copied ? "Link Copied" : "Copy Link"}
        </Button>
    );
}
