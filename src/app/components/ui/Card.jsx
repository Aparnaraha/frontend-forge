import { cn } from "@/lib/utils";

/**
 * Card wrapper with an optional header.
 */
export function Card({ children, className }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn("border-b border-border px-5 py-3 text-sm font-semibold text-foreground", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardToolbar({ children, className }) {
  return (
    <div className={cn("flex items-center justify-between border-b border-border px-5 py-2.5 text-xs text-muted-foreground", className)}>
      {children}
    </div>
  );
}

/**
 * Section card used inside forms.
 */
export function Section({ title, children }) {
  return (
    <Card className="mb-4">
      <CardHeader>{title}</CardHeader>
      <CardBody className="space-y-4">{children}</CardBody>
    </Card>
  );
}
