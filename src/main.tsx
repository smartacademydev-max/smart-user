import AppErrorBoundary from "./components/organism/ErrorBoundary/AppErrorBoundary.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import "./App.css";
import AppController from "./AppController.tsx";
import ReadingDialog from "./components/organism/Dialog/ReadingDialog.tsx";
import SessionExpiredPopup from "./components/organism/Dialog/SessonExpired.tsx";
import Toast from "./components/organism/Toast/index.tsx";
import Loading from "./Loading.tsx";
import GlobalRoutes from "./routes/Routes.tsx";
import { store } from "./store/store.ts";
import "./style.scss";
import GlobalThemeProvider from "./ThemeProvider.tsx";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    backend: {
      loadPath: "/languages/{{lng}}/index.json",
    },
    detection: {
      order: ["queryString", "cookie"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
    keySeparator: ".",
  });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <GlobalThemeProvider>
          <Suspense fallback={<Loading />}>

            <GoogleOAuthProvider clientId='361289665406-npg48sokjoqcdepd1qov5dq4l6meipri.apps.googleusercontent.com'>
              <AppController>
                <AppErrorBoundary>
                  <GlobalRoutes />
                </AppErrorBoundary>
                <Toast />
                <SessionExpiredPopup />
                <ReadingDialog />
              </AppController>
            </GoogleOAuthProvider>
          </Suspense>
        </GlobalThemeProvider>
      </I18nextProvider>
    </Provider>
  </StrictMode>,
);
