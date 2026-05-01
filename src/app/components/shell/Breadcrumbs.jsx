import { Link } from "react-router-dom";

/**
 * @param {{ items: { label: string, to?: string }[] }} props
 */
export function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-1.5 px-6 py-3 text-xs text-muted-foreground">
      <Link to="/" className="hover:text-foreground">⌂</Link>
      {items.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <span className="text-muted-foreground/60">›</span>
          {c.to ? (
            <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
          ) : (
            <span className="text-foreground">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
