import { useMemo, useState } from "react";
import "./dashboard.css";

type Status = "Active" | "For Review" | "Inactive";
type School = {
  id: string; name: string; level: string; region: string; division: string;
  district: string; city: string; barangay: string; type: string;
  enrollment: number; teachers: number; status: Status;
};
type Teacher = {
  id: string; first: string; last: string; middle: string; sex: string;
  position: string; subject: string; school: string; status: Status;
};

const initialSchools: School[] = [
  {
    "id": "SDO-0001",
    "name": "Mabini Central Elementary School",
    "level": "Elementary",
    "region": "Region VII - Central Visayas",
    "division": "Cebu City Division",
    "district": "Central District",
    "city": "Cebu City",
    "barangay": "Mabini",
    "type": "Public",
    "enrollment": 620,
    "teachers": 28,
    "status": "Active"
  },
  {
    "id": "SDO-0002",
    "name": "Riverside National High School",
    "level": "Junior High School",
    "region": "Region VII - Central Visayas",
    "division": "Mandaue City Division",
    "district": "North District",
    "city": "Mandaue City",
    "barangay": "Subangdaku",
    "type": "Public",
    "enrollment": 840,
    "teachers": 42,
    "status": "Active"
  },
  {
    "id": "SDO-0003",
    "name": "San Isidro Integrated School",
    "level": "Integrated",
    "region": "Region VII - Central Visayas",
    "division": "Talisay City Division",
    "district": "East District",
    "city": "Talisay City",
    "barangay": "San Isidro",
    "type": "Public",
    "enrollment": 1050,
    "teachers": 51,
    "status": "Active"
  },
  {
    "id": "SDO-0004",
    "name": "Mountain View Elementary School",
    "level": "Elementary",
    "region": "Region VII - Central Visayas",
    "division": "Toledo City Division",
    "district": "West District",
    "city": "Toledo City",
    "barangay": "Bato",
    "type": "Public",
    "enrollment": 410,
    "teachers": 19,
    "status": "For Review"
  },
  {
    "id": "SDO-0005",
    "name": "Cebu Coastal Senior High School",
    "level": "Senior High School",
    "region": "Region VII - Central Visayas",
    "division": "Cebu City Division",
    "district": "South District",
    "city": "Cebu City",
    "barangay": "Poblacion",
    "type": "Public",
    "enrollment": 720,
    "teachers": 34,
    "status": "Active"
  },
  {
    "id": "SDO-0006",
    "name": "Greenfields Elementary School",
    "level": "Elementary",
    "region": "Region VII - Central Visayas",
    "division": "Lapu-Lapu City Division",
    "district": "Mactan District",
    "city": "Lapu-Lapu City",
    "barangay": "Pusok",
    "type": "Public",
    "enrollment": 530,
    "teachers": 24,
    "status": "Active"
  },
  {
    "id": "SDO-0007",
    "name": "Northview Integrated School",
    "level": "Integrated",
    "region": "Region VII - Central Visayas",
    "division": "Consolacion Division",
    "district": "North District",
    "city": "Consolacion",
    "barangay": "Poblacion Occidental",
    "type": "Public",
    "enrollment": 960,
    "teachers": 45,
    "status": "Active"
  },
  {
    "id": "SDO-0008",
    "name": "Baybay National High School",
    "level": "Junior High School",
    "region": "Region VII - Central Visayas",
    "division": "Danao City Division",
    "district": "Coastal District",
    "city": "Danao City",
    "barangay": "Baybay",
    "type": "Public",
    "enrollment": 680,
    "teachers": 32,
    "status": "For Review"
  },
  {
    "id": "SDO-0009",
    "name": "Bright Path Learning Center",
    "level": "Elementary",
    "region": "Region VII - Central Visayas",
    "division": "Cebu City Division",
    "district": "Central District",
    "city": "Cebu City",
    "barangay": "Lahug",
    "type": "Private",
    "enrollment": 290,
    "teachers": 16,
    "status": "Active"
  },
  {
    "id": "SDO-0010",
    "name": "Pinecrest Senior High School",
    "level": "Senior High School",
    "region": "Region VII - Central Visayas",
    "division": "Naga City Division",
    "district": "South District",
    "city": "Naga City",
    "barangay": "Inayagan",
    "type": "Public",
    "enrollment": 570,
    "teachers": 27,
    "status": "Active"
  },
  {
    "id": "SDO-0011",
    "name": "Lakeside Elementary School",
    "level": "Elementary",
    "region": "Region VII - Central Visayas",
    "division": "Talisay City Division",
    "district": "West District",
    "city": "Talisay City",
    "barangay": "Linao",
    "type": "Public",
    "enrollment": 380,
    "teachers": 18,
    "status": "Inactive"
  },
  {
    "id": "SDO-0012",
    "name": "Horizon Integrated School",
    "level": "Integrated",
    "region": "Region VII - Central Visayas",
    "division": "Mandaue City Division",
    "district": "East District",
    "city": "Mandaue City",
    "barangay": "Basak",
    "type": "Public",
    "enrollment": 910,
    "teachers": 43,
    "status": "Active"
  }
];
const initialTeachers: Teacher[] = [
  {
    "first": "Maria",
    "last": "Santos",
    "middle": "L.",
    "sex": "Female",
    "position": "Teacher I",
    "subject": "English",
    "school": "Mabini Central Elementary School",
    "status": "Active",
    "id": "TCH-DEMO-001"
  },
  {
    "first": "Juan",
    "last": "Reyes",
    "middle": "M.",
    "sex": "Male",
    "position": "Teacher II",
    "subject": "Mathematics",
    "school": "Riverside National High School",
    "status": "Active",
    "id": "TCH-DEMO-002"
  },
  {
    "first": "Ana",
    "last": "Cruz",
    "middle": "P.",
    "sex": "Female",
    "position": "Teacher III",
    "subject": "Science",
    "school": "San Isidro Integrated School",
    "status": "Active",
    "id": "TCH-DEMO-003"
  },
  {
    "first": "Pedro",
    "last": "Garcia",
    "middle": "R.",
    "sex": "Male",
    "position": "Teacher I",
    "subject": "Filipino",
    "school": "Mountain View Elementary School",
    "status": "For Review",
    "id": "TCH-DEMO-004"
  },
  {
    "first": "Liza",
    "last": "Dela Rosa",
    "middle": "C.",
    "sex": "Female",
    "position": "Master Teacher I",
    "subject": "English",
    "school": "Cebu Coastal Senior High School",
    "status": "Active",
    "id": "TCH-DEMO-005"
  },
  {
    "first": "Marco",
    "last": "Villanueva",
    "middle": "A.",
    "sex": "Male",
    "position": "Teacher II",
    "subject": "Araling Panlipunan",
    "school": "Greenfields Elementary School",
    "status": "Active",
    "id": "TCH-DEMO-006"
  },
  {
    "first": "Grace",
    "last": "Mendoza",
    "middle": "T.",
    "sex": "Female",
    "position": "Teacher III",
    "subject": "Mathematics",
    "school": "Northview Integrated School",
    "status": "Active",
    "id": "TCH-DEMO-007"
  },
  {
    "first": "Jose",
    "last": "Bautista",
    "middle": "N.",
    "sex": "Male",
    "position": "Teacher I",
    "subject": "MAPEH",
    "school": "Baybay National High School",
    "status": "Active",
    "id": "TCH-DEMO-008"
  },
  {
    "first": "Elena",
    "last": "Torres",
    "middle": "S.",
    "sex": "Female",
    "position": "Teacher II",
    "subject": "Science",
    "school": "Bright Path Learning Center",
    "status": "Inactive",
    "id": "TCH-DEMO-009"
  },
  {
    "first": "Ramon",
    "last": "Flores",
    "middle": "D.",
    "sex": "Male",
    "position": "Teacher III",
    "subject": "TLE",
    "school": "Pinecrest Senior High School",
    "status": "Active",
    "id": "TCH-DEMO-010"
  },
  {
    "first": "Carmen",
    "last": "Aquino",
    "middle": "V.",
    "sex": "Female",
    "position": "Teacher I",
    "subject": "Filipino",
    "school": "Lakeside Elementary School",
    "status": "Active",
    "id": "TCH-DEMO-011"
  },
  {
    "first": "Daniel",
    "last": "Castillo",
    "middle": "J.",
    "sex": "Male",
    "position": "Master Teacher II",
    "subject": "English",
    "school": "Horizon Integrated School",
    "status": "Active",
    "id": "TCH-DEMO-012"
  },
  {
    "first": "Sofia",
    "last": "Navarro",
    "middle": "E.",
    "sex": "Female",
    "position": "Teacher II",
    "subject": "Mathematics",
    "school": "Mabini Central Elementary School",
    "status": "Active",
    "id": "TCH-DEMO-013"
  },
  {
    "first": "Miguel",
    "last": "Ramos",
    "middle": "B.",
    "sex": "Male",
    "position": "Teacher I",
    "subject": "Science",
    "school": "Riverside National High School",
    "status": "For Review",
    "id": "TCH-DEMO-014"
  },
  {
    "first": "Patricia",
    "last": "Lim",
    "middle": "F.",
    "sex": "Female",
    "position": "Teacher III",
    "subject": "Filipino",
    "school": "San Isidro Integrated School",
    "status": "Active",
    "id": "TCH-DEMO-015"
  },
  {
    "first": "Andres",
    "last": "Diaz",
    "middle": "G.",
    "sex": "Male",
    "position": "Teacher II",
    "subject": "Araling Panlipunan",
    "school": "Mountain View Elementary School",
    "status": "Active",
    "id": "TCH-DEMO-016"
  },
  {
    "first": "Bea",
    "last": "Fernandez",
    "middle": "I.",
    "sex": "Female",
    "position": "Teacher I",
    "subject": "English",
    "school": "Cebu Coastal Senior High School",
    "status": "Active",
    "id": "TCH-DEMO-017"
  },
  {
    "first": "Carlo",
    "last": "Gonzales",
    "middle": "O.",
    "sex": "Male",
    "position": "Teacher III",
    "subject": "MAPEH",
    "school": "Greenfields Elementary School",
    "status": "Active",
    "id": "TCH-DEMO-018"
  },
  {
    "first": "Nina",
    "last": "Pascual",
    "middle": "Q.",
    "sex": "Female",
    "position": "Teacher II",
    "subject": "Science",
    "school": "Northview Integrated School",
    "status": "Active",
    "id": "TCH-DEMO-019"
  },
  {
    "first": "Luis",
    "last": "Morales",
    "middle": "U.",
    "sex": "Male",
    "position": "Teacher I",
    "subject": "Mathematics",
    "school": "Baybay National High School",
    "status": "Active",
    "id": "TCH-DEMO-020"
  },
  {
    "first": "Irene",
    "last": "Salazar",
    "middle": "W.",
    "sex": "Female",
    "position": "Teacher II",
    "subject": "TLE",
    "school": "Bright Path Learning Center",
    "status": "Active",
    "id": "TCH-DEMO-021"
  },
  {
    "first": "Noel",
    "last": "Soriano",
    "middle": "Y.",
    "sex": "Male",
    "position": "Teacher I",
    "subject": "Filipino",
    "school": "Pinecrest Senior High School",
    "status": "Active",
    "id": "TCH-DEMO-022"
  }
];

