import { Link } from "react-router-dom";

export function ShellHeader({ user, onLogout }) {
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
      <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent" aria-label="App launcher">
        ▦
      </button>
      <div className="flex items-center gap-3">
        <span className="rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">SAP</span>
        <span className="h-5 w-px bg-border" />
        <Link to="/" className="text-sm font-semibold text-foreground hover:underline">
          Pricing Management
        </Link>
      </div>

      <div className="mx-auto hidden max-w-md flex-1 md:block">
        <input
          placeholder="Search"
          className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent" aria-label="Notifications">🔔</button>
        <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent" aria-label="Help">?</button>
        <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent" aria-label="Settings">⚙</button>
        <button
          className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          title={user ? `${user.firstName} ${user.lastName} · ${user.role}` : ""}
          onClick={onLogout}
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
