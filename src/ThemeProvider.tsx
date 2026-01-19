import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeMode } from './slice/themeSlice';
import { useAppSelector } from './store/hook';
import type { RootState } from './store/store';
import { createAppTheme } from './theme';

export default function UdaanThemeProvider({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();
    const { lang, mode } = useAppSelector(
        (state: RootState) => state.udaan_theme
    );

    const theme = React.useMemo(() => {
        // const themeMode =
        //     mode === ThemeMode.AUTO
        //         ? window.matchMedia("(prefers-color-scheme: dark)").matches
        //             ? "dark"
        //             : "light"
        //         : mode;
        const themeMode =
            mode === ThemeMode.DARK
                ? "dark"
                : "light";
        return createAppTheme(themeMode as "light" | "dark");
    }, [mode]);

    React.useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang, i18n]);

    React.useEffect(() => {
        // if (mode === ThemeMode.AUTO) {
        //     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        //     const handleChange = () => {
        //         window.dispatchEvent(new Event("theme-change"));
        //     };

        //     mediaQuery.addEventListener("change", handleChange);
        //     return () => mediaQuery.removeEventListener("change", handleChange);
        // }
    }, [mode]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}
