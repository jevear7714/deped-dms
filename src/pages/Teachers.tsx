import { useMemo, useState, type FormEvent } from "react";
import "./Teachers.css";

type Status = "Active" | "For Review" | "Inactive";
type Teacher = {
  id: string; first: string; last: string; middle: string; sex: string;
  position: string; subject: string; school: string; status: Status;
  [key: string]: string;
};
type Column = {
  key: string; label: string; type: "text" | "dropdown" | "number" | "date" | "checkbox";
  options?: string[]; required?: boolean; custom?: boolean;
};

const schools = [
  "Mabini Central Elementary School", "Riverside National High School",
  "San Isidro Integrated School", "Mountain View Elementary School",
  "Cebu Coastal Senior High School", "Greenfields Elementary School",
  "Northview Integrated School", "Baybay National High School",
  "Bright Path Learning Center", "Pinecrest Senior High School",
  "Lakeside Elementary School", "Horizon Integrated School",
];

const baseColumns: Column[] = [
  { key: "id", label: "Teacher ID", type: "text", required: true },
  { key: "first", label: "First Name", type: "text", required: true },
  { key: "last", label: "Last Name", type: "text", required: true },
  { key: "middle", label: "Middle Name", type: "text" },
  { key: "sex", label: "Sex", type: "dropdown", options: ["Female", "Male", "Prefer not to say"] },
  { key: "position", label: "Position", type: "dropdown", options: ["Teacher I", "Teacher II", "Teacher III", "Master Teacher I", "Master Teacher II", "School Principal"] },
  { key: "subject", label: "Subject Specialization", type: "text" },
  { key: "school", label: "School Assignment", type: "dropdown", options: schools, required: true },
  { key: "status", label: "Employment Status", type: "dropdown", options: ["Active", "For Review", "Inactive"] },
];

const seed: Teacher[] = [
  ["Maria","Santos","L.","Female","Teacher I","English",schools[0],"Active"],
  ["Juan","Reyes","M.","Male","Teacher II","Mathematics",schools[1],"Active"],
  ["Ana","Cruz","P.","Female","Teacher III","Science",schools[2],"Active"],
  ["Pedro","Garcia","R.","Male","Teacher I","Filipino",schools[3],"For Review"],
  ["Liza","Dela Rosa","C.","Female","Master Teacher I","English",schools[4],"Active"],
  ["Marco","Villanueva","A.","Male","Teacher II","Araling Panlipunan",schools[5],"Active"],
  ["Grace","Mendoza","T.","Female","Teacher III","Mathematics",schools[6],"Active"],
  ["Jose","Bautista","N.","Male","Teacher I","MAPEH",schools[7],"Active"],
  ["Elena","Torres","S.","Female","Teacher II","Science",schools[8],"Inactive"],
  ["Ramon","Flores","D.","Male","Teacher III","TLE",schools[9],"Active"],
  ["Carmen","Aquino","V.","Female","Teacher I","Filipino",schools[10],"Active"],
  ["Daniel","Castillo","J.","Male","Master Teacher II","English",schools[11],"Active"],
  ["Sofia","Navarro","E.","Female","Teacher II","Mathematics",schools[0],"Active"],
  ["Miguel","Ramos","B.","Male","Teacher I","Science",schools[1],"For Review"],
  ["Patricia","Lim","F.","Female","Teacher III","Filipino",schools[2],"Active"],
  ["Andres","Diaz","G.","Male","Teacher II","Araling Panlipunan",schools[3],"Active"],
  ["Bea","Fernandez","I.","Female","Teacher I","English",schools[4],"Active"],
  ["Carlo","Gonzales","O.","Male","Teacher III","MAPEH",schools[5],"Active"],
  ["Nina","Pascual","Q.","Female","Teacher II","Science",schools[6],"Active"],
  ["Luis","Morales","U.","Male","Teacher I","Mathematics",schools[7],"Active"],
  ["Irene","Salazar","W.","Female","Teacher II","TLE",schools[8],"Active"],
  ["Noel","Soriano","Y.","Male","Teacher I","Filipino",schools[9],"Active"],
].map((r, i) => ({
  id: `TCH-DEMO-${String(i + 1).padStart(3, "0")}`,
  first: r[0], last: r[1], middle: r[2], sex: r[3], position: r[4],
  subject: r[5], school: r[6], status: r[7] as Status,
}));

