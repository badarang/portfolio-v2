import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { localizedContent } from "./data/localized";

export const languages = [
  { code: "ko", short: "한", label: "한국어", locale: "ko-KR" },
  { code: "en", short: "EN", label: "English", locale: "en-US" },
  { code: "zh", short: "中", label: "中文", locale: "zh-CN" },
  { code: "ja", short: "日", label: "日本語", locale: "ja-JP" },
];

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return "ko";
  const saved = window.localStorage.getItem("language");
  if (languages.some((language) => language.code === saved)) return saved;

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("ko")) return "ko";
  if (browserLanguage.startsWith("zh")) return "zh";
  if (browserLanguage.startsWith("ja")) return "ja";
  return "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const meta = localizedContent[language] ?? localizedContent.ko;
    const languageMeta = languages.find((item) => item.code === language) ?? languages[0];
    document.documentElement.lang = languageMeta.locale;
    document.title = meta.documentTitle;
    window.localStorage.setItem("language", language);
  }, [language]);

  const value = useMemo(() => {
    const content = localizedContent[language] ?? localizedContent.ko;
    const languageMeta = languages.find((item) => item.code === language) ?? languages[0];

    return {
      language,
      languageMeta,
      languages,
      setLanguage,
      content,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }
  return context;
}
