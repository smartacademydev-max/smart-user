import { alpha, Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { ArrowLeft, Element3, Send2 } from "iconsax-reactjs";

import QuizTimer from "./QuizTimer";
import { useQuizTokens } from "./quizTokens";

/**
 * macOS slides its own chrome — the menu bar and the window's traffic-light
 * buttons — over the top edge of a full-screen page whenever the pointer
 * reaches it, and that strip lands straight on this header. On a Mac in full
 * screen the bar therefore grows by the height of that overlay so its row sits
 * clear of it; every other platform draws nothing over the page and keeps the
 * normal height.
 */
const APPLE_FULLSCREEN_INSET = 36;

const isApple =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

interface Props {
    title: string;
    questionCount: number;
    totalMarks?: number;
    answered: number;
    remainingMs?: number;
    /** Hides the submit control once the paper can no longer be submitted. */
    locked?: boolean;
    submitLabel?: string;
    /** Whether the document is in full screen right now. */
    fullscreen?: boolean;
    onOpenNavigator: () => void;
    onSubmit: () => void;
    onExit: () => void;
}

/**
 * The only chrome the test keeps: who is running it, what is being sat, how far
 * along it is, and how much time is left. Everything collapses inward as the
 * screen narrows — the second line, then the answered count, then the submit
 * label — so the row still holds on one line at 360px with the title truncating
 * rather than wrapping the controls onto a second row.
 */
export default function QuizHeader({
    title,
    questionCount,
    totalMarks,
    answered,
    remainingMs,
    locked = false,
    submitLabel = "Submit",
    fullscreen = false,
    onOpenNavigator,
    onSubmit,
    onExit
}: Props) {
    const t = useQuizTokens();

    return (
        <Box
            component="header"
            className="sticky top-0 z-30"
            sx={{
                borderBottom: "1px solid",
                borderColor: alpha(t.border, 0.7),
                // Glass rather than a solid bar: in full screen the header is the
                // only thing floating over the paper, and letting the questions
                // show through as they scroll under it keeps it reading as part
                // of the same surface instead of a second app on top.
                backgroundColor: alpha(t.surface, 0.72),
                backdropFilter: "blur(14px) saturate(180%)",
                WebkitBackdropFilter: "blur(14px) saturate(180%)",
                pt: fullscreen && isApple ? `${APPLE_FULLSCREEN_INSET}px` : 0
            }}
        >
            <Box className="flex h-14 items-center gap-2 px-3 sm:gap-3 md:px-5">
                <Tooltip title="Leave test">
                    <IconButton aria-label="Leave test" size="small" onClick={onExit}>
                        <ArrowLeft size={19} color={t.muted} />
                    </IconButton>
                </Tooltip>

                <Box className="min-w-0">
                    <Typography
                        noWrap
                        fontSize={13.5}
                        fontWeight={700}
                        sx={{ color: t.foreground }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        fontSize={11.5}
                        className="tabular-nums"
                        sx={{ color: t.muted, display: { xs: "none", sm: "block" } }}
                    >
                        {questionCount} question{questionCount === 1 ? "" : "s"}
                        {totalMarks ? ` · ${totalMarks} marks` : ""}
                    </Typography>
                </Box>

                <Box className="ml-auto flex items-center gap-2 sm:gap-3">
                    <Box
                        className="rounded-lg tabular-nums"
                        sx={{
                            display: { xs: "none", sm: "inline-flex" },
                            alignItems: "center",
                            height: 32,
                            px: 1.25,
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: t.muted,
                            border: "1px solid",
                            borderColor: t.border,
                            backgroundColor: t.surfaceMuted
                        }}
                    >
                        {answered}/{questionCount} answered
                    </Box>

                    <QuizTimer remainingMs={remainingMs} compact />

                    <IconButton
                        aria-label="Question navigator"
                        size="small"
                        onClick={onOpenNavigator}
                        sx={{ display: { lg: "none" } }}
                    >
                        <Element3 size={19} color={t.muted} />
                    </IconButton>

                    {!locked && (
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={onSubmit}
                            startIcon={<Send2 size={16} variant="Bold" />}
                            sx={{
                                fontWeight: 600,
                                minWidth: 0,
                                // Below sm the label goes and the icon carries it;
                                // startIcon keeps a right margin that would leave
                                // the glyph sitting off-centre.
                                "& .MuiButton-startIcon": {
                                    mr: { xs: 0, sm: 1 },
                                    ml: 0
                                }
                            }}
                        >
                            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                                {submitLabel}
                            </Box>
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
