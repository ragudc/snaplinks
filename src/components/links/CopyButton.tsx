"use client"

import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClipboard } from "@/hooks/useClipboard"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  text:      string
  label?:    string
  size?:     "default" | "sm" | "lg" | "icon"
  variant?:  "default" | "outline" | "ghost" | "secondary"
  className?: string
}

export function CopyButton({
  text,
  label,
  size     = "sm",
  variant  = "outline",
  className,
}: CopyButtonProps) {
  const { copy, copied } = useClipboard()
  const { t } = useTranslation()

  const displayLabel = label ?? t.common.copy

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => copy(text)}
        aria-label={copied ? t.common.copied : displayLabel}
        className={cn("gap-2 transition-all", className)}
      >
        {copied
          ? <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
          : <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        }
        {size !== "icon" && (
          <span>{copied ? t.common.copied : displayLabel}</span>
        )}
      </Button>

      {/* Screen reader feedback */}
      <span aria-live="polite" className="sr-only">
        {copied ? t.common.copied : ""}
      </span>
    </>
  )
}
