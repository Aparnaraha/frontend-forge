/**
 * Sticky footer with action buttons.
 */
export function FooterBar({ children }) {
  return (
    <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-border bg-card px-6 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      {children}
    </div>
  );
}
