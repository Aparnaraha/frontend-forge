import { useState } from "react";
import { QnovateDrawer, DrawerSection, DrawerField } from "../qnovate/QnovateDrawer";
import { QButton } from "../qnovate/QnovateButton";
import { Input, Select, Textarea } from "../ui/Form";

import { apiFetch } from "../../lib/api";
import { getSession } from "../../lib/auth";
import { BILLING_CYCLE_MAP } from "../../lib/format";

const EMPTY = {
  conditionType: "", name: "", description: "",
  salesOrg: "", price: "", currency: "USD",
  quantity: "", unit: "LB", billingCycle: "monthly",
  validFrom: "", validTo: "",
  SoldTo: "", Material: "", ShipTo: "",
  ShippingCondition: "", CCGroup: "", Incoterm: "",
};

const CONDITION_TYPES = [
  { value: "S/M/SC/Cu/I",      label: "Sold-To / Material / Shipping Condition / Customer CG / Incoterm" },
  { value: "S/Sh/M/SC/Cu/I",   label: "Sold-To / Ship-To / Material / Shipping Condition / Customer CG / Incoterm" },
  { value: "S/M/SC",           label: "Sold-To / Material / Shipping Condition" },
  { value: "S/Sh/M/SC",        label: "Sold-To / Ship-To / Material / Shipping Condition" },
  { value: "S/Sh/M/SC/Cu",     label: "Sold-To / Ship-To / Material / Shipping Condition / Customer CG" },
  { value: "S/M/SC/Cu",        label: "Sold-To / Material / Shipping Condition / Customer CG" },
];

const SALES_ORGS = [
  { value: "1000", label: "1000 / NA" },
  { value: "2000", label: "2000 / EU" },
  { value: "3000", label: "3000 / APAC" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY"];

/**
 * Right-side "Create Pricing Condition" drawer (Qnovate Create Account style).
 */
export function CreatePricingDrawer({ open, onClose, onCreated, onSaveAndOpen, onError }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const visible = form.conditionType ?? "";

  const buildPayload = () => {
    const userId = getSession()?.user?.ID;
    return {
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
  };

  const submit = async (openAfter) => {
    setSubmitting(true);
    try {
      const res = await apiFetch("/Pricing", {
        method: "POST",
        body: JSON.stringify(buildPayload()),
      });
      setForm(EMPTY);
      if (openAfter && res?.ID) onSaveAndOpen?.(res.ID);
      else onCreated?.();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QnovateDrawer
      open={open}
      onClose={onClose}
      title="Create Pricing Condition"
      width="w-[520px]"
      footer={
        <>
          <QButton variant="primary" disabled={submitting} onClick={() => submit(false)}>
            {submitting ? "Saving…" : "Save"}
          </QButton>
          <QButton variant="primary" disabled={submitting} onClick={() => submit(true)}>
            Save and Open
          </QButton>
          <QButton variant="link" onClick={onClose}>Cancel</QButton>
        </>
      }
    >
      <DrawerSection title="General">
        <DrawerField label="Name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="" />
        </DrawerField>

        <DrawerField label="Condition Type" required>
          <Select value={form.conditionType} onChange={(e) => set("conditionType", e.target.value)}>
            <option value="">--</option>
            {CONDITION_TYPES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </DrawerField>

        <DrawerField label="Sales Organization" required>
          <Select value={form.salesOrg} onChange={(e) => set("salesOrg", e.target.value)}>
            <option value="">--</option>
            {SALES_ORGS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </DrawerField>

        <DrawerField label="Description">
          <Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </DrawerField>
      </DrawerSection>

      <DrawerSection title="Pricing">
        <DrawerField label="Amount" required>
          <div className="flex gap-2">
            <Input
              type="number" min="0" step="0.01"
              className="flex-1"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
            <Select className="w-24" value={form.currency} onChange={(e) => set("currency", e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </DrawerField>

        <DrawerField label="Quantity">
          <div className="flex gap-2">
            <Input
              type="number" min="0" step="0.01"
              className="flex-1"
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
            <Select className="w-24" value={form.unit} onChange={(e) => set("unit", e.target.value)}>
              <option value="LB">LB</option>
            </Select>
          </div>
        </DrawerField>

        <DrawerField label="Billing Cycle">
          <Select value={form.billingCycle} onChange={(e) => set("billingCycle", e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </Select>
        </DrawerField>
      </DrawerSection>

      <DrawerSection title="Validity">
        <DrawerField label="Valid From" required>
          <Input type="date" value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)} />
        </DrawerField>
        <DrawerField label="Valid To" required>
          <Input type="date" value={form.validTo} onChange={(e) => set("validTo", e.target.value)} />
        </DrawerField>
      </DrawerSection>

      <DrawerSection title="Organizational Data" defaultOpen={false}>
        <DrawerField label="Sold To">
          <Input value={form.SoldTo} onChange={(e) => set("SoldTo", e.target.value)} placeholder="Sold-To party" />
        </DrawerField>

        {visible.includes("M") && (
          <DrawerField label="Material">
            <Input value={form.Material} onChange={(e) => set("Material", e.target.value)} placeholder="Material" />
          </DrawerField>
        )}
        {visible.includes("Sh") && (
          <DrawerField label="Ship To">
            <Input value={form.ShipTo} onChange={(e) => set("ShipTo", e.target.value)} placeholder="Ship-To party" />
          </DrawerField>
        )}

        <DrawerField label="Shipping Condition">
          <Select value={form.ShippingCondition} onChange={(e) => set("ShippingCondition", e.target.value)}>
            <option value="">-- Select --</option>
            <option value="C1">Collect by Rail</option>
            <option value="C2">Collect by Air</option>
            <option value="C3">Collect by Road</option>
            <option value="C4">Collect by Sea</option>
            <option value="C5">Collect by WW</option>
            <option value="C6">Collect by Air-P</option>
            <option value="C7">Collect by RoadLFL</option>
          </Select>
        </DrawerField>

        {visible.includes("Cu") && (
          <DrawerField label="Customer Condition Group">
            <Select value={form.CCGroup} onChange={(e) => set("CCGroup", e.target.value)}>
              <option value="">-- Select --</option>
              {["A", "B", "C", "D", "E", "F", "G", "H"].map((p, i) => (
                <option key={p} value={String(i + 1)}>Price {p}</option>
              ))}
            </Select>
          </DrawerField>
        )}

        {visible.includes("I") && (
          <DrawerField label="Incoterm">
            <Select value={form.Incoterm} onChange={(e) => set("Incoterm", e.target.value)}>
              <option value="">-- Select --</option>
              {["A", "B", "C", "D", "E"].map((c, i) => (
                <option key={c} value={String(i + 1)}>Class_{c}</option>
              ))}
            </Select>
          </DrawerField>
        )}
      </DrawerSection>
    </QnovateDrawer>
  );
}
