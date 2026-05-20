"use client"

import { useState, useRef, useId } from "react"
import Link from "next/link"
import { ArrowRight, Link2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CopyButton } from "@/components/links/CopyButton"
import { LinkQRCode } from "@/components/links/LinkQRCode"
import { useTranslation } from "@/lib/i18n"
import { validateUrl } from "@/lib/utils/url-validator"
import type { CreateLinkResponse } from "@/types/link"
import { cn } from "@/lib/utils"

type FormState = "idle" | "loading" | "success" | "error"

export function LinkShortener() {
  const { t } = useTranslation()
  const errorId  = useId()
  const resultId = useId()

  const [url,       setUrl]       = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null)
  const [result,    setResult]    = useState<CreateLinkResponse | null>(null)
  const [showQr,    setShowQr]    = useState(false)

  const inputRef  = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const isLoading = formState === "loading"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    // Client-side validation
    const clientError = validateUrl(url)
    if (clientError) {
      setErrorMsg(clientError)
      setFormState("error")
      return
    }

    setFormState("loading")

    try {
      const res = await fetch("/api/links", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: url.trim() }),
      })

      const data: CreateLinkResponse | { error: string } = await res.json()

      if (!res.ok) {
        const msg = "error" in data ? data.error : t.errors.serverError
        setErrorMsg(msg)
        setFormState("error")
        return
      }

      setResult(data as CreateLinkResponse)
      setFormState("success")
      setShowQr(false)

      // Move focus to result for accessibility
      setTimeout(() => resultRef.current?.focus(), 50)
    } catch {
      setErrorMsg(t.errors.networkError)
      setFormState("error")
    }
  }

  function handleReset() {
    setUrl("")
    setResult(null)
    setErrorMsg(null)
    setShowQr(false)
    setFormState("idle")
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* ── Input form ─────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate aria-label={t.landing.hero.badge}>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <div className="flex-1 flex flex-col gap-1.5">
            <Input
              ref={inputRef}
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (formState === "error") {
                  setErrorMsg(null)
                  setFormState("idle")
                }
              }}
              placeholder={t.landing.hero.placeholder}
              aria-label={t.landing.hero.placeholder}
              aria-describedby={errorMsg ? errorId : undefined}
              aria-invalid={formState === "error"}
              disabled={isLoading}
              className={cn(
                "h-11 text-sm",
                formState === "error" && "border-destructive focus-visible:ring-destructive"
              )}
              autoComplete="url"
              spellCheck={false}
            />
            {errorMsg && (
              <p
                id={errorId}
                role="alert"
                className="text-xs text-destructive"
              >
                {errorMsg}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="h-11 sm:shrink-0 gap-2"
          >
            {isLoading ? (
              <>
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                {t.landing.hero.buttonLoading}
              </>
            ) : (
              <>
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t.landing.hero.button}
              </>
            )}
          </Button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground text-center sm:text-left">
          {t.landing.hero.hint}
        </p>
      </form>

      {/* ── Result card ────────────────────────────────────────── */}
      {formState === "success" && result && (
        <Card
          ref={resultRef}
          id={resultId}
          tabIndex={-1}
          className="outline-none border-border/60 shadow-sm"
          aria-label={t.landing.result.title}
          aria-live="polite"
        >
          <CardContent className="pt-6 flex flex-col gap-5">
            {/* Title */}
            <p className="text-sm font-semibold text-foreground">
              {t.landing.result.title}
            </p>

            {/* Short link row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">
                  {t.landing.result.shortLink}
                </p>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline break-all"
                >
                  {result.shortUrl}
                </a>
              </div>

              <CopyButton
                text={result.shortUrl}
                label={t.landing.result.copyButton}
                variant="default"
                size="sm"
                className="shrink-0 self-start sm:self-auto"
              />
            </div>

            {/* QR toggle */}
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQr((v) => !v)}
                className="w-fit gap-2 text-muted-foreground hover:text-foreground px-0"
                aria-expanded={showQr}
                aria-controls="qr-section"
              >
                <span
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    showQr ? "rotate-90" : "rotate-0"
                  )}
                  aria-hidden="true"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                {showQr ? t.landing.result.hideQr : t.landing.result.showQr}
              </Button>

              {showQr && (
                <div id="qr-section">
                  <LinkQRCode url={result.shortUrl} size={160} />
                </div>
              )}
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-2 text-muted-foreground hover:text-foreground w-fit px-0"
                aria-label={t.landing.result.createAnother}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {t.landing.result.createAnother}
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link href="/login?tab=signup">
                  {t.landing.result.signUpCta}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
