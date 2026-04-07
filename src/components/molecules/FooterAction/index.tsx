import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { replace } from "react-router-dom";

interface FooterActionProps {
    handleConfirmationChange?: () => void;
    isLoading?: boolean;
    isUpdating?: boolean;
    isEditMode?: boolean;
    replaceLabel?: string;
    buttonLabel?: string;
    onDraft?: () => void;
}

export default function FooterAction({
    handleConfirmationChange,
    isLoading = false,
    isUpdating = false,
    isEditMode = false,
    buttonLabel,
    replaceLabel,
    onDraft
}: FooterActionProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Box
            className="footer__action flex justify-end items-center gap-2 pt-6 mt-8 sticky bottom-0"
            sx={{
                borderTop: `1px solid ${theme.palette.separator.dark}`,
                background: theme.palette.primary.contrastText,
            }}
        >
            {onDraft ? <Button variant="outlined" color="primary" startIcon={<SaveIcon />} onClick={onDraft}>
                <Typography variant="subtitle2">
                    {t("actions.draft")}
                </Typography>
            </Button> : ""}
            {/* CANCEL BUTTON */}
            <Button
                variant="contained"
                sx={{
                    background: theme.palette.separator.dark,
                    color: theme.palette.text.middle,
                }}
                onClick={handleConfirmationChange}
            >
                <Typography variant="subtitle2">
                    {t("actions.cancel")}
                </Typography>
            </Button>

            {/* CREATE / UPDATE BUTTON */}
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading || isUpdating}
            >
                {!replace ? <Typography variant="body2">
                    {isEditMode
                        ? isUpdating
                            ? `Updating ${buttonLabel}`
                            : `Update ${buttonLabel}`
                        : isLoading
                            ? `Creating ${buttonLabel}`
                            : `Create ${buttonLabel}`}
                </Typography> : <Typography variant="subtitle2">
                    {replaceLabel}
                </Typography>}
            </Button>
        </Box>
    );
}
