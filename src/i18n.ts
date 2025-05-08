import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common";
import enFooter from "./locales/en/footer";

import frCommon from "./locales/fr/common";
import frFooter from "./locales/fr/footer";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      footer: enFooter,
    },
    fr: {
      common: frCommon,
      footer: frFooter,
    },
  },
  lng: "en",
  fallbackLng: "en",
  ns: ["common", "footer"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
