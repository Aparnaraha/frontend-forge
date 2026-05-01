import { cn } from "@/lib/utils";

/**
 * Inline feedback banner.
 * @param {"error"|"success"|""} props.type
 */
export function Banner({ type, message, onClose }) {
  if (!message) return null;
  const isError = type === "error";

  return (
    <div
      className={cn(
        "mb-3 flex items-center justify-between rounded-md border px-4 py-2.5 text-sm",
        isError
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-emerald-300 bg-emerald-50 text-emerald-800",
      )}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 font-bold opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
