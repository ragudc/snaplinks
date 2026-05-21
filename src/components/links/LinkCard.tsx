"use client"

import { useState } from "react"
import { ExternalLink, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CopyButton } from "@/components/links/CopyButton"
import { LinkStatsBadges } from "@/components/links/LinkStatsBadges"
import { LinkEditModal } from "@/components/links/LinkEditModal"
import { DeleteConfirmDialog } from "@/components/links/DeleteConfirmDialog"
import { useTranslation } from "@/lib/i18n"
import { formatRelativeDate } from "@/lib/utils/date-utils"
import { cn } from "@/lib/utils"
import type { LinkStats, UpdateLinkInput } from "@/types/link"

interface LinkCardProps {
  link:         LinkStats
  onUpdate:     (id: string, input: UpdateLinkInput) => Promise<void>
  onDelete:     (id: string) => Promise<void>
  onToggle:     (id: string, current: boolean) => Promise<void>
}

export function LinkCard({ link, onUpdate, onDelete, onToggle }: LinkCardProps) {
  const { t }                     = useTranslation()
  const [editOpen, setEditOpen]   = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const base     = process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? "http://localhost:3000"
  const shortUrl = `${base}/${link.slug}`

  const displayTitle = link.title ?? link.url.replace(/^https?:\/\//, "").split("/")[0]

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await onToggle(link.link_id, link.is_active)
    } catch {
      toast.error("Failed to update link status.")
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(link.link_id)
      toast.success("Link deleted.")
    } catch {
      toast.error("Failed to delete link.")
    }
  }

  const handleSave = async (input: UpdateLinkInput) => {
    await onUpdate(link.link_id, input)
    toast.success("Link updated.")
  }

  return (
    <>
      <Card className={cn("transition-opacity", !link.is_active && "opacity-60")}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">

            {/* Toggle activo */}
            <div className="pt-0.5">
              <Switch
                checked={link.is_active}
                onCheckedChange={handleToggle}
                disabled={isToggling}
                aria-label={t.dashboard.link.toggleActive}
              />
            </div>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">

              {/* Título + badge inactivo */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium leading-tight truncate">
                  {displayTitle}
                </p>
                {!link.is_active && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {t.common.inactive}
                  </Badge>
                )}
              </div>

              {/* URL de destino */}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit max-w-full"
              >
                <span className="truncate">{link.url}</span>
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>

              {/* Short URL + copy */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-primary truncate">
                  {shortUrl}
                </span>
                <CopyButton text={shortUrl} aria-label={t.dashboard.link.copyLink} />
              </div>

              {/* Stats + fecha */}
              <div className="flex items-center justify-between flex-wrap gap-2 mt-0.5">
                <LinkStatsBadges
                  totalClicks={link.total_clicks}
                  clicks7d={link.clicks_7d}
                  clicks24h={link.clicks_24h}
                />
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatRelativeDate(link.created_at)}
                </span>
              </div>
            </div>

            {/* Menú de acciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  aria-label="Link actions"
                >
                  <MoreVertical className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t.common.edit}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteConfirmDialog
                  onConfirm={handleDelete}
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                      {t.common.delete}
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </CardContent>
      </Card>

      <LinkEditModal
        link={link}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
      />
    </>
  )
}
