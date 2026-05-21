"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v3"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input }  from "@/components/ui/input"
import { Label }  from "@/components/ui/label"
import { useTranslation } from "@/lib/i18n"
import type { LinkStats, UpdateLinkInput } from "@/types/link"

const editSchema = z.object({
  url:   z.string().min(1, "URL is required.").url("Please enter a valid URL."),
  title: z.string().optional(),
})

type EditInput = z.infer<typeof editSchema>

interface LinkEditModalProps {
  link:       LinkStats
  open:       boolean
  onOpenChange: (open: boolean) => void
  onSave:     (input: UpdateLinkInput) => Promise<void>
}

export function LinkEditModal({ link, open, onOpenChange, onSave }: LinkEditModalProps) {
  const { t }                   = useTranslation()
  const [saveError, setSaveError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditInput>({
    resolver: zodResolver(editSchema),
    defaultValues: { url: link.url, title: link.title ?? "" },
  })

  // Resetear valores cuando cambia el link o se abre el modal
  useEffect(() => {
    if (open) {
      reset({ url: link.url, title: link.title ?? "" })
      setSaveError(null)
    }
  }, [open, link, reset])

  const onSubmit = async (data: EditInput) => {
    setSaveError(null)
    try {
      await onSave({ url: data.url, title: data.title || undefined })
      onOpenChange(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.common.edit} link</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-url">{t.dashboard.create.urlLabel}</Label>
            <Input
              id="edit-url"
              type="url"
              placeholder={t.dashboard.create.urlPlaceholder}
              aria-invalid={!!errors.url}
              {...register("url")}
            />
            {errors.url && (
              <p role="alert" className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-title">
              {t.dashboard.create.titleLabel}
              <span className="ml-1 text-xs text-muted-foreground">({t.common.optional})</span>
            </Label>
            <Input
              id="edit-title"
              type="text"
              placeholder={t.dashboard.create.titlePlaceholder}
              {...register("title")}
            />
          </div>

          {saveError && (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {saveError}
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : t.common.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
