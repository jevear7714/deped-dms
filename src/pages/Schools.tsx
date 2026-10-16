import { useMemo, useState, type FormEvent } from "react";
import "./Schools.css";

type SchoolStatus = "Active" | "For Review" | "Inactive";
type School = {
  id: string;
  name: string;
  level: string;
  region: string;
  division: string;
  district: string;
  city: string;
  barangay: string;
  type: string;
  enrollment: number | "";
  teachers: number | "";
  status: SchoolStatus;
  [key: string]: string | number;
};
type Column = { key: string; label: string; type: "text" | "number" | "date" | "dropdown" | "checkbox"; options?: string[]; required?: boolean; custom?: boolean };

const baseColumns: Column[] = [
  { key: "id", label: "School ID", type: "text", required: true },
  { key: "name", label: "School Name", type: "text", required: true },
  { key: "level", label: "School Level", type: "dropdown", options: ["Elementary", "Junior High School", "Senior High School", "Integrated"] },
  { key: "region", label: "Region", type: "text" },
  { key: "division", label: "Schools Division Office", type: "text" },
  { key: "district", label: "District", type: "text" },
  { key: "city", label: "Municipality/City", type: "text", required: true },
  { key: "barangay", label: "Barangay", type: "text" },
  { key: "type", label: "School Type", type: "dropdown", options: ["Public", "Private"] },
  { key: "enrollment", label: "Enrollment", type: "number" },
  { key: "teachers", label: "Number of Teachers", type: "number" },
  { key: "status", label: "School Status", type: "dropdown", options: ["Active", "For Review", "Inactive"] },
];

const seedSchools: School[] = [
  ["SDO-0001","Mabini Central Elementary School","Elementary","Region VII - Central Visayas","Cebu City Division","Central District","Cebu City","Mabini","Public",620,28,"Active"],
  ["SDO-0002","Riverside National High School","Junior High School","Region VII - Central Visayas","Mandaue City Division","North District","Mandaue City","Subangdaku","Public",840,42,"Active"],
  ["SDO-0003","San Isidro Integrated School","Integrated","Region VII - Central Visayas","Talisay City Division","East District","Talisay City","San Isidro","Public",1050,51,"Active"],
  ["SDO-0004","Mountain View Elementary School","Elementary","Region VII - Central Visayas","Toledo City Division","West District","Toledo City","Bato","Public",410,19,"For Review"],
  ["SDO-0005","Cebu Coastal Senior High School","Senior High School","Region VII - Central Visayas","Cebu City Division","South District","Cebu City","Poblacion","Public",720,34,"Active"],
  ["SDO-0006","Greenfields Elementary School","Elementary","Region VII - Central Visayas","Lapu-Lapu City Division","Mactan District","Lapu-Lapu City","Pusok","Public",530,24,"Active"],
  ["SDO-0007","Northview Integrated School","Integrated","Region VII - Central Visayas","Consolacion Division","North District","Consolacion","Poblacion Occidental","Public",960,45,"Active"],
  ["SDO-0008","Baybay National High School","Junior High School","Region VII - Central Visayas","Danao City Division","Coastal District","Danao City","Baybay","Public",680,32,"For Review"],
  ["SDO-0009","Bright Path Learning Center","Elementary","Region VII - Central Visayas","Cebu City Division","Central District","Cebu City","Lahug","Private",290,16,"Active"],
  ["SDO-0010","Pinecrest Senior High School","Senior High School","Region VII - Central Visayas","Naga City Division","South District","Naga City","Inayagan","Public",570,27,"Active"],
  ["SDO-0011","Lakeside Elementary School","Elementary","Region VII - Central Visayas","Talisay City Division","West District","Talisay City","Linao","Public",380,18,"Inactive"],
  ["SDO-0012","Horizon Integrated School","Integrated","Region VII - Central Visayas","Mandaue City Division","East District","Mandaue City","Basak","Public",910,43,"Active"],
].map((r) => Object.fromEntries(baseColumns.map((c, i) => [c.key, r[i]])) as School);

