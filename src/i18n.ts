import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import tl from "./locales/tl.json";

// Type-define 'en' as the master schema
type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], "en" | "tl">({
  legacy: false, // use Composition API
  locale: "en", // set default locale
  fallbackLocale: "en", // set fallback locale
  messages: {
    en,
    tl,
  },
});

export default i18n;
