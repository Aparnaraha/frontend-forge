import { Field, Input, Select } from "../ui/Form";
import { Button } from "../ui/Button";

/**
 * Search + status + org filter row used on the list page.
 */
export function PricingFilterBar({
  query,
  onQueryChange,
  statusFilter,
  onStatusChange,
  orgFilter,
  onOrgChange,
  orgs,
  onRefresh,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-border px-5 py-4">
      <Field label="Search" className="w-64">
        <Input
          placeholder="Condition ID or name"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </Field>

      <Field label="Status" className="w-44">
        <Select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">All</option>
          <option value="Pending">Draft</option>
          <option value="Submitted">In Approval</option>
          <option value="Completed">Released</option>
          <option value="Denied">Rejected</option>
          <option value="Expired">Expired</option>
        </Select>
      </Field>

      {orgs.length > 0 && (
        <Field label="Sales Org." className="w-44">
          <Select value={orgFilter} onChange={(e) => onOrgChange(e.target.value)}>
            <option value="all">All</option>
            {orgs.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </Select>
        </Field>
      )}

      <div className="ml-auto flex gap-2">
        <Button size="sm" onClick={onRefresh}>↺ Refresh</Button>
        <Button size="sm" onClick={onReset}>↻ Reset</Button>
      </div>
    </div>
  );
}
