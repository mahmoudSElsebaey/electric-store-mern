// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// استيراد ملفات الترجمة بطريقة صحيحة وآمنة مع TypeScript
import arTranslations from "./locales/ar/translation.json";
import enTranslations from "./locales/en/translation.json";

const resources = {
  ar: {
    translation: arTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar",
    lng: "ar", // البداية عربي
    interpolation: {
      escapeValue: false, // React بيحمي من XSS تلقائيًا
    },
    detection: {
      order: ["localStorage", "navigator"], // أولاً localStorage ثم لغة المتصفح
      caches: ["localStorage"], // يحفظ الاختيار
      lookupLocalStorage: "i18nextLng", // اسم المفتاح في localStorage
    },
  });

// إضافة حدث عند تغيير اللغة عشان نغير الـ dir تلقائيًا
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

export default i18n;
