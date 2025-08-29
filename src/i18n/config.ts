import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const supportedLngs = {
  en: "English",
  ja: "日本語",
};

const loadPath = `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`;

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ja",
    fallbackLng: "en",
    returnEmptyString: false,
    supportedLngs: Object.keys(supportedLngs),
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: loadPath,
    },
  });

export default i18n;
