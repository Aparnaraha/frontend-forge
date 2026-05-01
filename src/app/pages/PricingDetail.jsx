import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Shell } from "../components/shell/Shell";
import { Breadcrumbs } from "../components/shell/Breadcrumbs";
import { Banner } from "../components/ui/Banner";
import { Button } from "../components/ui/Button";
import { FooterBar } from "../components/ui/FooterBar";
import { FullPageMessage } from "../components/ui/EmptyState";
import { Section } from "../components/ui/Card";
import { FormRow, ReadOnly } from "../components/ui/FormRow";
import { PricingDetailHeader } from "../components/pricing/PricingDetailHeader";
import { PricingActionButtons } from "../components/pricing/PricingActionButtons";
import { PricingForm } from "../components/pricing/PricingForm";

import { apiFetch, apiAction } from "../lib/api";
import { getSession } from "../lib/auth";
import { BILLING_CYCLE_MAP } from "../lib/format";
import { sLabel } from "../lib/status";

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

  useEffect(() => {
    if (!session) { navigate("/login"); return; }
    fetchRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
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

  const handleDelete = async () => {
    if (!window.confirm("Delete this pricing record? This cannot be undone.")) return;
    setActionBusy(true);
    try {
      await apiFetch(`/Pricing(${id})`, { method: "DELETE" });
      navigate("/");
    } catch (err) {
      setBanner({ type: "error", message: err.message });
      setActionBusy(false);
    }
  };

  if (loading || !record || !form) {
    return (
      <Shell>
        <FullPageMessage>Loading…</FullPageMessage>
      </Shell>
    );
  }

  const pricingStatus  = record.PricingStatus  ?? "Pending";
  const approvalStatus = record.ApprovalStatus ?? "Not_Started";

  const isEditable = pricingStatus === "Pending" &&
    ["Not_Started", "Withdrawn", "In_Revision"].includes(approvalStatus);

  const caps = {
    canSubmit:   pricingStatus === "Pending"     && ["Admin", "Requestor"].includes(role),
    canApprove:  approvalStatus === "In_Approval" && ["Admin", "Approver"].includes(role),
    canWithdraw: pricingStatus === "Submitted"   && ["Admin", "Requestor"].includes(role),
    canRevision: ["In_Approval", "Submitted"].includes(approvalStatus) && ["Admin", "Approver"].includes(role),
    canReject:   ["In_Approval", "Submitted"].includes(approvalStatus) && ["Admin", "Approver"].includes(role),
    canExpire:   role === "Admin" && !["Completed", "Expired"].includes(pricingStatus),
    canDelete:   isEditable && ["Admin", "Requestor"].includes(role),
  };

  const updatedBy = record.requestedBy
    ? `${record.requestedBy.firstName ?? ""} ${record.requestedBy.lastName ?? ""}`.trim() || "—"
    : "—";
  const updatedAt = record.modifiedAt?.slice(0, 10) ?? record.createdAt?.slice(0, 10) ?? "—";
  const shortId = String(id).slice(0, 8).toUpperCase();

  return (
    <Shell>
      <Breadcrumbs items={[
        { label: "Pricing Management", to: "/" },
        { label: "Conditions",         to: "/" },
        { label: shortId },
      ]} />

      <PricingDetailHeader
        record={record}
        form={form}
        shortId={shortId}
        updatedBy={updatedBy}
        updatedAt={updatedAt}
        actions={
          <PricingActionButtons
            busy={actionBusy}
            caps={caps}
            onAction={runAction}
            onDelete={handleDelete}
          />
        }
      />

      <div className="space-y-4 p-6 pb-20">
        <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />

        {!isEditable && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
            This record is <strong>{sLabel(pricingStatus)}</strong> and cannot be edited.
            {caps.canWithdraw && " Withdraw it first to make changes."}
          </div>
        )}

        <PricingForm
          id="pricing-form"
          form={form}
          onChange={set}
          editable={isEditable}
          onSubmit={handleSave}
          extraSection={
            <Section title="Requested By">
              <FormRow label="Name"><ReadOnly value={updatedBy} /></FormRow>
              <FormRow label="Username"><ReadOnly value={record.requestedBy?.username ?? "—"} /></FormRow>
              <FormRow label="Email"><ReadOnly value={record.requestedBy?.email ?? "—"} /></FormRow>
              <FormRow label="Role"><ReadOnly value={record.requestedBy?.role ?? "—"} /></FormRow>
            </Section>
          }
        />
      </div>

      <FooterBar>
        <Button onClick={() => navigate("/")}>Cancel</Button>
        {isEditable && (
          <Button form="pricing-form" type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : "💾 Save Changes"}
          </Button>
        )}
      </FooterBar>
    </Shell>
  );
}
