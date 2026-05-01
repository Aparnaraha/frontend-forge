import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PricingList from "./pages/PricingList";
import PricingDetail from "./pages/PricingDetail";
import PricingNew from "./pages/PricingNew";

/**
 * Hosts the React Router app inside the TanStack catch-all route.
 * All app navigation happens through react-router-dom from here on.
 */
export default function PricingApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<PricingList />} />
        <Route path="/pricing"         element={<PricingList />} />
        <Route path="/pricing/new"     element={<PricingNew />} />
        <Route path="/pricing/:id"     element={<PricingDetail />} />
        <Route path="*"                element={<Navigate to="/pricing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
