import { Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useGetControlsQuery } from "./services/controlsApi";
import { useAppSelector } from "./store/hook";

export default function WaterMark() {
    const user = useAppSelector((state) => state.auth.user);
    const { data } = useGetControlsQuery();
    const [position, setPosition] = useState({ top: "40%", left: "30%" });

    useEffect(() => {
        const interval = setInterval(() => {
            const randomTop = Math.random() * 70 + 10;
            const randomLeft = Math.random() * 70 + 10;
            setPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const text = useMemo(() => {
        const template = data?.data?.watermark_message?.trim();
        const fallback = `${user?.phone ?? ""} | ${user?.name ?? ""}`;
        if (!template) return fallback;
        return template
            .replace(/\{\{\s*name\s*\}\}/gi, user?.name ?? "")
            .replace(/\{\{\s*phone\s*\}\}/gi, user?.phone ?? "")
            .replace(/\{\{\s*email\s*\}\}/gi, user?.email ?? "");
    }, [data?.data?.watermark_message, user?.name, user?.phone, user?.email]);

    return (
        <div
            style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                transform: "rotate(-25deg)",
                zIndex: 2147483647,
                opacity: 0.25,
                pointerEvents: "none",
                transition: "all 0.6s ease-in-out",
            }}
        >
            <Typography fontSize={18} fontWeight={600} color="text.middle" whiteSpace="pre-line">
                {text}
            </Typography>
        </div>
    )
}
