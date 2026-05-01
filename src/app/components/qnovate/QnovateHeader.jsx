import { Bell, Heart, LayoutGrid, Headphones, MessageSquare, Search, SlidersHorizontal } from "lucide-react";

/**
 * Top app bar (logo · search · icons · avatar) — matches Qnovate screenshots.
 */
export function QnovateHeader({ user }) {
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "SS"
    : "SS";

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4">
      {/* Hamburger + logo */}
      <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent" aria-label="Menu">
        <span className="space-y-1">
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
        </span>
      </button>
      <div className="flex items-center gap-1">
        <span className="bg-gradient-to-r from-brand to-brand bg-clip-text text-2xl font-bold italic tracking-tight text-transparent">
          Qnovate
        </span>
        <span className="-mt-3 ml-0.5 h-1 w-3 rounded-full bg-amber-400" aria-hidden />
      </div>

      {/* Search */}
      <div className="mx-auto hidden w-full max-w-2xl items-center gap-2 md:flex">
        <div className="flex w-full items-center rounded-md border border-input bg-background pl-3 shadow-sm">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search All"
            className="h-9 flex-1 bg-transparent px-3 text-sm placeholder:italic placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="grid h-9 w-9 place-items-center text-brand hover:bg-accent" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right icons */}
      <div className="ml-auto flex items-center gap-1">
        <HeaderIcon><Bell className="h-5 w-5" /></HeaderIcon>
        <HeaderIcon><Heart className="h-5 w-5" /></HeaderIcon>
        <HeaderIcon><LayoutGrid className="h-5 w-5" /></HeaderIcon>
        <HeaderIcon><MessageSquare className="h-5 w-5" /></HeaderIcon>
        <HeaderIcon><Headphones className="h-5 w-5" /></HeaderIcon>
        <button className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
          {initials}
        </button>
        <button className="grid h-9 w-9 place-items-center text-muted-foreground hover:bg-accent" aria-label="Apps">
          <LayoutGrid className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function HeaderIcon({ children }) {
  return (
    <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent">
      {children}
    </button>
  );
}