type TableType = "schools" | "teachers";

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const escapeCsv = (value: unknown) => {
    const text = String(value ?? "");
    return /[",\\r\\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [keys.map(escapeCsv).join(","), ...rows.map(row => keys.map(key => escapeCsv(row[key])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function StatusPill({ status }: { status: Status }) {
  const cls = status === "Active" ? "active" : status === "For Review" ? "review" : "inactive";
  return <span className={`status-pill ${cls}`}>{status}</span>;
}

function StatCard({ label, value, note, icon, tone = "" }: {
  label: string; value: number; note: string; icon: string; tone?: string;
}) {
  return <article className="dashboard-stat">
    <div><div className="stat-label">{label}</div><div className="stat-value">{value.toLocaleString()}</div><div className="stat-note">{note}</div></div>
    <div className={`stat-icon ${tone}`} aria-hidden="true">{icon}</div>
  </article>;
}

export default function Dashboard() {
  const [schools] = useState<School[]>(initialSchools);
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [showSchools, setShowSchools] = useState(true);
  const [showTeachers, setShowTeachers] = useState(true);
  const [schoolDraft, setSchoolDraft] = useState("");
  const [teacherDraft, setTeacherDraft] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  const activeSchools = schools.filter(row => row.status === "Active").length;
  const activeTeachers = teachers.filter(row => row.status === "Active").length;
  const filteredSchools = useMemo(() => {
    const query = schoolSearch.trim().toLowerCase();
    return schools.filter(row => !query || Object.values(row).some(value => String(value).toLowerCase().includes(query)));
  }, [schools, schoolSearch]);
  const filteredTeachers = useMemo(() => {
    const query = teacherSearch.trim().toLowerCase();
    return teachers.filter(row => !query || Object.values(row).some(value => String(value).toLowerCase().includes(query)));
  }, [teachers, teacherSearch]);

  const applySearch = (type: TableType) => {
    if (type === "schools") setSchoolSearch(schoolDraft);
    else setTeacherSearch(teacherDraft);
  };

  return <div className="dashboard-page">
    <div className="dashboard-heading">
      <div><div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
        <h1>Dashboard</h1>
        <p>View school and teacher data in one place.</p>
      </div>
      <div className="dashboard-actions">
        <button className="btn" onClick={() => downloadCsv("schools-data-demo.csv", schools as unknown as Record<string, unknown>[])}>↓ Export Schools</button>
        <button className="btn" onClick={() => downloadCsv("teachers-data-demo.csv", teachers as unknown as Record<string, unknown>[])}>↓ Export Teachers</button>
      </div>
    </div>

    <section className="dashboard-stats" aria-label="Overview statistics">
      <StatCard label="Total Schools" value={schools.length} note="School records in prototype" icon="⌂" />
      <StatCard label="Total Teachers" value={teachers.length} note="Teacher records in prototype" icon="♙" />
      <StatCard label="Active Schools" value={activeSchools} note={`${schools.length - activeSchools} need review or are inactive`} icon="✓" tone="green" />
      <StatCard label="Active Teachers" value={activeTeachers} note={`${teachers.length - activeTeachers} need review or are inactive`} icon="◎" tone="amber" />
    </section>

    <section className="dashboard-panel table-selection">
      <div className="panel-heading"><div><h2>Data Tables</h2><p>Choose which datasets to display on your dashboard.</p></div>
        <button className="btn btn-small" onClick={() => { setShowSchools(true); setShowTeachers(true); }}>Show Both Tables</button>
      </div>
      <div className="table-selection-options">
        <strong>Choose Tables to Display</strong>
        <label><input type="checkbox" checked={showSchools} onChange={event => setShowSchools(event.target.checked)} /> Schools Table</label>
        <label><input type="checkbox" checked={showTeachers} onChange={event => setShowTeachers(event.target.checked)} /> Teachers Table</label>
      </div>
    </section>

    {showSchools && <section className="dashboard-panel data-panel">
      <div className="panel-heading table-panel-heading">
        <div className="table-title"><span className="table-dot" /><div><h2>Schools Data</h2><p>{filteredSchools.length} records available</p></div></div>
        <div className="table-tools">
          <form className="dashboard-search" onSubmit={event => { event.preventDefault(); applySearch("schools"); }}>
            <span aria-hidden="true">⌕</span><input value={schoolDraft} onChange={event => setSchoolDraft(event.target.value)} placeholder="Search schools..." aria-label="Search schools" />
            <button className="btn btn-small" type="submit">Search</button>
          </form>
          <button className="btn btn-small" onClick={() => downloadCsv("schools-data-demo.csv", filteredSchools as unknown as Record<string, unknown>[])}>Export</button>
        </div>
      </div>
      <div className="table-scroll"><table><thead><tr><th>School ID</th><th>School Name</th><th>School Level</th><th>District</th><th>Municipality/City</th><th>Enrollment</th><th>Status</th></tr></thead>
        <tbody>{filteredSchools.slice(0, 5).map(row => <tr key={row.id}><td className="id-cell">{row.id}</td><td className="school-name">{row.name}</td><td>{row.level}</td><td>{row.district}</td><td>{row.city}</td><td>{row.enrollment.toLocaleString()}</td><td><StatusPill status={row.status} /></td></tr>)}</tbody>
      </table>{filteredSchools.length === 0 && <div className="empty-state">No matching school records found.</div>}</div>
      <div className="table-footer"><span>Showing {Math.min(filteredSchools.length, 5)} of {filteredSchools.length} records</span><span className="sample-note">Sample data</span></div>
    </section>}

    {showTeachers && <section className="dashboard-panel data-panel">
      <div className="panel-heading table-panel-heading">
        <div className="table-title"><span className="table-dot green-dot" /><div><h2>Teachers Data</h2><p>{filteredTeachers.length} records available</p></div></div>
        <div className="table-tools">
          <form className="dashboard-search" onSubmit={event => { event.preventDefault(); applySearch("teachers"); }}>
            <span aria-hidden="true">⌕</span><input value={teacherDraft} onChange={event => setTeacherDraft(event.target.value)} placeholder="Search teachers..." aria-label="Search teachers" />
            <button className="btn btn-small" type="submit">Search</button>
          </form>
          <button className="btn btn-small" onClick={() => downloadCsv("teachers-data-demo.csv", filteredTeachers as unknown as Record<string, unknown>[])}>Export</button>
        </div>
      </div>
      <div className="table-scroll"><table><thead><tr><th>Teacher ID</th><th>Teacher Name</th><th>Position</th><th>Subject Specialization</th><th>School Assignment</th><th>Status</th></tr></thead>
        <tbody>{filteredTeachers.slice(0, 5).map(row => <tr key={row.id}><td className="id-cell">{row.id}</td><td className="school-name">{row.first} {row.middle} {row.last}</td><td>{row.position}</td><td>{row.subject}</td><td>{row.school}</td><td><StatusPill status={row.status} /></td></tr>)}</tbody>
      </table>{filteredTeachers.length === 0 && <div className="empty-state">No matching teacher records found.</div>}</div>
      <div className="table-footer"><span>Showing {Math.min(filteredTeachers.length, 5)} of {filteredTeachers.length} records</span><span className="sample-note">Sample data</span></div>
    </section>}

    {!showSchools && !showTeachers && <section className="dashboard-panel empty-state"><strong>No tables selected</strong><p>Select a table above to display dashboard data.</p><button className="btn btn-primary" onClick={() => {setShowSchools(true); setShowTeachers(true);}}>Show Both Tables</button></section>}
    <p className="prototype-disclaimer">Prototype note: sample records are fictional. Changes are not saved to a database.</p>
  </div>;
}
