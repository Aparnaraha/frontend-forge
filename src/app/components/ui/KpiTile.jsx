import { cn } from "@/lib/utils";

const TONE_BG = {
  default: "bg-card",
  warning: "bg-amber-50",
  success: "bg-emerald-50",
  muted:   "bg-slate-50",
  danger:  "bg-rose-50",
};

const TONE_VALUE = {
  default: "text-foreground",
  warning: "text-amber-700",
  success: "text-emerald-700",
  muted:   "text-slate-600",
  danger:  "text-rose-700",
};

/**
 * KPI tile.
 * @param {"default"|"warning"|"success"|"muted"|"danger"} [props.tone]
 */
export function KpiTile({ label, value, tone = "default" }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 shadow-sm",
        TONE_BG[tone],
      )}
    >
      <div className={cn("text-2xl font-semibold", TONE_VALUE[tone])}>{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function KpiGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {items.map((k) => (
        <KpiTile key={k.label} {...k} />
      ))}
    </div>
  );
}
