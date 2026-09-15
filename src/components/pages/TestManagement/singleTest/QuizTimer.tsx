import { Box } from "@mui/material";
import { Timer1 } from "iconsax-reactjs";

import { formatClock, spellClock, useQuizTokens } from "./quizTokens";

interface Props {
    remainingMs?: number;
    /** The header's variant: shorter, smaller type. */
    compact?: boolean;
}

/** Five minutes and one minute, in milliseconds. */
const WARN_AT = 5 * 60 * 1000;
const CRITICAL_AT = 60 * 1000;

/**
 * The clock, in three tones: quiet while there is time, amber under five
 * minutes, red and pulsing under one. It only announces itself once it turns
 * amber — a screen reader reading out every second for 45 minutes would drown
 * out the questions.
 */
export default function QuizTimer({ remainingMs, compact = false }: Props) {
    const t = useQuizTokens();

    const tone =
        remainingMs === undefined ? "normal"
            : remainingMs <= CRITICAL_AT ? "critical"
                : remainingMs <= WARN_AT ? "warn"
                    : "normal";

    const palette = {
        normal: { bg: t.surface, border: t.border, color: t.foreground },
        warn: { bg: t.warningSoft, border: t.warning, color: t.warning },
        critical: { bg: t.dangerSoft, border: t.danger, color: t.danger }
    }[tone];

    return (
        <Box
            role="timer"
            aria-live={tone === "normal" ? "off" : "polite"}
            aria-label={`Time remaining ${spellClock(remainingMs)}`}
            className="inline-flex items-center gap-2 rounded-lg tabular-nums"
            sx={{
                height: compact ? 32 : 38,
                px: compact ? 1.25 : 1.75,
                fontSize: compact ? 13 : 15,
                fontWeight: 600,
                border: "1px solid",
                borderColor: palette.border,
                backgroundColor: palette.bg,
                color: palette.color,
                transition: "background-color .3s ease, border-color .3s ease, color .3s ease",
                animation: tone === "critical" ? "quizPulse 1.4s ease-in-out infinite" : "none",
                "@keyframes quizPulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.55 }
                }
            }}
        >
            <Timer1 size={compact ? 15 : 17} variant="Bold" aria-hidden />
            {formatClock(remainingMs)}
        </Box>
    );
}
