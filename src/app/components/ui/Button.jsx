import { cn } from "@/lib/utils";

/**
 * Reusable button.
 * @param {"primary"|"ghost"|"danger"|"success"|"default"} [props.variant]
 * @param {"sm"|"md"} [props.size]
 * @param {boolean} [props.icon]
 */
export function Button({
  variant = "default",
  size = "md",
  icon = false,
  className,
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-md border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const variants = {
    default: "border-border bg-card text-foreground hover:bg-accent",
    primary: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
    ghost:   "border-transparent bg-transparent text-foreground hover:bg-accent",
    danger:  "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
    success: "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
  };

  const sizes = {
    sm: icon ? "h-8 w-8 text-sm" : "h-8 px-3 text-xs",
    md: icon ? "h-9 w-9 text-base" : "h-9 px-4 text-sm",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
