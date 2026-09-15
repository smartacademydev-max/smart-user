import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useQuizTokens } from "../../pages/TestManagement/singleTest/quizTokens";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RingProps {
    /** 0–100. Drives the sweep. */
    percentage: number;
    /** Marks obtained. Printed in the middle, where the eye lands. */
    score: number;
    /** The paper's full marks. Omitted or 0 leaves the score standing alone. */
    fullMark?: number;
    size?: number;
    /** Replays the sweep when this changes — e.g. a dialog reopening. */
    animateKey?: unknown;
}

/**
 * The result as one mark: the percentage as the sweep, because that is the shape
 * of a score a student recognises across the room, and the marks in the middle,
 * because that is the number they actually came for.
 */
export function ScoreRing({ percentage, score, fullMark = 0, size = 132, animateKey }: RingProps) {
    const t = useQuizTokens();
    const clamped = Math.max(0, Math.min(percentage, 100));

    /** Drawn empty, then filled on the next frame, so it sweeps in rather than
     *  arriving already complete. */
    const [drawn, setDrawn] = useState(false);

    useEffect(() => {
        setDrawn(false);
        const id = requestAnimationFrame(() => setDrawn(true));
        return () => cancelAnimationFrame(id);
    }, [animateKey]);

    return (
        <Box sx={{ position: "relative", width: size, height: size, mx: "auto" }}>
            <Box
                component="svg"
                viewBox="0 0 120 120"
                sx={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
                aria-hidden
            >
                <circle cx="60" cy="60" r={RADIUS} fill="none" stroke={t.surfaceMuted} strokeWidth="9" />
                <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    stroke={t.primary}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={drawn ? CIRCUMFERENCE * (1 - clamped / 100) : CIRCUMFERENCE}
                    style={{ transition: "stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)" }}
                />
            </Box>

            <Box
                className="absolute inset-0 flex flex-col items-center justify-center"
                sx={{ lineHeight: 1 }}
            >
                <Typography
                    className="tabular-nums"
                    fontSize={size >= 120 ? 26 : 21}
                    fontWeight={700}
                    sx={{ color: t.foreground }}
                >
                    {fullMark > 0 ? `${score}/${fullMark}` : score}
                </Typography>
                <Typography
                    className="tabular-nums"
                    fontSize={12}
                    fontWeight={600}
                    sx={{ color: t.muted, mt: 0.5 }}
                >
                    {Math.round(clamped)}%
                </Typography>
            </Box>
        </Box>
    );
}

/**
 * One figure, on its own line. A grid of coloured tiles gave every number the
 * same weight as the score itself, and made a quiet result look like a warning —
 * so only the two figures that carry a verdict take any colour at all.
 */
export function ResultRow({
    label,
    value,
    tone,
}: {
    label: string;
    value: string | number;
    tone?: string;
}) {
    const t = useQuizTokens();

    return (
        <Box
            className="flex items-baseline justify-between gap-4 py-2.5"
            sx={{ borderBottom: "1px solid", borderColor: t.border }}
        >
            <Typography component="dt" fontSize={13} sx={{ color: t.muted }}>
                {label}
            </Typography>
            <Typography
                component="dd"
                className="tabular-nums"
                fontSize={13}
                fontWeight={600}
                sx={{ color: tone ?? t.foreground, m: 0 }}
            >
                {value}
            </Typography>
        </Box>
    );
}

/**
 * The thresholds are percentage bands, so they must be fed the percentage —
 * given raw marks, a 3.2/8 always fell into the lowest band.
 */
export function getScoreMessage(percentage: number): string {
    if (Number(percentage) < 40) {
        return "Every expert was once a beginner. Review your mistakes and try again.";
    }
    if (Number(percentage) < 60) {
        return "You're improving. A little more practice will show in the next attempt.";
    }
    if (Number(percentage) < 80) {
        return "Good work — you're close to mastering this.";
    }
    return "Excellent score. Your preparation is clearly paying off.";
}

/**
 * The API derives `percentage` from the sum of each question's own `points`,
 * which is null on any test marked with a flat `marks_per_question` — so a whole
 * class of results arrives as 0% however well it was scored. The marks against
 * the paper's full marks are the same figure, so they stand in rather than
 * showing an empty ring beside a passing score.
 */
export function resolvePercentage(percentage: number, score: number, fullMark: number): number {
    if (percentage > 0) return Number(percentage);
    if (fullMark > 0) return Math.min(100, Math.round((score / fullMark) * 100));
    return 0;
}
