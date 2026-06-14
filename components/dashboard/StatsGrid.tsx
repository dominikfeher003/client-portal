"use client"

import { Campaign, AccountInfo } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, DollarSign, Activity, Wallet } from "lucide-react"
import { KPICard } from "@/components/ui/kpi-card"

interface Props {
  campaigns: Campaign[]
  accountInfo: AccountInfo
}

export function StatsGrid({ campaigns, accountInfo }: Props) {
  const active = campaigns.filter((c) => c.status === "ACTIVE").length
  const totalSpend = campaigns.reduce((s, c) => s + c.insights.last7d.spend, 0)
  const avgRoas = campaigns.length > 0
    ? campaigns.reduce((s, c) => s + c.insights.last7d.purchase_roas, 0) / campaigns.length
    : 0

  const balance = accountInfo.balance > 0
    ? formatCurrency(accountInfo.balance, accountInfo.currency)
    : accountInfo.spend_cap > 0
      ? formatCurrency(accountInfo.spend_cap - accountInfo.amount_spent, accountInfo.currency)
      : "—"

  const roasPositive = avgRoas >= 3 ? true : avgRoas >= 1.5 ? null : false
  const roasColor = avgRoas >= 3 ? "text-emerald-600" : avgRoas >= 1.5 ? "text-amber-600" : "text-red-600"
  const roasBg = avgRoas >= 3 ? "bg-emerald-50 dark:bg-emerald-950/50" : avgRoas >= 1.5 ? "bg-amber-50 dark:bg-amber-950/50" : "bg-red-50 dark:bg-red-950/50"

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        index={0}
        label="Total Spend (7d)"
        value={`$${totalSpend.toFixed(0)}`}
        icon={DollarSign}
        iconColor="text-blue-600"
        iconBg="bg-blue-50 dark:bg-blue-950/50"
        delta={{ value: "7d", positive: null }}
      />
      <KPICard
        index={1}
        label="Avg ROAS (7d)"
        value={`${avgRoas.toFixed(2)}x`}
        icon={TrendingUp}
        iconColor={roasColor}
        iconBg={roasBg}
        delta={{ value: avgRoas >= 3 ? "Good" : avgRoas >= 1.5 ? "Fair" : "Low", positive: roasPositive }}
      />
      <KPICard
        index={2}
        label="Active Campaigns"
        value={String(active)}
        icon={Activity}
        iconColor="text-indigo-600"
        iconBg="bg-indigo-50 dark:bg-indigo-950/50"
        delta={{ value: `of ${campaigns.length} total`, positive: null }}
      />
      <KPICard
        index={3}
        label="Account Balance"
        value={balance}
        icon={Wallet}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50 dark:bg-emerald-950/50"
      />
    </div>
  )
}
