import { getUserClient } from "@/lib/get-user-client"
import { redirect } from "next/navigation"
import { readRules } from "@/lib/storage"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Zap } from "lucide-react"

const METRIC_LABELS: Record<string, string> = {
  purchase_roas: "ROAS", spend: "Spend", impressions: "Impressions", clicks: "Clicks",
  ctr: "CTR", reach: "Reach", frequency: "Frequency", video_views: "Video Views",
  engagement_rate: "Engagement Rate",
}
const OP_LABELS: Record<string, string> = {
  less_than: "drops below", greater_than: "exceeds", equals: "equals",
}
const ACTION_LABELS: Record<string, string> = {
  pause: "Pause campaign", resume: "Resume campaign",
  scale_budget: "Scale budget", notify_only: "Send notification",
}
const ACTION_VARIANTS: Record<string, "danger" | "success" | "info" | "neutral"> = {
  pause: "danger", resume: "success", scale_budget: "info", notify_only: "neutral",
}

export default async function RulesPage() {
  const client = await getUserClient()
  if (!client) redirect("/dashboard")

  const allRules = await readRules()
  const rules = allRules.filter((r) => r.clientId === client.id)
  const enabled = rules.filter((r) => r.enabled)
  const disabled = rules.filter((r) => !r.enabled)

  if (rules.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-foreground">Automation Rules</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Rules that automatically manage your campaigns</p>
        </div>
        <EmptyState icon={Zap} title="No rules configured" description="Your account manager will set up automation rules to manage your campaigns automatically." />
      </div>
    )
  }

  function RuleCard({ rule }: { rule: typeof rules[0] }) {
    const metric = METRIC_LABELS[rule.metric] ?? rule.metric
    const op = OP_LABELS[rule.operator] ?? rule.operator
    const action = ACTION_LABELS[rule.action] ?? rule.action
    const actionVariant = ACTION_VARIANTS[rule.action] ?? "neutral"
    return (
      <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${rule.enabled ? "bg-emerald-500" : "bg-zinc-400"}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <p className="text-sm font-semibold text-foreground">{rule.name}</p>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge variant={actionVariant}>{action}</StatusBadge>
              <StatusBadge variant={rule.enabled ? "success" : "neutral"} dot>
                {rule.enabled ? "Active" : "Disabled"}
              </StatusBadge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            If <span className="text-foreground font-medium">{metric}</span>{" "}
            {op}{" "}
            <span className="text-foreground font-medium">{rule.threshold}</span>{" "}
            over <span className="text-foreground font-medium">{rule.windowDays} days</span>
            {rule.appliesTo === "specific" && rule.campaignIds.length > 0
              ? ` on ${rule.campaignIds.length} campaign${rule.campaignIds.length > 1 ? "s" : ""}`
              : " on all campaigns"
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">Automation Rules</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{rules.length} rule{rules.length !== 1 ? "s" : ""} configured for your account</p>
      </div>

      {enabled.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active ({enabled.length})</p>
          {enabled.map((r) => <RuleCard key={r.id} rule={r} />)}
        </div>
      )}

      {disabled.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disabled ({disabled.length})</p>
          {disabled.map((r) => <RuleCard key={r.id} rule={r} />)}
        </div>
      )}
    </div>
  )
}
