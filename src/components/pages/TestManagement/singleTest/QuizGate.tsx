import { Box, Button, Typography } from "@mui/material";
import { Warning2 } from "iconsax-reactjs";

import QuizBrand from "./QuizBrand";
import QuizTimer from "./QuizTimer";
import { useQuizTokens } from "./quizTokens";

interface Props {
    /** The clock has not stopped while the student is here, so it is shown. */
    remainingMs?: number;
    busy?: boolean;
    error?: string | null;
    onContinue: () => void;
    /**
     * Leaving from here. The gate covers the header, so without this the only
     * way out of a test being sat outside full screen is the browser's own
     * back button — which abandons the attempt with no warning at all.
     */
    onBack?: () => void;
}

/**
 * The one thing that stands between a student and the paper: a test being sat
 * outside full screen.
 *
 * Nothing gates the start — pressing Start on the test card is the decision, and
 * asking again on arrival only put a card in front of a clock that had not begun.
 * This appears when the screen is not full: usually because the student left it
 * mid-attempt, occasionally because the browser turned the first request down.
 *
 * It is rendered inside the runner's overlay so that it still covers the paper
 * while the document is full screen.
 */
export default function QuizGate({
    remainingMs,
    busy = false,
    error,
    onContinue,
    onBack
}: Props) {
    const t = useQuizTokens();

    return (
        <Box
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            sx={{
                backgroundColor: t.background,
                backdropFilter: "blur(6px)"
            }}
        >
            <Box
                role="dialog"
                aria-modal="true"
                aria-labelledby="quiz-gate-title"
                className="w-full max-w-md rounded-2xl p-6"
                sx={{
                    backgroundColor: t.surface,
                    border: "1px solid",
                    borderColor: t.border,
                    boxShadow: "0 18px 40px -24px rgba(0,0,0,.45)",
                    animation: "quizScaleIn .16s ease-out",
                    "@keyframes quizScaleIn": {
                        from: { opacity: 0, transform: "scale(.98)" },
                        to: { opacity: 1, transform: "scale(1)" }
                    }
                }}
            >
                <Box className="mb-5 flex items-center gap-3">
                    <QuizBrand size={30} />
                </Box>

                <Typography
                    id="quiz-gate-title"
                    fontSize={19}
                    fontWeight={700}
                    sx={{ color: t.foreground }}
                >
                    Continue in full screen
                </Typography>

                {/* True whether they left full screen or never got there, so the
                    card reads correctly in both cases. */}
                <Typography fontSize={13.5} lineHeight={1.7} sx={{ color: t.muted, mt: 0.5 }}>
                    This test runs in full screen. Your answers are saved and the
                    clock is still running.
                </Typography>

                <Box className="mt-5 flex justify-center">
                    <QuizTimer remainingMs={remainingMs} />
                </Box>

                {error && (
                    <Box
                        className="mt-4 flex items-start gap-2 rounded-lg p-3"
                        sx={{
                            backgroundColor: t.dangerSoft,
                            border: "1px solid",
                            borderColor: t.danger
                        }}
                    >
                        <Warning2 size={17} variant="Bold" color={t.danger} aria-hidden />
                        <Typography fontSize={12.5} sx={{ color: t.danger }}>
                            {error}
                        </Typography>
                    </Box>
                )}

                <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    disabled={busy}
                    onClick={onContinue}
                    sx={{ mt: 3, fontWeight: 600 }}
                >
                    {busy ? "Please wait…" : "Return to full screen"}
                </Button>

                {onBack && (
                    <Button
                        fullWidth
                        size="small"
                        disabled={busy}
                        onClick={onBack}
                        sx={{ mt: 1, fontWeight: 600, color: t.muted }}
                    >
                        Leave test
                    </Button>
                )}
            </Box>
        </Box>
    );
}
