import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Star, ChevronsRight,
  Plus, Tag, Search,
} from "lucide-react";

import { QnovateShell, PRICING_DETAIL_TAB } from "../components/qnovate/QnovateShell";
import { QButton } from "../components/qnovate/QnovateButton";
import { QStatusPill } from "../components/qnovate/QnovateStatusPill";
import { Banner } from "../components/ui/Banner";
import { Input, Select, Textarea } from "../components/ui/Form";

import { apiFetch, apiAction } from "../lib/api";
import { getSession } from "../lib/auth";
import { BILLING_CYCLE_MAP, formatPrice } from "../lib/format";
import { sLabel, sTone } from "../lib/status";

const TABS = [
  "Activity History",
  "Additional Identifiers",
  "Changes",
  "Additional Information",
  "Content Assistant",
];

export default function PricingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const session = getSession();
  const role   = session?.user?.role ?? "";
  const userId = session?.user?.ID;

  const [record,     setRecord]     = useState(null);
  const [form,       setForm]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [banner,     setBanner]     = useState({ type: "", message: "" });
  const [tab,        setTab]        = useState("Changes");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const fetchRecord = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/Pricing(${id})?$expand=requestedBy`);
      setRecord(data);
      setForm({
        name:          data.name          ?? "",
        description:   data.description   ?? "",
        conditionType: data.conditionType ?? "",
        salesOrg:      data.salesOrg      ?? "",
        price:         String(data.price  ?? ""),
        currency:      data.currency      ?? "USD",
        billingCycle:  data.billingCycle  ?? "monthly",
        validFrom:     data.validFrom?.slice(0, 10) ?? "",
        validTo:       data.validTo?.slice(0, 10)   ?? "",
      });
    } catch (err) {
      setBanner({ type: "error", message: `Failed to load record: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchRecord(); /* eslint-disable-next-line */ }, []);

  const handleSave = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    setBanner({ type: "", message: "" });
    try {
      await apiFetch(`/Pricing(${id})`, {
        method: "PATCH",
        body: JSON.stringify({
          name:          form.name,
          description:   form.description   || undefined,
          conditionType: form.conditionType || undefined,
          salesOrg:      form.salesOrg      || undefined,
          price:         Number(form.price) || 0,
          currency:      form.currency,
          billingCycle:  BILLING_CYCLE_MAP[form.billingCycle] ?? "monthly",
          validFrom:     form.validFrom     || undefined,
          validTo:       form.validTo       || undefined,
        }),
      });
      setBanner({ type: "success", message: "Changes saved successfully." });
      await fetchRecord();
    } catch (err) {
      setBanner({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (actionName, extra = {}) => {
    setActionBusy(true);
    setBanner({ type: "", message: "" });
    try {
      const res = await apiAction(actionName, { pricingId: id, userid: userId, ...extra });
      setBanner({ type: "success", message: res.value ?? "Action completed." });
      await fetchRecord();
    } catch (err) {
      setBanner({ type: "error", message: err.message });
    } finally {
      setActionBusy(false);
    }
  };

  if (loading || !record || !form) {
    return (
      <QnovateShell>
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      </QnovateShell>
    );
  }

  const pricingStatus  = record.PricingStatus  ?? "Pending";
  const approvalStatus = record.ApprovalStatus ?? "Not_Started";
  const isEditable = pricingStatus === "Pending" &&
    ["Not_Started", "Withdrawn", "In_Revision"].includes(approvalStatus);

  const updatedBy = record.requestedBy
    ? `${record.requestedBy.firstName ?? ""} ${record.requestedBy.lastName ?? ""}`.trim() || "—"
    : "—";
  const updatedAt = record.modifiedAt?.slice(0, 10) ?? record.createdAt?.slice(0, 10) ?? "—";
  const shortId = String(id).slice(0, 8).toUpperCase();

  return (
    <QnovateShell extraTabs={[PRICING_DETAIL_TAB(id, record.name)]}>
      <div className="flex min-h-0 flex-1">
        {/* LEFT — summary panel */}
        <aside className="w-[340px] shrink-0 border-r border-border bg-brand text-brand-foreground">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <div className="flex items-center gap-1 opacity-90">
              <IconBtn light><Star className="h-4 w-4" /></IconBtn>
              <IconBtn light onClick={fetchRecord}><RefreshCw className="h-4 w-4" /></IconBtn>
              <IconBtn light><ChevronsRight className="h-4 w-4" /></IconBtn>
            </div>
          </div>

          <div className="px-5 pb-6">
            <h1 className="text-2xl font-bold leading-tight">{record.name}</h1>
            <p className="mt-1 font-mono text-sm text-brand-foreground/80">{shortId}</p>
            <p className="mt-3 text-sm text-brand-foreground/80 underline-offset-2 hover:underline">
              {record.conditionType ?? "—"}
            </p>
            <p className="mt-3 break-all text-xs text-brand-foreground/60">{id}</p>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-2 border-b border-brand-foreground/20 px-5">
            <SubTab active>Overview</SubTab>
            <SubTab>Timeline</SubTab>
          </div>

          <div className="space-y-6 px-5 py-5">
            <Group title="General">
              <Pair label="Type">
                <span>{record.conditionType ?? "—"}</span>
              </Pair>
              <Pair label="Status">
                <QStatusPill tone={sTone(pricingStatus)}>{sLabel(pricingStatus)}</QStatusPill>
              </Pair>
              <Pair label="Sales Org">
                <span>{record.salesOrg ?? "—"}</span>
              </Pair>
              <Pair label="Approval">
                <span>{approvalStatus.replace(/_/g, " ")}</span>
              </Pair>
              <Pair label="Amount">
                <span className="font-semibold">{formatPrice(record.price ?? 0, record.currency)}</span>
              </Pair>
              <Pair label="Validity">
                <span>{form.validFrom} – {form.validTo}</span>
              </Pair>
              <Pair label="Last Changed">
                <span>{updatedAt}</span>
              </Pair>
              <Pair label="By">
                <span>{updatedBy}</span>
              </Pair>
            </Group>
          </div>
        </aside>

        {/* RIGHT — workspace */}
        <section className="flex min-w-0 flex-1 flex-col bg-card">
          {/* Tabs row */}
          <div className="flex items-center gap-1 border-b border-border px-3">
            <button
              onClick={() => navigate("/pricing")}
              className="grid h-12 w-10 place-items-center text-brand hover:bg-brand-soft"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex flex-1 items-center gap-1 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative whitespace-nowrap px-4 py-3.5 text-sm font-semibold transition ${
                    t === tab ? "text-brand" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                  {t === tab && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-brand" />}
                </button>
              ))}
            </div>

            <button className="grid h-12 w-10 place-items-center text-brand hover:bg-brand-soft" aria-label="More tabs">
              <ChevronRight className="h-5 w-5" />
            </button>

            <QButton variant="primary" size="sm" className="ml-2 gap-1" onClick={handleSave} disabled={!isEditable || saving}>
              <Plus className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
            </QButton>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />

            {/* Action toolbar */}
            <ActionToolbar
              busy={actionBusy}
              role={role}
              pricingStatus={pricingStatus}
              approvalStatus={approvalStatus}
              onAction={runAction}
            />

            {tab === "Changes" && <ChangesTab updatedAt={updatedAt} />}
            {tab === "Activity History" && <PlaceholderPanel title="Activity History" />}
            {tab === "Additional Identifiers" && <PlaceholderPanel title="Additional Identifiers" />}
            {tab === "Additional Information" && (
              <EditPanel
                form={form}
                set={set}
                editable={isEditable}
                onSave={handleSave}
                saving={saving}
              />
            )}
            {tab === "Content Assistant" && <PlaceholderPanel title="Content Assistant" />}
          </div>
        </section>
      </div>
    </QnovateShell>
  );
}

/* ---------------------------- pieces ---------------------------- */

function IconBtn({ children, light, ...rest }) {
  return (
    <button
      {...rest}
      className={`grid h-8 w-8 place-items-center rounded-md ${
        light ? "text-brand-foreground hover:bg-white/10" : "text-brand hover:bg-brand-soft"
      }`}
    >
      {children}
    </button>
  );
}

function SubTab({ active, children }) {
  return (
    <button className={`relative px-1 py-3 text-sm ${active ? "font-semibold" : "text-brand-foreground/70"}`}>
      {children}
      {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-foreground" />}
    </button>
  );
}

function Group({ title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-brand-foreground/20 pb-1">
        <h3 className="text-sm font-bold">{title}</h3>
        <span className="text-brand-foreground/70">⌃</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">{children}</div>
    </div>
  );
}

function Pair({ label, children }) {
  return (
    <div>
      <div className="text-xs text-brand-foreground/70">{label}</div>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

function ChangesTab({ updatedAt }) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <FilterPill label="Recent Data" active />
        <FilterPill label="Older Data" />
        <FilterPill label="Changed On" badge="1" />
        <FilterPill label="Changed By" />
        <FilterPill label="Attribute" />
      </div>
      <div className="flex items-center gap-2 border-b border-border px-5 py-2">
        <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand">
          CHANGED ON: TODAY ✕
        </span>
        <button className="text-xs font-semibold text-brand hover:underline">CLEAR ALL</button>
      </div>
      <div className="flex items-center justify-between px-5 py-3">
        <h3 className="text-base font-bold">Changes (0)</h3>
        <div className="flex gap-1">
          <IconBtn><RefreshCw className="h-4 w-4" /></IconBtn>
          <IconBtn><ChevronsRight className="h-4 w-4" /></IconBtn>
        </div>
      </div>
      <table className="w-full border-t border-border text-sm">
        <thead>
          <tr>
            {["Changed By", "Changed On", "Attribute", "Changed From", "Changed To"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase text-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="px-5 py-20 text-center text-sm text-muted-foreground">
              <Search className="mx-auto mb-2 h-6 w-6 opacity-50" />
              No Data
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-border px-5 py-2 text-sm text-muted-foreground">
        <span>Showing 1 - 0 (last update {updatedAt})</span>
      </div>
    </div>
  );
}

function FilterPill({ label, active, badge }) {
  return (
    <button
      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition ${
        active ? "border border-brand-ring bg-brand-soft text-brand" : "text-brand hover:bg-brand-soft"
      }`}
    >
      {label}
      {badge && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] text-brand-foreground">{badge}</span>}
    </button>
  );
}

function PlaceholderPanel({ title }) {
  return (
    <div className="rounded-lg border border-border bg-card p-12 text-center text-sm text-muted-foreground">
      <Search className="mx-auto mb-2 h-6 w-6 opacity-50" />
      No {title} yet.
    </div>
  );
}

function EditPanel({ form, set, editable, onSave, saving }) {
  return (
    <form onSubmit={onSave} className="space-y-5 rounded-lg border border-border bg-card p-6">
      <FormGrid>
        <Field label="Name"><Input disabled={!editable} value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Sales Org"><Input disabled={!editable} value={form.salesOrg} onChange={(e) => set("salesOrg", e.target.value)} /></Field>
        <Field label="Type"><Input disabled={!editable} value={form.conditionType} onChange={(e) => set("conditionType", e.target.value)} /></Field>
        <Field label="Currency">
          <Select disabled={!editable} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
            {["USD", "EUR", "GBP", "INR", "JPY"].map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="Amount"><Input type="number" disabled={!editable} value={form.price} onChange={(e) => set("price", e.target.value)} /></Field>
        <Field label="Billing Cycle">
          <Select disabled={!editable} value={form.billingCycle} onChange={(e) => set("billingCycle", e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </Select>
        </Field>
        <Field label="Valid From"><Input type="date" disabled={!editable} value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)} /></Field>
        <Field label="Valid To"><Input type="date" disabled={!editable} value={form.validTo} onChange={(e) => set("validTo", e.target.value)} /></Field>
      </FormGrid>
      <Field label="Description">
        <Textarea rows={3} disabled={!editable} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </Field>
      {editable && (
        <div className="flex justify-end">
          <QButton type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</QButton>
        </div>
      )}
    </form>
  );
}

function FormGrid({ children }) { return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>; }
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function ActionToolbar({ busy, role, pricingStatus, approvalStatus, onAction }) {
  const can = {
    submit:   pricingStatus === "Pending"     && ["Admin", "Requestor"].includes(role),
    approve:  approvalStatus === "In_Approval" && ["Admin", "Approver"].includes(role),
    withdraw: pricingStatus === "Submitted"   && ["Admin", "Requestor"].includes(role),
    revision: ["In_Approval", "Submitted"].includes(approvalStatus) && ["Admin", "Approver"].includes(role),
    reject:   ["In_Approval", "Submitted"].includes(approvalStatus) && ["Admin", "Approver"].includes(role),
    expire:   role === "Admin" && !["Completed", "Expired"].includes(pricingStatus),
  };
  const any = Object.values(can).some(Boolean);
  if (!any) return null;

  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card px-4 py-3">
      {can.submit   && <QButton variant="primary" size="sm" disabled={busy} onClick={() => onAction("submitPricing")}>Submit for Approval</QButton>}
      {can.approve  && <QButton variant="primary" size="sm" disabled={busy} onClick={() => onAction("approvePricing")}>Approve</QButton>}
      {can.revision && <QButton             size="sm" disabled={busy} onClick={() => onAction("revision")}>Send for Revision</QButton>}
      {can.reject   && <QButton variant="danger" size="sm" disabled={busy} onClick={() => {
        const reason = window.prompt("Reason for rejection:");
        if (reason !== null) onAction("rejectPricing", { reason });
      }}>Reject</QButton>}
      {can.withdraw && <QButton size="sm" disabled={busy} onClick={() => onAction("withdrawPricing")}>Withdraw</QButton>}
      {can.expire   && <QButton size="sm" disabled={busy} onClick={() => onAction("expirePricing")}>Mark Expired</QButton>}
    </div>
  );
}
