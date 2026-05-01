import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tag, Plus, RefreshCw, Download, Search } from "lucide-react";

import { QnovateShell } from "../components/qnovate/QnovateShell";
import { QnovateFilterChips } from "../components/qnovate/QnovateFilterChips";
import { QnovateTable, AvatarCell, QnovatePagination } from "../components/qnovate/QnovateTable";
import { QStatusPill } from "../components/qnovate/QnovateStatusPill";
import { QButton } from "../components/qnovate/QnovateButton";
import { Banner } from "../components/ui/Banner";
import { CreatePricingDrawer } from "../components/pricing/CreatePricingDrawer";

import { apiFetch, apiAction } from "../lib/api";
import { getSession } from "../lib/auth";
import { mapPricing, formatPrice, cycleSuffix } from "../lib/format";
import { sLabel, sTone } from "../lib/status";

const STATUS_OPTS = [
  { label: "All Statuses", value: "all" },
  { label: "Draft",        value: "Pending" },
  { label: "In Approval",  value: "Submitted" },
  { label: "Released",     value: "Completed" },
  { label: "Rejected",     value: "Denied" },
  { label: "Expired",      value: "Expired" },
];

const VIEW_OPTS = [
  { label: "All Conditions",     value: "all" },
  { label: "My Drafts",          value: "drafts" },
  { label: "Awaiting Approval",  value: "awaiting" },
];

export default function PricingList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = getSession();

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setCreateOpen(true);
      searchParams.delete("create");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  const [pricings,    setPricings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [banner,      setBanner]      = useState({ type: "", message: "" });
  const [createOpen,  setCreateOpen]  = useState(false);

  const [view,         setView]         = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orgFilter,    setOrgFilter]    = useState("all");
  const [query,        setQuery]        = useState("");
  const [page,         setPage]         = useState(1);

  const fetchPricings = useCallback(async () => {
    setLoading(true);
    try {
      const userId = session?.user?.ID;
      const data = await apiFetch(
        `/Pricing?$filter=requestedBy_ID eq ${userId}&$expand=requestedBy&$orderby=createdAt%20desc`,
      );
      setPricings((data.value ?? []).map(mapPricing));
    } catch (err) {
      setBanner({ type: "error", message: `Could not load data: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { fetchPricings(); /* eslint-disable-next-line */ }, []);

  const orgs = useMemo(
    () => [
      { label: "All Orgs", value: "all" },
      ...Array.from(new Set(pricings.map((p) => p.salesOrg).filter((o) => o !== "—")))
        .map((o) => ({ label: o, value: o })),
    ],
    [pricings],
  );

  const filtered = useMemo(
    () =>
      pricings.filter(
        (p) =>
          (statusFilter === "all" || p.pricingStatus === statusFilter) &&
          (orgFilter    === "all" || p.salesOrg      === orgFilter)    &&
          (view !== "drafts"   || p.pricingStatus === "Pending")        &&
          (view !== "awaiting" || p.pricingStatus === "Submitted")      &&
          (query === "" ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            String(p.id).toLowerCase().includes(query.toLowerCase())),
      ),
    [pricings, query, statusFilter, orgFilter, view],
  );

  const PAGE_SIZE = 30;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    {
      key: "name",
      label: "Condition Name",
      sortable: true,
      render: (p) => (
        <AvatarCell
          icon={Tag}
          label={p.name}
          sub={p.description}
        />
      ),
    },
    {
      key: "id",
      label: "Condition ID",
      sortable: true,
      render: (p) => (
        <span className="font-mono text-sm text-foreground">
          {String(p.id).slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (p) => <span className="text-sm text-foreground">{p.conditionType}</span>,
    },
    {
      key: "salesOrg",
      label: "Sales Org",
      render: (p) => <span className="text-brand">{p.salesOrg}</span>,
    },
    {
      key: "validity",
      label: "Validity",
      render: (p) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {p.validFrom} – {p.validTo}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (p) => (
        <span className="text-sm">
          <span className="font-semibold text-foreground">{formatPrice(p.price, p.currency)}</span>
          <span className="ml-1 text-xs text-muted-foreground">/{cycleSuffix(p.billingCycle)}</span>
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "right",
      render: (p) => <QStatusPill tone={sTone(p.pricingStatus)}>{sLabel(p.pricingStatus)}</QStatusPill>,
    },
  ];

  return (
    <QnovateShell>
      <div className="space-y-4 p-6">
        <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />

        {/* Filter chip strip */}
        <QnovateFilterChips
          primary={{
            label: "All Conditions",
            icon: Tag,
            options: VIEW_OPTS,
            value: view,
            onChange: setView,
          }}
          filters={[
            { key: "status", label: "Status",     options: STATUS_OPTS, value: statusFilter, onChange: setStatusFilter },
            { key: "org",    label: "Sales Org",  options: orgs,        value: orgFilter,    onChange: setOrgFilter    },
          ]}
        />

        {/* Table card */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          {/* Table title bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-bold text-foreground">
                Conditions ({filtered.length})
              </h2>
              <span className="text-sm text-muted-foreground">
                | Sorted By Last Changed
              </span>
            </div>

            <div className="flex items-center gap-1">
              <SearchInline value={query} onChange={setQuery} />
              <IconBtn onClick={() => setCreateOpen(true)} aria-label="Create"><Plus className="h-5 w-5" /></IconBtn>
              <IconBtn onClick={fetchPricings} aria-label="Refresh"><RefreshCw className="h-5 w-5" /></IconBtn>
              <IconBtn aria-label="Export"><Download className="h-5 w-5" /></IconBtn>
            </div>
          </div>

          <QnovateTable
            columns={columns}
            rows={pageRows}
            rowKey={(r) => r.id}
            onRowClick={(r) => navigate(`/pricing/${r.id}`)}
            emptyMessage={loading ? "Loading…" : "No conditions match the current filter."}
          />

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-5 py-2">
            <span className="text-sm text-muted-foreground">
              Showing {pageRows.length} of {filtered.length}
            </span>
            <QnovatePagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      <CreatePricingDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => { setCreateOpen(false); fetchPricings(); }}
        onSaveAndOpen={(id) => { setCreateOpen(false); navigate(`/pricing/${id}`); }}
        onError={(message) => setBanner({ type: "error", message })}
      />
    </QnovateShell>
  );
}

/* ---------------------------- helpers ---------------------------- */

function IconBtn({ children, ...rest }) {
  return (
    <button
      className="grid h-9 w-9 place-items-center rounded-md text-brand hover:bg-brand-soft"
      {...rest}
    >
      {children}
    </button>
  );
}

function SearchInline({ value, onChange }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 place-items-center rounded-md text-brand hover:bg-brand-soft"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }
  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => !value && setOpen(false)}
      placeholder="Search…"
      className="h-9 w-56 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-ring"
    />
  );
}

// Use exported QButton via secondary navigation if needed
export { QButton };
