import { Section } from "../ui/Card";
import { FormRow, ReadOnly } from "../ui/FormRow";
import { Input, Select, Textarea } from "../ui/Form";

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
 * Shared editable pricing form. Used by both Detail and New pages.
 *
 * @param {object} props
 * @param {object} props.form
 * @param {(key: string, value: any) => void} props.onChange
 * @param {boolean} [props.editable=true]   When false, all fields render read-only.
 * @param {boolean} [props.showQuantity]    Show the qty/unit row (New page).
 * @param {string} props.id                 form id (used by sticky footer submit buttons).
 * @param {(e: React.FormEvent) => void} props.onSubmit
 * @param {React.ReactNode} [props.extraSection] Slot rendered after Validity (e.g. organisational data).
 */
export function PricingForm({
  form,
  onChange,
  editable = true,
  showQuantity = false,
  id,
  onSubmit,
  extraSection,
}) {
  const set = (k) => (e) => onChange(k, e.target.value);

  return (
    <form id={id} onSubmit={onSubmit} className="space-y-4">
      <Section title="General Information">
        <FormRow label="Condition Type" required>
          {editable ? (
            <Select className="max-w-md" value={form.conditionType} onChange={set("conditionType")}>
              <option value="">-- Select --</option>
              {CONDITION_TYPES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
          ) : (
            <ReadOnly value={form.conditionType} />
          )}
        </FormRow>

        <FormRow label="Name" required>
          {editable ? (
            <Input className="max-w-md" value={form.name} onChange={set("name")} required />
          ) : (
            <ReadOnly value={form.name} />
          )}
        </FormRow>

        <FormRow label="Description">
          {editable ? (
            <Textarea className="max-w-xl" rows={2} value={form.description} onChange={set("description")} />
          ) : (
            <ReadOnly value={form.description} />
          )}
        </FormRow>

        <FormRow label="Sales Organization" required>
          {editable ? (
            <Select className="max-w-md" value={form.salesOrg} onChange={set("salesOrg")}>
              <option value="">-- Select --</option>
              {SALES_ORGS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          ) : (
            <ReadOnly value={form.salesOrg} />
          )}
        </FormRow>
      </Section>

      <Section title="Pricing">
        <FormRow label="Amount" required>
          {editable ? (
            <div className="flex max-w-md gap-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                className="flex-1"
                value={form.price}
                onChange={set("price")}
                required
              />
              <Select className="w-24" value={form.currency} onChange={set("currency")}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
          ) : (
            <ReadOnly value={`${form.currency} ${form.price}`} />
          )}
        </FormRow>

        {showQuantity && editable && (
          <FormRow label="Quantity" required>
            <div className="flex max-w-md gap-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                className="flex-1"
                value={form.quantity ?? ""}
                onChange={set("quantity")}
                required
              />
              <Select className="w-24" value={form.unit ?? "LB"} onChange={set("unit")}>
                <option value="LB">LB</option>
              </Select>
            </div>
          </FormRow>
        )}

        <FormRow label="Billing Cycle">
          {editable ? (
            <Select className="max-w-md" value={form.billingCycle} onChange={set("billingCycle")}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </Select>
          ) : (
            <ReadOnly value={form.billingCycle} />
          )}
        </FormRow>
      </Section>

      <Section title="Validity Period">
        <FormRow label="Valid From" required>
          {editable ? (
            <Input type="date" className="max-w-xs" value={form.validFrom} onChange={set("validFrom")} required />
          ) : (
            <ReadOnly value={form.validFrom} />
          )}
        </FormRow>
        <FormRow label="Valid To" required>
          {editable ? (
            <Input type="date" className="max-w-xs" value={form.validTo} onChange={set("validTo")} required />
          ) : (
            <ReadOnly value={form.validTo} />
          )}
        </FormRow>
      </Section>

      {extraSection}
    </form>
  );
}
