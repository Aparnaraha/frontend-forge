import { cn } from "@/lib/utils";

/**
 * Qnovate-flavoured button.
 * @param {"primary"|"secondary"|"ghost"|"danger"|"link"} [props.variant]
 * @param {"sm"|"md"} [props.size]
 */
export function QButton({ variant = "secondary", size = "md", className, children, ...rest }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring";

  const variants = {
    primary:   "bg-brand text-brand-foreground hover:opacity-90",
    secondary: "border border-border bg-card text-foreground hover:bg-accent",
    ghost:     "text-brand hover:bg-brand-soft",
    danger:    "bg-destructive text-destructive-foreground hover:opacity-90",
    link:      "text-brand underline-offset-2 hover:underline",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-5 text-sm",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
