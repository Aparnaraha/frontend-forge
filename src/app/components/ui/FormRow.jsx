import { cn } from "@/lib/utils";

/**
 * Two-column form row: label on the left, control on the right.
 */
export function FormRow({ label, required, children, className }) {
  return (
    <div className={cn("grid grid-cols-1 gap-1 md:grid-cols-[180px_1fr] md:items-start md:gap-4", className)}>
      <label
        className={cn(
          "pt-2 text-xs font-medium text-muted-foreground",
          required && "after:ml-0.5 after:text-destructive after:content-['*']",
        )}
      >
        {label}
      </label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * Read-only display value used when a field is locked.
 */
export function ReadOnly({ value }) {
  return (
    <span className="block py-1.5 text-sm text-foreground">{value || "—"}</span>
  );
}
