import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const PricingApp = lazy(() => import("../app/PricingApp"));

export const Route = createFileRoute("/$")({
  component: AppHost,
});

function AppHost() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>}>
      <PricingApp />
    </Suspense>
  );
}
