export function EmptyState({ message = "No data" }) {
  return (
    <div className="py-12 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function FullPageMessage({ children }) {
  return (
    <div className="flex h-full flex-1 items-center justify-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