const filterKeys = ["region", "division", "district", "city", "level", "type", "status"];
const emptySchool = (): School => ({
  id: "", name: "", level: "", region: "Region VII - Central Visayas", division: "",
  district: "", city: "", barangay: "", type: "Public", enrollment: 0, teachers: 0, status: "Active",
});
const statusClass = (status: string) => status === "Active" ? "active" : status === "For Review" ? "review" : "inactive";
const escapeCsv = (value: unknown) => {
  const s = String(value ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default function Schools() {
  const [schools, setSchools] = useState<School[]>(seedSchools);
  const [customColumns, setCustomColumns] = useState<Column[]>([]);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; direction: 1 | -1 }>({ key: "id", direction: 1 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | "column" | "removeColumn" | "delete" | null>(null);
  const [draft, setDraft] = useState<School>(emptySchool());
  const [editingId, setEditingId] = useState("");
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState<Column["type"]>("text");
  const [columnOptions, setColumnOptions] = useState("");
  const [columnRequired, setColumnRequired] = useState(false);
  const [columnToRemove, setColumnToRemove] = useState("");
  const [toast, setToast] = useState("");

  const columns = [...baseColumns, ...customColumns];
  const filtered = useMemo(() => {
    let rows = schools.filter((school) => {
      const text = Object.values(school).join(" ").toLowerCase();
      return (!search || text.includes(search.toLowerCase())) &&
        Object.entries(filters).every(([key, value]) => !value || String(school[key] ?? "") === value);
    });
    rows = [...rows].sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      const result = typeof av === "number" || typeof bv === "number"
        ? Number(av || 0) - Number(bv || 0)
        : String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
      return result * sort.direction;
    });
    return rows;
  }, [schools, search, filters, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeCount = schools.filter((s) => s.status === "Active").length;
  const totalEnrollment = schools.reduce((sum, s) => sum + Number(s.enrollment || 0), 0);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2800); };

  const createId = () => {
    let n = 1;
    while (schools.some((s) => s.id === `SDO-${String(n).padStart(4, "0")}`)) n++;
    return `SDO-${String(n).padStart(4, "0")}`;
  };
  const startAdd = () => {
    setDraft({ ...emptySchool(), id: createId() });
    setEditingId("");
    setModal("add");
  };
  const startEdit = (school: School) => {
    setDraft({ ...school });
    setEditingId(school.id);
    setModal("edit");
  };
  const saveSchool = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (schools.some((s) => s.id !== editingId && s.name.trim().toLowerCase() === draft.name.trim().toLowerCase())) {
      notify("A school with this name already exists.");
      return;
    }
    if (modal === "add") setSchools((old) => [{ ...draft }, ...old]);
    else setSchools((old) => old.map((s) => s.id === editingId ? { ...draft } : s));
    setModal(null);
    setPage(1);
    notify(modal === "add" ? "School added successfully." : "School record updated.");
  };
  const removeSchool = (id: string) => {
    setSchools((old) => old.filter((s) => s.id !== id));
    setSelected((old) => old.filter((x) => x !== id));
    setModal(null);
    notify("School record deleted.");
  };
  const exportCsv = () => {
    const content = [columns.map((c) => escapeCsv(c.label)).join(","), ...filtered.map((s) => columns.map((c) => escapeCsv(s[c.key])).join(","))].join("\r\n");
    const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "schools-data.csv"; anchor.click();
    URL.revokeObjectURL(url);
    notify("Schools CSV exported.");
  };
  const createColumn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = columnName.trim();
    if (!label) return;
    if (columns.some((c) => c.label.toLowerCase() === label.toLowerCase())) {
      notify("A column with that name already exists."); return;
    }
    const options = columnOptions.split(",").map((s) => s.trim()).filter(Boolean);
    if (columnType === "dropdown" && !options.length) { notify("Enter at least one dropdown option."); return; }
    const key = `custom_${Date.now()}`;
    const col: Column = { key, label, type: columnType, required: columnRequired, custom: true, ...(columnType === "dropdown" ? { options } : {}) };
    setCustomColumns((old) => [...old, col]);
    setSchools((old) => old.map((s) => ({ ...s, [key]: columnType === "checkbox" ? "No" : "" })));
    setColumnName(""); setColumnOptions(""); setColumnRequired(false); setColumnType("text"); setModal(null);
    notify("Custom column added.");
  };
  const removeColumn = () => {
    setCustomColumns((old) => old.filter((c) => c.key !== columnToRemove));
    setSchools((old) => old.map((s) => { const next = { ...s }; delete next[columnToRemove]; return next; }));
    setColumnToRemove(""); setModal(null); notify("Custom column removed.");
  };

  return (
    <div className="school-app">
      <main className="school-main">
        <header className="school-topbar">
          <div className="school-breadcrumb">Workspace <span>/</span> <strong>Schools</strong></div>
          <span className="sample-pill">● SAMPLE DATA</span>
        </header>
        <div className="school-content">
          <div className="school-page-heading">
            <div><h1>School Records</h1><p>Manage school profiles, enrollment information, and school status.</p></div>
            <div className="school-heading-actions">
              <button className="school-btn" onClick={exportCsv}>↓ Export CSV</button>
              <button className="school-btn" onClick={() => setModal("column")}>＋ Add Column</button>
              <button className="school-btn" onClick={() => setModal("removeColumn")}>− Remove Column</button>
              <button className="school-btn primary" onClick={startAdd}>＋ Add School</button>
            </div>
          </div>

          <section className="school-stats">
            <article className="school-stat"><span>Total Schools</span><strong>{schools.length}</strong><small>School records in this session</small><i>⌂</i></article>
            <article className="school-stat"><span>Active Schools</span><strong>{activeCount}</strong><small>{schools.length - activeCount} need review or are inactive</small><i className="green">✓</i></article>
            <article className="school-stat"><span>Total Enrollment</span><strong>{totalEnrollment.toLocaleString()}</strong><small>Across all school records</small><i>▤</i></article>
            <article className="school-stat"><span>For Review</span><strong>{schools.filter((s) => s.status === "For Review").length}</strong><small>Records needing attention</small><i className="amber">!</i></article>
          </section>

          <section className="school-panel">
            <div className="school-toolbar">
              <div className="school-toolbar-left">
                <form className="school-search" onSubmit={(e) => { e.preventDefault(); setSearch(searchDraft.trim()); setPage(1); }}>
                  <span>⌕</span><input aria-label="Search schools" placeholder="Search school name, ID, or location..." value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} />
                  <button className="school-btn small" type="submit">Search</button>
                </form>
                <span className="school-count">{filtered.length} records</span>
              </div>
              <button className="school-btn small danger" disabled={!selected.length} onClick={() => setModal("delete")}>Delete selected ({selected.length})</button>
            </div>
            <div className="school-filterbar"><b>FILTER BY</b>
              {filterKeys.map((key) => {
                const col = baseColumns.find((c) => c.key === key)!;
                const values = [...new Set(schools.map((s) => String(s[key] ?? "")).filter(Boolean))].sort();
                const options = col.options ?? values;
                return <select key={key} aria-label={`Filter by ${col.label}`} value={filters[key] ?? ""} onChange={(e) => { setFilters((old) => ({ ...old, [key]: e.target.value })); setPage(1); }}>
                  <option value="">All {col.label}</option>{options.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>;
              })}
              <button className="school-btn small" onClick={() => { setFilters({}); setSearch(""); setSearchDraft(""); setPage(1); }}>Clear filters</button>
            </div>
            <div className="school-table-wrap"><table className="school-table">
              <thead><tr><th><input aria-label="Select visible schools" type="checkbox" checked={visible.length > 0 && visible.every((s) => selected.includes(s.id))} onChange={(e) => setSelected((old) => e.target.checked ? [...new Set([...old, ...visible.map((s) => s.id)])] : old.filter((id) => !visible.some((s) => s.id === id)))} /></th>
                {columns.map((c) => <th key={c.key}><button onClick={() => setSort((old) => old.key === c.key ? { key: c.key, direction: old.direction === 1 ? -1 : 1 } : { key: c.key, direction: 1 })}>{c.label} {sort.key === c.key ? (sort.direction === 1 ? "↑" : "↓") : "↕"}</button></th>)}<th>Actions</th>
              </tr></thead>
              <tbody>{visible.map((school) => <tr key={school.id}>
                <td><input aria-label={`Select ${school.name}`} type="checkbox" checked={selected.includes(school.id)} onChange={(e) => setSelected((old) => e.target.checked ? [...old, school.id] : old.filter((id) => id !== school.id))} /></td>
                {columns.map((c) => <td key={c.key}>{c.key === "status" ? <span className={`school-status ${statusClass(String(school[c.key] ?? ""))}`}>{school[c.key]}</span> : c.type === "number" && school[c.key] !== "" ? Number(school[c.key]).toLocaleString() : String(school[c.key] ?? "—") || "—"}</td>)}
                <td><div className="school-row-actions"><button title="View record" onClick={() => { setDraft({ ...school }); setModal("view"); }}>◉</button><button title="Edit record" onClick={() => startEdit(school)}>✎</button><button title="Delete record" onClick={() => { setEditingId(school.id); setModal("delete"); }}>⌫</button></div></td>
              </tr>)}
              {!visible.length && <tr><td colSpan={columns.length + 2} className="school-empty"><strong>No matching schools found</strong><span>Try adjusting your search or filters.</span></td></tr>}
              </tbody>
            </table></div>
            <footer className="school-table-foot">
              <span>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records <span className="muted">(total {schools.length})</span></span>
              <div className="school-pagination"><label>Rows</label><select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</button><span>Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>→</button></div>
            </footer>
          </section>
          <p className="school-helper">Prototype note: sample records are fictional. Changes are held in the current page session and are not sent to a database.</p>
        </div>
      </main>

      {modal && <div className="school-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
        <section className="school-modal" role="dialog" aria-modal="true">
          <header className="school-modal-head"><div>
            <h2>{modal === "add" ? "Add School" : modal === "edit" ? "Edit School Record" : modal === "view" ? draft.name : modal === "column" ? "Add Custom Column" : modal === "removeColumn" ? "Remove Custom Column" : "Delete school records?"}</h2>
            <p>{modal === "view" ? `${draft.id} · School details` : modal === "column" ? "Create an additional field for school records." : modal === "removeColumn" ? "Built-in columns cannot be removed." : modal === "delete" ? "This action cannot be undone in this prototype." : "Fields marked * are required."}</p>
          </div><button className="school-modal-close" onClick={() => setModal(null)}>✕</button></header>
          {(modal === "add" || modal === "edit") && <form onSubmit={saveSchool}>
            <div className="school-form-grid">{columns.map((c) => <label className="school-field" key={c.key}><span>{c.label}{c.required && c.key !== "id" ? <b> *</b> : ""}</span>
              {c.key === "id" ? <input value={draft.id} disabled /> :
               c.type === "dropdown" ? <select required={c.required} value={String(draft[c.key] ?? "")} onChange={(e) => setDraft((old) => ({ ...old, [c.key]: e.target.value }))}><option value="">Select {c.label.toLowerCase()}</option>{(c.options ?? []).map((o) => <option key={o}>{o}</option>)}</select> :
               c.type === "checkbox" ? <input type="checkbox" checked={draft[c.key] === "Yes"} onChange={(e) => setDraft((old) => ({ ...old, [c.key]: e.target.checked ? "Yes" : "No" }))} /> :
               <input type={c.type === "number" ? "number" : c.type === "date" ? "date" : "text"} min={c.type === "number" ? 0 : undefined} required={c.required} value={String(draft[c.key] ?? "")} onChange={(e) => setDraft((old) => ({ ...old, [c.key]: c.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value }))} />}
            </label>)}</div>
            <footer className="school-modal-foot"><button type="button" className="school-btn" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="school-btn primary">Save Record</button></footer>
          </form>}
          {modal === "view" && <><div className="school-detail-grid">{columns.map((c) => <div key={c.key} className="school-detail-item"><span>{c.label}</span><strong>{String(draft[c.key] ?? "—") || "—"}</strong></div>)}</div><footer className="school-modal-foot"><button className="school-btn" onClick={() => setModal(null)}>Close</button><button className="school-btn primary" onClick={() => startEdit(draft)}>✎ Edit record</button></footer></>}
          {modal === "column" && <form onSubmit={createColumn}><div className="school-modal-body school-form-grid">
            <label className="school-field full"><span>Column Name *</span><input required maxLength={60} value={columnName} onChange={(e) => setColumnName(e.target.value)} placeholder="e.g. Date Established" /></label>
            <label className="school-field"><span>Data Type</span><select value={columnType} onChange={(e) => setColumnType(e.target.value as Column["type"])}><option value="text">Text</option><option value="number">Number</option><option value="date">Date</option><option value="dropdown">Dropdown</option><option value="checkbox">Checkbox</option></select></label>
            <label className="school-required-check"><input type="checkbox" checked={columnRequired} onChange={(e) => setColumnRequired(e.target.checked)} /> Required field</label>
            {columnType === "dropdown" && <label className="school-field full"><span>Dropdown Options *</span><input required value={columnOptions} onChange={(e) => setColumnOptions(e.target.value)} placeholder="Separate options with commas" /></label>}
          </div><footer className="school-modal-foot"><button type="button" className="school-btn" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="school-btn primary">Create Column</button></footer></form>}
          {modal === "removeColumn" && <div className="school-modal-body">{customColumns.length ? customColumns.map((c) => <div className="school-remove-column" key={c.key}><div><strong>{c.label}</strong><span>{c.type}{c.required ? " · Required" : ""}</span></div><button className="school-btn danger small" onClick={() => setColumnToRemove(c.key)}>Choose</button></div>) : <div className="school-empty"><strong>No custom columns</strong><span>There are no custom columns to remove.</span></div>}
            {columnToRemove && <div className="school-confirm-inline"><p>Remove “{customColumns.find((c) => c.key === columnToRemove)?.label}” and its values?</p><button className="school-btn danger" onClick={removeColumn}>Confirm removal</button></div>}
            <footer className="school-modal-foot"><button className="school-btn" onClick={() => { setColumnToRemove(""); setModal(null); }}>Close</button></footer></div>}
          {modal === "delete" && <div className="school-modal-body"><p>{editingId ? `Delete ${schools.find((s) => s.id === editingId)?.name ?? "this school"}?` : `Delete ${selected.length} selected school record(s)?`}</p><footer className="school-modal-foot"><button className="school-btn" onClick={() => setModal(null)}>Cancel</button><button className="school-btn danger" onClick={() => editingId ? removeSchool(editingId) : (setSchools((old) => old.filter((s) => !selected.includes(s.id))), setSelected([]), setModal(null), notify("Selected schools deleted."))}>Delete</button></footer></div>}
        </section>
      </div>}
      {toast && <div className="school-toast" role="status">{toast}</div>}
    </div>
  );
}