const statusClass = (status: string) => status === "Active" ? "active" : status === "For Review" ? "review" : "inactive";
const csvEscape = (value: unknown) => {
  const s = String(value ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(seed);
  const [customColumns, setCustomColumns] = useState<Column[]>([]);
  const [queryDraft, setQueryDraft] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; direction: 1 | -1 }>({ key: "id", direction: 1 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [record, setRecord] = useState<Teacher | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view" | null>(null);
  const [columnModal, setColumnModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState<Column["type"]>("text");
  const [columnOptions, setColumnOptions] = useState("");
  const [columnRequired, setColumnRequired] = useState(false);
  const [toast, setToast] = useState("");

  const columns = useMemo(() => [...baseColumns, ...customColumns], [customColumns]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teachers.filter(t => {
      const matchesQuery = !q || Object.values(t).some(v => String(v).toLowerCase().includes(q));
      const matchesFilters = Object.entries(filters).every(([key, value]) => !value || t[key] === value);
      return matchesQuery && matchesFilters;
    }).sort((a, b) => {
      const av = a[sort.key] ?? "", bv = b[sort.key] ?? "";
      return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" }) * sort.direction;
    });
  }, [teachers, query, filters, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((Math.min(page, pages) - 1) * pageSize, Math.min(page, pages) * pageSize);
  const active = teachers.filter(t => t.status === "Active").length;
  const review = teachers.filter(t => t.status === "For Review").length;
  const inactive = teachers.filter(t => t.status === "Inactive").length;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }
  function startAdd() {
    const n = Math.max(0, ...teachers.map(t => Number(t.id.match(/(\d+)$/)?.[1] ?? 0))) + 1;
    const next: Teacher = { id: `TCH-DEMO-${String(n).padStart(3, "0")}`, first: "", last: "", middle: "", sex: "", position: "", subject: "", school: "", status: "Active" };
    customColumns.forEach(c => { next[c.key] = ""; });
    setRecord(next); setMode("add");
  }
  function startEdit(t: Teacher) { setRecord({ ...t }); setMode("edit"); }
  function saveRecord(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!record) return;
    if (!record.first.trim() || !record.last.trim() || !record.school) {
      notify("First name, last name, and school assignment are required."); return;
    }
    if (mode === "add") setTeachers(old => [record, ...old]);
    else setTeachers(old => old.map(t => t.id === record.id ? record : t));
    setMode(null); setRecord(null); setPage(1);
    notify(mode === "add" ? "Teacher record added." : "Teacher record updated.");
  }
  function deleteOne(t: Teacher) {
    if (!window.confirm(`Delete ${t.first} ${t.last}? This cannot be undone in this prototype.`)) return;
    setTeachers(old => old.filter(x => x.id !== t.id));
    setSelected(old => old.filter(id => id !== t.id));
    notify("Teacher record deleted.");
  }
  function deleteSelected() {
    if (!selected.length || !window.confirm(`Delete ${selected.length} selected teacher records?`)) return;
    setTeachers(old => old.filter(t => !selected.includes(t.id)));
    setSelected([]); notify("Selected records deleted.");
  }
  function exportCSV() {
    const csv = [columns.map(c => csvEscape(c.label)).join(","), ...filtered.map(t => columns.map(c => csvEscape(t[c.key])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "teachers-data-demo.csv"; a.click(); URL.revokeObjectURL(url);
    notify("Teacher CSV exported.");
  }
  function createColumn() {
    const name = columnName.trim();
    const options = columnOptions.split(",").map(s => s.trim()).filter(Boolean);
    if (!name) { notify("Enter a column name."); return; }
    if (columns.some(c => c.label.toLowerCase() === name.toLowerCase())) { notify("A column with that name already exists."); return; }
    if (columnType === "dropdown" && !options.length) { notify("Enter at least one dropdown option."); return; }
    const key = `custom_${Date.now()}`;
    const newColumn: Column = { key, label: name, type: columnType, required: columnRequired, custom: true, ...(columnType === "dropdown" ? { options } : {}) };
    setCustomColumns(old => [...old, newColumn]);
    setTeachers(old => old.map(t => ({ ...t, [key]: "" })));
    setColumnName(""); setColumnOptions(""); setColumnRequired(false); setColumnType("text"); setColumnModal(false);
    notify("Custom column added.");
  }
  function removeColumn(c: Column) {
    if (!window.confirm(`Remove "${c.label}" and its values?`)) return;
    setCustomColumns(old => old.filter(x => x.key !== c.key));
    setTeachers(old => old.map(t => { const copy = { ...t }; delete copy[c.key]; return copy; }));
    notify("Custom column removed.");
  }

  return <div className="teachers-app">
    <header className="topbar">
      <div className="crumb">Workspace&nbsp; / &nbsp;<b>Teachers</b></div>
      <span className="sample-pill">● SAMPLE DATA</span>
    </header>
    <main className="content">
      <div className="page-heading">
        <div><h1>Teacher Records</h1><p>Manage teacher information, assignments, and employment records.</p></div>
        <div className="heading-actions">
          <button className="btn" onClick={exportCSV}>↓ Export CSV</button>
          <button className="btn" onClick={() => setColumnModal(true)}>＋ Add Column</button>
          <button className="btn" onClick={() => setRemoveModal(true)}>− Remove Column</button>
          <button className="btn primary" onClick={startAdd}>＋ Add Row</button>
        </div>
      </div>

      <section className="stats">
        <Stat label="Total Teachers" value={teachers.length} foot="Teacher records in prototype" icon="♙" />
        <Stat label="Active Teachers" value={active} foot="Currently active" icon="✓" color="green" />
        <Stat label="For Review" value={review} foot="Records needing review" icon="◷" color="amber" />
        <Stat label="Inactive Teachers" value={inactive} foot="Inactive records" icon="⊘" color="red" />
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="toolbar-left">
            <form className="search" onSubmit={e => { e.preventDefault(); setQuery(queryDraft); setPage(1); }}>
              <span>⌕</span><input aria-label="Search teachers" placeholder="Search by name or ID..." value={queryDraft} onChange={e => setQueryDraft(e.target.value)} />
              <button className="btn small" type="submit">Search</button>
            </form>
            <span className="count-label">{filtered.length} records</span>
          </div>
          <button className="btn small danger" disabled={!selected.length} onClick={deleteSelected}>Delete selected ({selected.length})</button>
        </div>
        <div className="filter-bar">
          <span className="helper filter-label">FILTER BY</span>
          {(["school", "position", "subject", "status"] as const).map(key => {
            const c = baseColumns.find(x => x.key === key)!;
            const options = key === "school" ? schools : key === "subject" ? [...new Set(teachers.map(t => t.subject).filter(Boolean))].sort() : c.options || [];
            return <select className="select" aria-label={`Filter by ${c.label}`} key={key} value={filters[key] || ""} onChange={e => { setFilters(old => ({ ...old, [key]: e.target.value })); setPage(1); }}>
              <option value="">All {c.label}</option>{options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>;
          })}
          <button className="btn small" onClick={() => { setFilters({}); setQuery(""); setQueryDraft(""); setPage(1); }}>Clear filters</button>
        </div>
        <div className="table-wrap"><table>
          <thead><tr>
            <th><input type="checkbox" aria-label="Select all visible" checked={visible.length > 0 && visible.every(t => selected.includes(t.id))} onChange={e => setSelected(old => e.target.checked ? [...new Set([...old, ...visible.map(t => t.id)])] : old.filter(id => !visible.some(t => t.id === id)))} /></th>
            {columns.map(c => <th key={c.key}><button className="sort-btn" onClick={() => { setSort(old => old.key === c.key ? { key: c.key, direction: old.direction === 1 ? -1 : 1 } : { key: c.key, direction: 1 }); }}>{c.label} {sort.key === c.key ? (sort.direction === 1 ? "↑" : "↓") : "↕"}</button></th>)}
            <th>Actions</th>
          </tr></thead>
          <tbody>{visible.map(t => <tr key={t.id}>
            <td><input type="checkbox" aria-label={`Select ${t.id}`} checked={selected.includes(t.id)} onChange={e => setSelected(old => e.target.checked ? [...old, t.id] : old.filter(id => id !== t.id))} /></td>
            {columns.map(c => <td key={c.key}>{c.key === "status" ? <span className={`status ${statusClass(t.status)}`}>{t.status}</span> : c.key === "id" ? <span className="id-cell">{t.id}</span> : c.key === "first" ? <strong className="teacher-name">{t.first} {t.last}</strong> : (t[c.key] || <span className="muted">—</span>)}</td>)}
            <td><div className="row-actions"><button className="icon-btn" title="View record" onClick={() => { setRecord(t); setMode("view"); }}>◉</button><button className="icon-btn" title="Edit record" onClick={() => startEdit(t)}>✎</button><button className="icon-btn" title="Delete record" onClick={() => deleteOne(t)}>⌫</button></div></td>
          </tr>)}
          {!visible.length && <tr><td colSpan={columns.length + 2}><div className="empty"><strong>No matching records found</strong><span>Try adjusting your search or filters.</span></div></td></tr>}
          </tbody>
        </table></div>
        <div className="table-foot"><span>Showing {filtered.length ? (Math.min(page, pages) - 1) * pageSize + 1 : 0}–{Math.min(Math.min(page, pages) * pageSize, filtered.length)} of {filtered.length} records <span className="muted">(total {teachers.length})</span></span>
          <div className="pagination"><label className="helper">Rows</label><select className="select page-select" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select>
            <button className="btn small" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>←</button><span>Page {Math.min(page, pages)} of {pages}</span><button className="btn small" disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))}>→</button>
          </div>
        </div>
      </section>
      <p className="helper">Changes are local to this prototype and reset when the page reloads. Do not enter real personal or confidential information.</p>
    </main>

    {(mode === "add" || mode === "edit") && record && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setMode(null); }}>
      <section className="modal wide"><div className="modal-head"><div><h2>{mode === "add" ? "Add Teacher Row" : "Edit Teacher Record"}</h2><p>Enter the record details. Fields marked * are required.</p></div><button className="modal-close" onClick={() => setMode(null)}>✕</button></div>
        <form onSubmit={saveRecord}><div className="modal-body"><div className="form-grid">{columns.map(c => <div className="field" key={c.key}><label htmlFor={`field-${c.key}`}>{c.label}{c.required && c.key !== "id" && <span className="required"> *</span>}</label>
          {c.key === "id" ? <><input id={`field-${c.key}`} value={record[c.key]} disabled /><span className="hint">System-generated ID</span></> : c.type === "dropdown" ? <select id={`field-${c.key}`} required={Boolean(c.required)} value={record[c.key] || ""} onChange={e => setRecord({ ...record, [c.key]: e.target.value })}><option value="">Select {c.label.toLowerCase()}</option>{(c.options || []).map(o => <option key={o} value={o}>{o}</option>)}</select> : <input id={`field-${c.key}`} type={c.type === "number" ? "number" : c.type === "date" ? "date" : "text"} required={Boolean(c.required)} value={record[c.key] || ""} onChange={e => setRecord({ ...record, [c.key]: e.target.value })} />}</div>)}</div><p className="helper modal-note">Fictional demonstration data only.</p></div>
          <div className="modal-foot"><button type="button" className="btn" onClick={() => setMode(null)}>Cancel</button><button type="submit" className="btn primary">Save Record</button></div>
        </form>
      </section>
    </div>}

    {mode === "view" && record && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setMode(null); }}><section className="modal wide"><div className="modal-head"><div><h2>{record.first} {record.middle} {record.last}</h2><p>{record.id} · Teacher profile · {record.status}</p></div><button className="modal-close" onClick={() => setMode(null)}>✕</button></div><div className="modal-body"><div className="detail-grid">{columns.map(c => <div className="detail-item" key={c.key}><label>{c.label}</label><strong>{record[c.key] || "—"}</strong></div>)}</div></div><div className="modal-foot"><button className="btn" onClick={() => setMode(null)}>Close</button><button className="btn primary" onClick={() => startEdit(record)}>✎ Edit record</button></div></section></div>}

    {columnModal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setColumnModal(false); }}><section className="modal"><div className="modal-head"><div><h2>Add Custom Column</h2><p>Create a column for teacher records.</p></div><button className="modal-close" onClick={() => setColumnModal(false)}>✕</button></div><div className="modal-body"><div className="form-grid">
      <div className="field full"><label>Column Name *</label><input value={columnName} maxLength={60} placeholder="e.g. Date Hired" onChange={e => setColumnName(e.target.value)} /></div>
      <div className="field"><label>Data Type</label><select value={columnType} onChange={e => setColumnType(e.target.value as Column["type"])}><option value="text">Text</option><option value="number">Number</option><option value="date">Date</option><option value="dropdown">Dropdown</option><option value="checkbox">Checkbox</option></select></div>
      <div className="field"><label className="checkline"><input type="checkbox" checked={columnRequired} onChange={e => setColumnRequired(e.target.checked)} /> Required field</label></div>
      {columnType === "dropdown" && <div className="field full"><label>Dropdown Options *</label><input value={columnOptions} placeholder="Separate options with commas" onChange={e => setColumnOptions(e.target.value)} /></div>}
    </div></div><div className="modal-foot"><button className="btn" onClick={() => setColumnModal(false)}>Cancel</button><button className="btn primary" onClick={createColumn}>Create Column</button></div></section></div>}

    {removeModal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setRemoveModal(false); }}><section className="modal"><div className="modal-head"><div><h2>Remove Custom Column</h2><p>Select a custom column to remove from teacher records.</p></div><button className="modal-close" onClick={() => setRemoveModal(false)}>✕</button></div><div className="modal-body">{customColumns.length ? <div className="column-remove-list">{customColumns.map(c => <div className="column-remove-item" key={c.key}><div><strong>{c.label}</strong><div className="hint">{c.type}{c.required ? " · Required" : ""}</div></div><button className="btn danger small" onClick={() => removeColumn(c)}>Remove</button></div>)}</div> : <div className="empty"><strong>No custom columns</strong><span>Built-in columns cannot be removed.</span></div>}</div><div className="modal-foot"><button className="btn" onClick={() => setRemoveModal(false)}>Close</button></div></section></div>}

    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}

function Stat({ label, value, foot, icon, color = "" }: { label: string; value: number; foot: string; icon: string; color?: string }) {
  return <div className="stat-card"><div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot">{foot}</div></div><div className={`stat-icon ${color}`}>{icon}</div></div>;
}
