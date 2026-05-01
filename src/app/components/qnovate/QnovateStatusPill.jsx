import { cn } from "@/lib/utils";

const TONES = {
  active:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
  draft:    "bg-slate-100 text-slate-700 ring-slate-200",
  pending:  "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  expired:  "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export function QStatusPill({ tone = "active", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset",
        TONES[tone] ?? TONES.active,
        className,
      )}
    >
      {children}
    </span>
  );
}
