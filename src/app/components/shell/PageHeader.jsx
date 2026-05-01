/**
 * Page-level header with title, subtitle and actions.
 */
export function PageHeader({ title, subtitle, actions, backLink, meta }) {
  return (
    <div className="border-b border-border bg-card px-6 pb-4 pt-3">
      {backLink}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {typeof title === "string" ? (
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          ) : (
            title
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {meta && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {meta}
            </div>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
