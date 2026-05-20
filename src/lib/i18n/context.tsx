"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  // SSR-safe: always init to "en" to avoid hydration mismatch
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANG)

  // Read saved preference after mount (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null
      if (saved === "en" || saved === "es") {
        setLanguageState(saved)
      }
    } catch {
      // localStorage unavailable in some contexts
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
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
