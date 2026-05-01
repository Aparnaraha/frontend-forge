import { Link, useLocation } from "react-router-dom";
import { Home, Tag, X } from "lucide-react";

/**
 * Workspace-style tab strip.
 * @param {{ tabs: { key: string; label: string; sub?: string; to: string; icon?: any; closable?: boolean }[] }} props
 */
export function QnovateTabs({ tabs }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-14 items-stretch border-b border-border bg-card pl-2">
      {tabs.map((tab) => {
        const Icon = tab.icon ?? Tag;
        const active = pathname === tab.to || (tab.match && tab.match.test(pathname));
        return (
          <Link
            key={tab.key}
            to={tab.to}
            className={`group relative flex min-w-[180px] items-center gap-3 border-r border-border px-4 text-sm transition ${
              active ? "bg-card text-foreground" : "text-muted-foreground hover:bg-accent/40"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-foreground" : "text-muted-foreground"}`} />
            <div className="flex flex-col leading-tight">
              {tab.sub && (
                <span className="text-[11px] text-muted-foreground">{tab.sub}</span>
              )}
              <span className="font-medium">{tab.label}</span>
            </div>
            {tab.closable && (
              <X className="ml-3 h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            )}
            {active && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export const HOME_TAB = { key: "home", label: "Home", to: "/", icon: Home };
