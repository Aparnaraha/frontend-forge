import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  { key: "overview",   label: "Overview",           icon: "▤" },
  { key: "conditions", label: "Pricing Conditions", icon: "🏷", active: true },
  { key: "approvals",  label: "Approvals",          icon: "✓" },
  { key: "archive",    label: "Archive",            icon: "📦" },
  { key: "reports",    label: "Reports",            icon: "📊" },
  { key: "customers",  label: "Customers",          icon: "👥" },
  { key: "audit",      label: "Audit Log",          icon: "📝" },
  { key: "settings",   label: "Settings",           icon: "⚙" },
];

/**
 * Sidebar nav.
 * @param {{ items?: typeof DEFAULT_ITEMS, pendingCount?: number }} props
 */
export function Sidebar({ items = DEFAULT_ITEMS, pendingCount = 0 }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:block">
      <nav className="flex flex-col py-3">
        {items.map((it) => {
          const badge = it.key === "approvals" ? pendingCount || null : it.badge;
          return (
            <a
              key={it.key}
              href="#"
              className={cn(
                "mx-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition hover:bg-accent",
                it.active && "bg-accent font-semibold text-foreground",
              )}
            >
              <span className="w-5 text-center text-base">{it.icon}</span>
              <span className="flex-1 truncate">{it.label}</span>
              {badge ? (
                <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {badge}
                </span>
              ) : null}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
