import { Box, Button } from "@mui/material";
import { ArrowLeft, ArrowRight, Flag } from "iconsax-reactjs";

import { useQuizTokens } from "./quizTokens";

interface Props {
    index: number;
    total: number;
    flagged: boolean;
    /** True once the paper can no longer be answered or submitted. */
    locked?: boolean;
    onPrev: () => void;
    onNext: () => void;
    onToggleFlag: () => void;
    onSubmit: () => void;
}

/**
 * Move, mark, move on. The flag sits in the middle rather than beside Next
 * because it is not part of advancing — it is the thing a student reaches for
 * when they are about to leave a question unresolved.
 */
export default function QuestionPager({
    index,
    total,
    flagged,
    locked = false,
    onPrev,
    onNext,
    onToggleFlag,
    onSubmit
}: Props) {
    const t = useQuizTokens();
    const isLast = index >= total - 1;

    return (
        <Box
            className="mt-10 flex items-center justify-between gap-2 pt-5"
            sx={{ borderTop: "1px solid", borderColor: t.border }}
        >
            <Button
                size="small"
                variant="outlined"
                color="primary"
                disabled={index === 0}
                onClick={onPrev}
                startIcon={<ArrowLeft size={15} />}
                sx={{ fontWeight: 600 }}
            >
                Previous
            </Button>

            <Button
                size="small"
                onClick={onToggleFlag}
                aria-pressed={flagged}
                startIcon={<Flag size={15} variant={flagged ? "Bold" : "Linear"} />}
                sx={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    color: flagged ? t.accent : t.muted,
                    backgroundColor: flagged ? t.warningSoft : "transparent",
                    "&:hover": {
                        backgroundColor: flagged ? t.warningSoft : t.surfaceMuted
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    {flagged ? "Flagged" : "Flag for review"}
                </Box>
            </Button>

            <Button
                size="small"
                variant="contained"
                color="primary"
                disabled={isLast && locked}
                onClick={isLast ? onSubmit : onNext}
                endIcon={isLast ? undefined : <ArrowRight size={15} />}
                sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
            >
                {isLast ? "Review & submit" : "Next"}
            </Button>
        </Box>
    );
}
