"use client"

import { useState, useEffect } from "react"
import { CreditCard, AlertTriangle, CheckCircle2, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button }    from "@/components/ui/button"
import { Badge }     from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { PLANS, calculateProration, type Subscription } from "@/types/subscription"

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })

export default function SettingsPage() {
  const [sub,          setSub]          = useState<Subscription | null>(null)
  const [isLoading,    setIsLoading]    = useState(true)
  const [cancelOpen,   setCancelOpen]   = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelResult, setCancelResult] = useState<{
    message:   string
    proration: ReturnType<typeof calculateProration>
    accessUntil: string
  } | null>(null)
  const [cancelError,  setCancelError]  = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("subscriptions")
      .select("*")
      .in("status", ["active", "cancelled"])
      .maybeSingle()
      .then(({ data }) => {
        setSub(data)
        setIsLoading(false)
      })
  }, [])

  const plan      = PLANS.find((p) => p.id === sub?.plan)
  const planPrice = plan?.price ?? 0

  const handleCancel = async () => {
    setIsCancelling(true)
    setCancelError(null)

    const res  = await fetch("/api/paypal/cancel-subscription", { method: "POST" })
    const data = await res.json() as {
      message?: string
      proration?: ReturnType<typeof calculateProration>
      accessUntil?: string
      error?: string
    }

    if (res.ok && data.message && data.proration && data.accessUntil) {
      setCancelResult({
        message:     data.message,
        proration:   data.proration,
        accessUntil: data.accessUntil,
      })
      setSub((s) => s ? { ...s, status: "cancelled", cancel_at_period_end: true } : null)
    } else {
      setCancelError(data.error ?? "Cancellation failed. Please try again.")
    }

    setIsCancelling(false)
    setCancelOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const proration = sub
    ? calculateProration(
        planPrice,
        sub.current_period_start,
        sub.current_period_end
      )
    : null

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Manage your account and subscription plan.
        </p>
      </div>

      {cancelResult && (
        <div
          className="flex items-start gap-3 rounded-lg bg-primary/10 border border-primary/20 p-4"
          role="alert"
        >
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{cancelResult.message}</p>
            <p className="text-xs text-muted-foreground">
              Days used: <strong>{cancelResult.proration.daysUsed}</strong> of{" "}
              {cancelResult.proration.totalDays} · Amount charged:{" "}
              <strong>${cancelResult.proration.amountCharged}</strong> · Estimated
              credit: <strong>${cancelResult.proration.estimatedCredit}</strong>
            </p>
          </div>
        </div>
      )}

      {cancelError && (
        <div
          className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3"
          role="alert"
        >
          <p className="text-sm text-destructive">{cancelError}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Subscription Plan
          </CardTitle>
          <CardDescription>
            Manage your current plan and billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">

          {sub && plan ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">SnapLinks {plan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${plan.price}.00 / month
                  </p>
                </div>
                <Badge
                  variant={sub.status === "active" ? "default" : "secondary"}
                >
                  {sub.cancel_at_period_end ? "Cancels at period end" : sub.status}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Period Started
                  </p>
                  <p className="font-medium">{formatDate(sub.current_period_start)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {sub.cancel_at_period_end ? "Access Until" : "Next Billing Date"}
                  </p>
                  <p className="font-medium">{formatDate(sub.current_period_end)}</p>
                </div>
              </div>

              {sub.status === "active" && !sub.cancel_at_period_end && (
                <>
                  <Separator />

                  <div className="flex items-start gap-3 rounded-md bg-muted/30 p-3">
                    <AlertTriangle
                      className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      If you cancel, you&apos;ll only be charged for the days used.
                      Your access continues until{" "}
                      <strong>{formatDate(sub.current_period_end)}</strong>.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-fit text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                    onClick={() => setCancelOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                </>
              )}

              {sub.cancel_at_period_end && !cancelResult && (
                <p className="text-sm text-muted-foreground">
                  Your subscription is cancelled. You have access until{" "}
                  <strong>{formatDate(sub.current_period_end)}</strong>.
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">SnapLinks Free</p>
                  <p className="text-sm text-muted-foreground">$0.00 / month</p>
                </div>
                <Badge variant="secondary">Free</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                You&apos;re on the Free plan with limited features.
              </p>
              <Button asChild className="w-fit gap-2" size="sm">
                <Link href="/pricing">
                  Upgrade your plan
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                {proration && (
                  <>
                    <p>Based on your usage so far in this billing cycle:</p>

                    <ul className="space-y-1 rounded-md bg-muted/50 px-4 py-3 text-sm">
                      <li>
                        Days used:{" "}
                        <strong className="text-foreground">
                          {proration.daysUsed}
                        </strong>{" "}
                        of {proration.totalDays}
                      </li>
                      <li>
                        Amount to be charged:{" "}
                        <strong className="text-foreground">
                          ${proration.amountCharged}
                        </strong>
                      </li>
                      <li>
                        Estimated credit:{" "}
                        <strong className="text-foreground">
                          ${proration.estimatedCredit}
                        </strong>
                      </li>
                    </ul>

                    <p>
                      You&apos;ll keep access until{" "}
                      <strong className="text-foreground">
                        {formatDate(sub!.current_period_end)}
                      </strong>
                      . This action cannot be undone.
                    </p>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep my plan
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); void handleCancel() }}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {isCancelling ? "Cancelling..." : "Yes, cancel subscription"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
