import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const PricingApp = lazy(() => import("../app/PricingApp"));

export const Route = createFileRoute("/$")({
  component: AppHost,
});

function AppHost() {
  // BrowserRouter uses `document`; only mount client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <PricingApp />
    </Suspense>
  );
}
