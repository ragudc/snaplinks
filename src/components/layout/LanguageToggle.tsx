"use client"

import { useTranslation } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage, t } = useTranslation()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t.ui.toggleLanguage}
      className={cn(
        "h-9 px-2.5 text-xs font-semibold tracking-wider",
        "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {language === "en" ? "ES" : "EN"}
    </Button>
  )
}
