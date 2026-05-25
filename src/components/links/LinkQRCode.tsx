"use client"

import { useState, useEffect, useCallback } from "react"
import QRCode from "qrcode"
import { useTheme } from "next-themes"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface LinkQRCodeProps {
  url:        string
  size?:      number
  className?: string
}

export function LinkQRCode({ url, size = 200, className }: LinkQRCodeProps) {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    QRCode.toDataURL(url, {
      width:         size,
      margin:        2,
      color:         {
        dark:  isDark ? "#e5e5e5" : "#000000",
        light: isDark ? "#1c1c1c" : "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((result) => {
        if (!cancelled) {
          setDataUrl(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [url, size, isDark])

  const handleDownload = useCallback(() => {
    if (!dataUrl) return
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = "snaplinks-qr.png"
    a.click()
  }, [dataUrl])

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <p className="text-sm font-medium text-foreground">
        {t.landing.result.qrCodeTitle}
      </p>

      {loading ? (
        <Skeleton
          style={{ width: size, height: size }}
          className="rounded-lg"
        />
      ) : dataUrl ? (
        <div className="rounded-lg border border-border bg-background p-3 shadow-sm">
          <img
            src={dataUrl}
            alt={`QR code for ${url}`}
            width={size}
            height={size}
            className="block"
          />
        </div>
      ) : null}

      {dataUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-2"
          aria-label={t.landing.result.qrDownload}
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          {t.landing.result.qrDownload}
        </Button>
      )}
    </div>
  )
}
