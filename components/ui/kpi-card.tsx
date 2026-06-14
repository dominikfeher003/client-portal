"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { motion } from "framer-motion"

interface Props {
  label: string
  value: string
  icon: React.ElementType
  iconColor?: string
  iconBg?: string
  delta?: { value: string; positive: boolean | null }
  index?: number
}

export function KPICard({ label, value, icon: Icon, iconColor = "text-indigo-600", iconBg = "bg-indigo-50 dark:bg-indigo-950/50", delta, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      whileHover={{ y: -1 }}
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold text-foreground tracking-tight">{value}</span>
        {delta && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            delta.positive === true && "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
            delta.positive === false && "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
            delta.positive === null && "bg-muted text-muted-foreground",
          )}>
            {delta.positive === true && <TrendingUp className="h-3 w-3" />}
            {delta.positive === false && <TrendingDown className="h-3 w-3" />}
            {delta.positive === null && <Minus className="h-3 w-3" />}
            {delta.value}
          </div>
        )}
      </div>
    </motion.div>
  )
}
