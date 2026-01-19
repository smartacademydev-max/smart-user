import { Box, Button, FormControlLabel, Radio, Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { setLanguage } from "../../../../slice/themeSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";

export default function SelectPreferedLanguage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const langOptions = [
        {
            label: t("messages.english"),
            value: "en",
            icon: "/english.svg"
        },
        {
            label: t("messages.nepali"),
            value: "np",
            icon: "/nepal.svg"
        },
    ]

    const { lang: selectedLanguage } = useAppSelector((state) => state.udaan_theme);

    const handleLanguageSelect = (lang: "en" | "np") => {
        dispatch(setLanguage(lang));
        i18n.changeLanguage(lang);
    };

    useEffect(() => {
        if (selectedLanguage) {
            navigate(PATH.AUTH.LOGIN.ROOT, { replace: true });
        }
    }, [navigate]);
    return (
        <Box className="min-h-screen flex justify-center items-center">
            <div className="container mx-auto px-4">
                <div className="content w-full lg:max-w-[592px] mx-auto">
                    <div className="header text-center">
                        <img src="/udaan-welcome.png" alt="" className='h-auto max-w-[210px] mx-auto' />
                        <div className="mt-6">
                            <Typography variant='h4' color='primary'>{t("messages.welcome_to_udaan")}</Typography>
                            <Typography variant='h4' color='primary'>{t("messages.welcom_message_udaan")}</Typography>
                        </div>
                    </div>
                    <div className="label mt-4 md:mt-8 mb-4 md:mb-6">
                        <Typography variant="subtitle2" className="font-medium">{t("messages.select_your_prefered_language")}</Typography>
                        <Typography variant="subtitle2" className="font-medium" color="text.middle">{t("messages.select_your_prefered_language_message")}</Typography>
                    </div>
                    <div className="language__options mb-5 lg:mb-32 flex flex-col gap-4">
                        {langOptions.map((lang) => {
                            const isSelected = lang.value === selectedLanguage;

                            return (
                                <FormControlLabel
                                    key={lang.value}
                                    onClick={() => handleLanguageSelect(lang.value as "en" | "np")}
                                    control={<Radio color="primary"
                                        checked={isSelected}
                                    />} className="items-center! flex-row-reverse! justify-between! w-full py-2 px-4 rounded-xl"
                                    sx={{
                                        border: `1px solid `,
                                        borderColor: (theme) => isSelected ? theme.palette.primary.main : theme.palette.separator.dark
                                    }}
                                    label={
                                        <div className="flex items-center justify-start gap-3">
                                            <img src={lang.icon} alt="" className="min-w-8" />
                                            <Typography color="text.dark" variant="body2">{lang.label}</Typography>
                                        </div>
                                    } />
                            )
                        })}

                    </div>
                    <Button variant="contained" color="primary" fullWidth onClick={() => navigate(PATH.AUTH.INTRO.ROOT)}>{t("messages.get_started")}</Button>
                </div>
            </div>
        </Box>
    )
}
