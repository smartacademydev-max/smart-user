import { Box, Typography } from "@mui/material";

import { useThemeSettings } from "../../../../hooks/useThemeSettings";
import { useAppSelector } from "../../../../store/hook";

import { useQuizTokens } from "./quizTokens";

interface Props {
    /** Logo height in pixels. */
    size?: number;
}

/**
 * The only piece of brand on the test screen. Name and artwork come from the
 * API at runtime, so the same screen carries whichever brand the deployment is
 * serving — never a hardcoded one. The name is kept as the logo's alt text and
 * as the fallback, so a deployment that has uploaded no artwork still reads as
 * itself rather than as a broken image.
 */
export default function QuizBrand({ size = 28 }: Props) {
    const mode = useAppSelector((state) => state.smart_theme.mode);
    const { brandName, logoUrl, logoDarkUrl } = useThemeSettings();
    const t = useQuizTokens();

    // The "dark" logo is the dark-coloured one — it belongs on a light page.
    const logo = mode === "light" ? logoDarkUrl : logoUrl;

    if (!logo) {
        return (
            <Typography fontWeight={700} fontSize={15} sx={{ color: t.primary }}>
                {brandName}
            </Typography>
        );
    }

    return (
        <Box
            component="img"
            src={logo}
            alt={brandName}
            sx={{ height: size, width: "auto", flexShrink: 0, objectFit: "contain" }}
        />
    );
}
