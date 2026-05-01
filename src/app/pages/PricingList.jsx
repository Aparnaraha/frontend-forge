import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Shell } from "../components/shell/Shell";
import { Breadcrumbs } from "../components/shell/Breadcrumbs";
import { PageHeader } from "../components/shell/PageHeader";
import { Banner } from "../components/ui/Banner";
import { Button } from "../components/ui/Button";
import { Card, CardToolbar } from "../components/ui/Card";
import { KpiGrid } from "../components/ui/KpiTile";
import { FullPageMessage } from "../components/ui/EmptyState";
import { PricingFilterBar } from "../components/pricing/PricingFilterBar";
import { PricingTable } from "../components/pricing/PricingTable";

import { apiFetch, apiAction } from "../lib/api";
import { getSession } from "../lib/auth";
import { mapPricing } from "../lib/format";

export default function PricingList() {
  const navigate = useNavigate();
  const session = getSession();
  const role = session?.user?.role ?? "";

  const [pricings,   setPricings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [actionBusy, setActionBusy] = useState(null);
  const [banner,     setBanner]     = useState({ type: "", message: "" });

  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orgFilter,    setOrgFilter]    = useState("all");

  const fetchPricings = useCallback(async () => {
    setLoading(true);
    try {
      const userId = session?.user?.ID;
      if (!userId) {
        navigate("/login");
        return;
      }
      const data = await apiFetch(
        `/Pricing?$filter=requestedBy_ID eq ${userId}&$expand=requestedBy&$orderby=createdAt%20desc`,
      );
      setPricings((data.value ?? []).map(mapPricing));
    } catch (err) {
      setBanner({ type: "error", message: `Could not load data: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, [navigate, session]);

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    fetchPricings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = useCallback(
    async (actionName, pricingId, extra = {}) => {
      if (!session) return;
      setActionBusy(pricingId);
      setBanner({ type: "", message: "" });
      try {
        const res = await apiAction(actionName, {
          pricingId,
          userid: session.user?.ID,
          ...extra,
        });
        setBanner({ type: "success", message: res.value ?? "Action completed successfully." });
        await fetchPricings();
      } catch (err) {
        setBanner({ type: "error", message: err.message });
      } finally {
        setActionBusy(null);
      }
    },
    [session, fetchPricings],
  );

  const orgs = useMemo(
    () => Array.from(new Set(pricings.map((p) => p.salesOrg).filter((o) => o !== "—"))),
    [pricings],
  );

  const filtered = useMemo(
    () =>
      pricings.filter(
        (p) =>
          (statusFilter === "all" || p.pricingStatus === statusFilter) &&
          (orgFilter    === "all" || p.salesOrg      === orgFilter)    &&
          (query        === ""    ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            String(p.id).toLowerCase().includes(query.toLowerCase())),
      ),
    [pricings, query, statusFilter, orgFilter],
  );

  const kpis = [
    { label: "Total conditions", value: pricings.length,                                                tone: "default" },
    { label: "In Approval",      value: pricings.filter((p) => p.pricingStatus === "Submitted").length, tone: "warning" },
    { label: "Released",         value: pricings.filter((p) => p.pricingStatus === "Completed").length, tone: "success" },
    { label: "Drafts",           value: pricings.filter((p) => p.pricingStatus === "Pending").length,   tone: "muted"   },
    { label: "Rejected",         value: pricings.filter((p) => p.pricingStatus === "Denied").length,    tone: "danger"  },
  ];

  const pendingCount = pricings.filter((p) => p.pricingStatus === "Submitted").length;

  if (loading) {
    return (
      <Shell pendingCount={0}>
        <FullPageMessage>Loading pricing conditions…</FullPageMessage>
      </Shell>
    );
  }

  return (
    <Shell pendingCount={pendingCount}>
      <Breadcrumbs items={[{ label: "Pricing Management", to: "/" }, { label: "Conditions" }]} />

      <PageHeader
        title="Manage Pricing Conditions"
        subtitle="Maintain pricing condition records and submit changes for approval."
        actions={
          <>
            <Button size="sm">⬇ Export</Button>
            <Link to="/pricing/new">
              <Button variant="primary" size="sm">+ Create</Button>
            </Link>
          </>
        }
      />

      <div className="space-y-4 p-6">
        <Banner
          type={banner.type}
          message={banner.message}
          onClose={() => setBanner({ type: "", message: "" })}
        />

        <KpiGrid items={kpis} />

        <Card>
          <PricingFilterBar
            query={query}
            onQueryChange={setQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            orgFilter={orgFilter}
            onOrgChange={setOrgFilter}
            orgs={orgs}
            onRefresh={fetchPricings}
            onReset={() => { setQuery(""); setStatusFilter("all"); setOrgFilter("all"); }}
          />

          <CardToolbar>
            <div>
              <strong className="text-foreground">Conditions</strong>{" "}
              <span>({filtered.length})</span>
            </div>
            <div>Standard View ▾</div>
          </CardToolbar>

          <PricingTable
            rows={filtered}
            role={role}
            busyId={actionBusy}
            onAction={handleAction}
          />

          <CardToolbar className="border-t border-b-0">
            <div>Showing {filtered.length} of {pricings.length}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" disabled>Previous</Button>
              <span>Page 1 of 1</span>
              <Button size="sm" disabled>Next</Button>
            </div>
          </CardToolbar>
        </Card>
      </div>
    </Shell>
  );
}
