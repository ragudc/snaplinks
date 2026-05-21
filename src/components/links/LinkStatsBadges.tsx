import { MousePointerClick, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LinkStatsBadgesProps {
  totalClicks: number
  clicks7d:    number
  clicks24h:   number
  className?:  string
}

export function LinkStatsBadges({
  totalClicks,
  clicks7d,
  clicks24h,
  className,
}: LinkStatsBadgesProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <Badge
        variant="secondary"
        className="gap-1 text-xs font-normal"
        aria-label={`${totalClicks} total clicks`}
      >
        <MousePointerClick className="h-3 w-3" aria-hidden="true" />
        {totalClicks.toLocaleString("en-US")}
        <span className="text-muted-foreground">total</span>
      </Badge>

      {clicks24h > 0 && (
        <Badge
          variant="outline"
          className="gap-1 text-xs font-normal"
          aria-label={`${clicks24h} clicks in last 24 hours`}
        >
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          {clicks24h}
          <span className="text-muted-foreground">24h</span>
        </Badge>
      )}

      {clicks7d > 0 && clicks7d !== clicks24h && (
        <Badge
          variant="outline"
          className="text-xs font-normal"
          aria-label={`${clicks7d} clicks in last 7 days`}
        >
          {clicks7d}
          <span className="ml-1 text-muted-foreground">7d</span>
        </Badge>
      )}
    </div>
  )
}
