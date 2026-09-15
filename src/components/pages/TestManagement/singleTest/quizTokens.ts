import { alpha, useTheme } from "@mui/material";

/**
 * The test screen is drawn against a small set of semantic roles — surface,
 * border, accent and so on. Most map straight onto a SMART palette entry; the
 * handful that have no entry (a muted surface, a focus ring) are derived here
 * once so every part of the screen reaches for the same value instead of
 * inventing its own tint.
 */
export function useQuizTokens() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return {
        theme,
        isDark,
        background: theme.palette.background.default,
        surface: theme.palette.background.paper,
        /** A step back from `surface`, for code blocks and stat tiles. */
        surfaceMuted: isDark
            ? alpha(theme.palette.common.white, 0.04)
            : theme.palette.gray.gray1,
        border: theme.palette.separator.dark,
        borderStrong: theme.palette.separator.darker,
        foreground: theme.palette.text.dark,
        muted: theme.palette.text.middle,
        primary: theme.palette.primary.main,
        primaryForeground: theme.palette.primary.contrastText,
        primarySoft: theme.palette.primary.light,
        /**
         * A flag is the student's own mark, not the app's — so it takes the
         * warning orange rather than the brand crimson already spent on
         * "selected" and "answered".
         */
        accent: theme.palette.warning.main,
        success: theme.palette.success.main,
        successSoft: theme.palette.success.light,
        warning: theme.palette.warning.main,
        warningSoft: theme.palette.warning.light,
        danger: theme.palette.error.main,
        dangerSoft: theme.palette.error.light,
        ring: alpha(theme.palette.primary.main, 0.4)
    };
}

/** `mm:ss`, or `hh:mm:ss` once there is an hour or more left. */
export function formatClock(ms?: number): string {
    if (ms === undefined) return "--:--";

    const total = Math.max(Math.floor(ms / 1000), 0);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const pad = (value: number) => String(value).padStart(2, "0");

    return hours > 0
        ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(minutes)}:${pad(seconds)}`;
}

/** Spoken form for the timer's `aria-label`, which "38:12" does not give. */
export function spellClock(ms?: number): string {
    if (ms === undefined) return "unknown";

    const total = Math.max(Math.floor(ms / 1000), 0);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;

    return `${minutes} minute${minutes === 1 ? "" : "s"} and ${seconds} second${seconds === 1 ? "" : "s"}`;
}
