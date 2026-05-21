"use client"

import Link from "next/link"
import { Link2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

export function EmptyLinks() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Link2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold">{t.dashboard.emptyTitle}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t.dashboard.emptySubtitle}
        </p>
      </div>
      <Button asChild className="gap-2">
        <Link href="/">
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          {t.dashboard.createButton}
        </Link>
      </Button>
    </div>
  )
}
