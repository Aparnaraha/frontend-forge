// Pricing status configuration shared across pages.

export const STATUS_CFG = {
  Pending:   { label: "Draft",       tone: "draft"    },
  Submitted: { label: "In Approval", tone: "pending"  },
  Completed: { label: "Released",    tone: "approved" },
  Denied:    { label: "Rejected",    tone: "rejected" },
  Expired:   { label: "Expired",     tone: "expired"  },
};

export const sLabel = (s) => STATUS_CFG[s]?.label ?? s ?? "—";
export const sTone  = (s) => STATUS_CFG[s]?.tone  ?? "draft";

// Tailwind classes for each tone.
export const TONE_CLASSES = {
  draft:    "bg-slate-100 text-slate-700 ring-slate-200",
  pending:  "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  expired:  "bg-zinc-100 text-zinc-600 ring-zinc-200",
};
