import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Shell } from "../components/shell/Shell";
import { Breadcrumbs } from "../components/shell/Breadcrumbs";
import { PageHeader } from "../components/shell/PageHeader";
import { Banner } from "../components/ui/Banner";
import { Button } from "../components/ui/Button";
import { FooterBar } from "../components/ui/FooterBar";
import { Section } from "../components/ui/Card";
import { FormRow } from "../components/ui/FormRow";
import { Input, Select } from "../components/ui/Form";
import { PricingForm } from "../components/pricing/PricingForm";

import { apiFetch } from "../lib/api";
import { getSession } from "../lib/auth";
import { BILLING_CYCLE_MAP } from "../lib/format";

const EMPTY_FORM = {
  conditionType: "",
  name: "",
  description: "",
  salesOrg: "",
  price: "",
  currency: "USD",
  quantity: "",
  unit: "LB",
  billingCycle: "monthly",
  validFrom: "",
  validTo: "",
  // Org data
  SoldTo: "",
  Material: "",
  ShipTo: "",
  ShippingCondition: "",
  CCGroup: "",
  Incoterm: "",
};

export default function PricingNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const visible = form.conditionType ?? "";

  const handleCreate = async (e) => {
    e.preventDefault();
    setBanner({ type: "", message: "" });
    setSubmitting(true);

    const session = getSession();
    const userId = session?.user?.ID;

    const payload = {
      name:          form.name,
      description:   form.description     || undefined,
      conditionType: form.conditionType   || undefined,
      salesOrg:      form.salesOrg        || undefined,
      price:         Number(form.price)   || 0,
      currency:      form.currency,
      quantity:      Number(form.quantity) || undefined,
      unit:          form.unit            || undefined,
      billingCycle:  BILLING_CYCLE_MAP[form.billingCycle] ?? "monthly",
      validFrom:     form.validFrom       || undefined,
      validTo:       form.validTo         || undefined,
      PricingStatus:  "Pending",
      ApprovalStatus: "Not_Started",
      ...(form.SoldTo            && { SoldTo:            form.SoldTo            }),
      ...(form.Material          && { Material:          form.Material          }),
      ...(form.ShipTo            && { ShipTo:            form.ShipTo            }),
      ...(form.ShippingCondition && { ShippingCondition: form.ShippingCondition }),
      ...(form.CCGroup           && { CCGroup:           form.CCGroup           }),
      ...(form.Incoterm          && { Incoterm:          form.Incoterm          }),
      ...(userId                 && { requestedBy_ID:    userId                 }),
    };

    try {
      await apiFetch("/Pricing", { method: "POST", body: JSON.stringify(payload) });
      navigate("/");
    } catch (err) {
      setBanner({ type: "error", message: err.message });
      setSubmitting(false);
    }
  };

  return (
    <Shell>
      <Breadcrumbs items={[
        { label: "Pricing Management", to: "/" },
        { label: "Conditions",         to: "/" },
        { label: "New" },
      ]} />

      <PageHeader
        backLink={
          <Link to="/" className="mb-2 inline-block text-xs text-primary hover:underline">
            ← Back
          </Link>
        }
        title="Create Pricing Condition"
        subtitle="Define a new condition record. It will be created as a draft and can then be sent for approval."
      />

      <div className="space-y-4 p-6 pb-20">
        <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />

        <PricingForm
          id="pricing-form"
          form={form}
          onChange={set}
          editable
          showQuantity
          onSubmit={handleCreate}
          extraSection={
            <OrganizationalDataSection visible={visible} form={form} set={set} />
          }
        />
      </div>

      <FooterBar>
        <Button onClick={() => navigate("/")}>Cancel</Button>
        <Button form="pricing-form" type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Creating…" : "➤ Create"}
        </Button>
      </FooterBar>
    </Shell>
  );
}

/* ----------------------------------------------------------------- */

function OrganizationalDataSection({ visible, form, set }) {
  return (
    <Section title="Organizational Data">
      <FormRow label="Sold To">
        <Input
          className="max-w-md"
          value={form.SoldTo}
          onChange={(e) => set("SoldTo", e.target.value)}
          placeholder="Sold-To party"
        />
      </FormRow>

      {visible.includes("M") && (
        <FormRow label="Material">
          <Input
            className="max-w-md"
            value={form.Material}
            onChange={(e) => set("Material", e.target.value)}
            placeholder="Material"
          />
        </FormRow>
      )}

      {visible.includes("Sh") && (
        <FormRow label="Ship To">
          <Input
            className="max-w-md"
            value={form.ShipTo}
            onChange={(e) => set("ShipTo", e.target.value)}
            placeholder="Ship-To party"
          />
        </FormRow>
      )}

      <FormRow label="Shipping Condition">
        <Select
          className="max-w-md"
          value={form.ShippingCondition}
          onChange={(e) => set("ShippingCondition", e.target.value)}
        >
          <option value="">-- Select Shipping Condition --</option>
          <option value="C1">Collect by Rail</option>
          <option value="C2">Collect by Air</option>
          <option value="C3">Collect by Road</option>
          <option value="C4">Collect by Sea</option>
          <option value="C5">Collect by WW</option>
          <option value="C6">Collect by Air-P</option>
          <option value="C7">Collect by RoadLFL</option>
        </Select>
      </FormRow>

      {visible.includes("Cu") && (
        <FormRow label="Customer Condition Group">
          <Select
            className="max-w-md"
            value={form.CCGroup}
            onChange={(e) => set("CCGroup", e.target.value)}
          >
            <option value="">-- Select Customer Condition Group --</option>
            {["A", "B", "C", "D", "E", "F", "G", "H"].map((p, i) => (
              <option key={p} value={String(i + 1)}>Price {p}</option>
            ))}
          </Select>
        </FormRow>
      )}

      {visible.includes("I") && (
        <FormRow label="Incoterm">
          <Select
            className="max-w-md"
            value={form.Incoterm}
            onChange={(e) => set("Incoterm", e.target.value)}
          >
            <option value="">-- Select Incoterm --</option>
            {["A", "B", "C", "D", "E"].map((c, i) => (
              <option key={c} value={String(i + 1)}>Class_{c}</option>
            ))}
          </Select>
        </FormRow>
      )}
    </Section>
  );
}
