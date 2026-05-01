import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Right-side slide-in modal drawer (Create Account style).
 *
 * @param {{
 *  open: boolean;
 *  onClose: () => void;
 *  title: string;
 *  children: any;
 *  footer?: any;
 *  width?: string;  // tailwind width class
 * }} props
 */
export function QnovateDrawer({ open, onClose, title, children, footer, width = "w-[480px]" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[1px] transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex max-w-full flex-col bg-card shadow-2xl transition-transform duration-300 ${width} ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-card px-5 py-3">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}

/**
 * Collapsible section inside a drawer ("General", "Address" …).
 */
export function DrawerSection({ title, children, defaultOpen = true }) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-3 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between py-1">
        <span className="text-base font-semibold text-foreground">{title}</span>
        <span className="text-brand transition group-open:rotate-180">⌃</span>
      </summary>
      <div className="space-y-4 pt-4">{children}</div>
    </details>
  );
}

/**
 * Stacked label + input wrapper used inside drawers.
 */
export function DrawerField({ label, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
