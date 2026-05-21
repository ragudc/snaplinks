"use client"

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { en, type Translations } from "@/lib/i18n/en"
import { es } from "@/lib/i18n/es"

export type Language = "en" | "es"

const STORAGE_KEY    = "snaplinks-lang"
const DEFAULT_LANG: Language = "en"

const TRANSLATIONS: Record<Language, Translations> = { en, es }

interface LanguageContextType {
  language:       Language
  t:              Translations
  setLanguage:    (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

function getLanguageSnapshot(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "en" || saved === "es") return saved
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_LANG
}

function subscribeToLanguage(callback: () => void): () => void {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore: client reads localStorage, server always returns DEFAULT_LANG
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    () => DEFAULT_LANG,
  )

  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
      // Dispatch storage event so useSyncExternalStore re-reads the snapshot
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: lang }))
    } catch {
      // Silence localStorage error
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "es" : "en")
  }, [language, setLanguage])

  return (
    <LanguageContext.Provider
      value={{
        language,
        t:              TRANSLATIONS[language],
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation(): LanguageContextType {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useTranslation must be used inside <LanguageProvider>")
  }
  return ctx
}
