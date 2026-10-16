import { useMemo, useState } from "react";
import "./Analytics.css";
import Sidebar from "../components/Sidebar";

type School = {
  id: string; name: string; level: string; enrollment: number; teachers: number; status: string;
};
type Teacher = {
  id: string; first: string; last: string; subject: string; school: string; status: string;
};

const initialSchools: School[] = [
  { id: "SDO-0001", name: "Mabini Central Elementary School", level: "Elementary", enrollment: 620, teachers: 28, status: "Active" },
  { id: "SDO-0002", name: "Riverside National High School", level: "Junior High School", enrollment: 840, teachers: 42, status: "Active" },
  { id: "SDO-0003", name: "San Isidro Integrated School", level: "Integrated", enrollment: 1050, teachers: 51, status: "Active" },
  { id: "SDO-0004", name: "Mountain View Elementary School", level: "Elementary", enrollment: 410, teachers: 19, status: "For Review" },
  { id: "SDO-0005", name: "Cebu Coastal Senior High School", level: "Senior High School", enrollment: 720, teachers: 34, status: "Active" },
  { id: "SDO-0006", name: "Greenfields Elementary School", level: "Elementary", enrollment: 530, teachers: 24, status: "Active" },
  { id: "SDO-0007", name: "Northview Integrated School", level: "Integrated", enrollment: 960, teachers: 45, status: "Active" },
  { id: "SDO-0008", name: "Baybay National High School", level: "Junior High School", enrollment: 680, teachers: 32, status: "For Review" },
  { id: "SDO-0009", name: "Bright Path Learning Center", level: "Elementary", enrollment: 290, teachers: 16, status: "Active" },
  { id: "SDO-0010", name: "Pinecrest Senior High School", level: "Senior High School", enrollment: 570, teachers: 27, status: "Active" },
  { id: "SDO-0011", name: "Lakeside Elementary School", level: "Elementary", enrollment: 380, teachers: 18, status: "Inactive" },
  { id: "SDO-0012", name: "Horizon Integrated School", level: "Integrated", enrollment: 910, teachers: 43, status: "Active" },
];

const initialTeachers: Teacher[] = [
  { id: "TCH-001", first: "Maria", last: "Santos", subject: "English", school: "Mabini Central Elementary School", status: "Active" },
  { id: "TCH-002", first: "Juan", last: "Reyes", subject: "Mathematics", school: "Riverside National High School", status: "Active" },
  { id: "TCH-003", first: "Ana", last: "Cruz", subject: "Science", school: "San Isidro Integrated School", status: "Active" },
  { id: "TCH-004", first: "Pedro", last: "Garcia", subject: "Filipino", school: "Mountain View Elementary School", status: "For Review" },
  { id: "TCH-005", first: "Liza", last: "Dela Rosa", subject: "English", school: "Cebu Coastal Senior High School", status: "Active" },
  { id: "TCH-006", first: "Marco", last: "Villanueva", subject: "Araling Panlipunan", school: "Greenfields Elementary School", status: "Active" },
  { id: "TCH-007", first: "Grace", last: "Mendoza", subject: "Mathematics", school: "Northview Integrated School", status: "Active" },
  { id: "TCH-008", first: "Jose", last: "Bautista", subject: "MAPEH", school: "Baybay National High School", status: "Active" },
  { id: "TCH-009", first: "Elena", last: "Torres", subject: "Science", school: "Bright Path Learning Center", status: "Inactive" },
  { id: "TCH-010", first: "Ramon", last: "Flores", subject: "TLE", school: "Pinecrest Senior High School", status: "Active" },
  { id: "TCH-011", first: "Carmen", last: "Aquino", subject: "Filipino", school: "Lakeside Elementary School", status: "Active" },
  { id: "TCH-012", first: "Daniel", last: "Castillo", subject: "English", school: "Horizon Integrated School", status: "Active" },
  { id: "TCH-013", first: "Sofia", last: "Navarro", subject: "Mathematics", school: "Mabini Central Elementary School", status: "Active" },
  { id: "TCH-014", first: "Miguel", last: "Ramos", subject: "Science", school: "Riverside National High School", status: "For Review" },
  { id: "TCH-015", first: "Patricia", last: "Lim", subject: "Filipino", school: "San Isidro Integrated School", status: "Active" },
  { id: "TCH-016", first: "Andres", last: "Diaz", subject: "Araling Panlipunan", school: "Mountain View Elementary School", status: "Active" },
  { id: "TCH-017", first: "Bea", last: "Fernandez", subject: "English", school: "Cebu Coastal Senior High School", status: "Active" },
  { id: "TCH-018", first: "Carlo", last: "Gonzales", subject: "MAPEH", school: "Greenfields Elementary School", status: "Active" },
  { id: "TCH-019", first: "Nina", last: "Pascual", subject: "Science", school: "Northview Integrated School", status: "Active" },
  { id: "TCH-020", first: "Luis", last: "Morales", subject: "Mathematics", school: "Baybay National High School", status: "Active" },
  { id: "TCH-021", first: "Irene", last: "Salazar", subject: "TLE", school: "Bright Path Learning Center", status: "Active" },
  { id: "TCH-022", first: "Noel", last: "Soriano", subject: "Filipino", school: "Pinecrest Senior High School", status: "Active" },
];

type BarItem = { label: string; value: number; tone?: string };

function BarChart({ items, totalLabel }: { items: BarItem[]; totalLabel?: string }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <div className="analytics-chart-body">
      {items.length ? items.map((item) => (
        <div className="analytics-bar-row" key={item.label}>
          <div className="analytics-bar-label"><span>{item.label}</span><strong>{item.value.toLocaleString()}</strong></div>
          <div className="analytics-bar-track">
            <div className={`analytics-bar-fill ${item.tone ?? ""}`} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      )) : <p className="analytics-empty">No data available.</p>}
      {totalLabel && <small className="analytics-chart-note">{totalLabel}</small>}
    </div>
  );
}

function StatCard({ label, value, foot, icon, tone = "" }: { label: string; value: number; foot: string; icon: string; tone?: string }) {
  return (
    <article className="analytics-stat-card">
      <div><div className="analytics-stat-label">{label}</div><div className="analytics-stat-value">{value.toLocaleString()}</div><div className="analytics-stat-foot">{foot}</div></div>
      <div className={`analytics-stat-icon ${tone}`}>{icon}</div>
    </article>
  );
}

function ChartPanel({ title, description, icon, children, wide = false }: { title: string; description: string; icon: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section className={`analytics-panel analytics-chart-panel ${wide ? "analytics-chart-wide" : ""}`}>
      <div className="analytics-panel-head"><div><h2>{title}</h2><p>{description}</p></div><span className="analytics-chart-mark">{icon}</span></div>
      {children}
    </section>
  );
}

export default function Analytics() {
  const [schools] = useState(initialSchools);
  const [teachers] = useState(initialTeachers);
  const [refreshKey, setRefreshKey] = useState(0);

  const metrics = useMemo(() => {
    const countStatus = <T extends { status: string }>(rows: T[], status: string) => rows.filter((row) => row.status === status).length;
    const statusOrder = ["Active", "For Review", "Inactive"];
    const schoolStatus = statusOrder.map((status) => ({ label: status, value: countStatus(schools, status), tone: status === "Active" ? "green" : status === "For Review" ? "amber" : "red" }));
    const teacherStatus = statusOrder.map((status) => ({ label: status, value: countStatus(teachers, status), tone: status === "Active" ? "green" : status === "For Review" ? "amber" : "red" }));
    const levels = [...new Set(schools.map((school) => school.level || "Unspecified"))].sort().map((level) => ({ label: level, value: schools.filter((school) => (school.level || "Unspecified") === level).length }));
    const topEnrollment = [...schools].sort((a, b) => b.enrollment - a.enrollment).slice(0, 6).map((school) => ({ label: school.name, value: school.enrollment }));
    const subjects = [...new Set(teachers.map((teacher) => teacher.subject || "Unspecified"))].map((subject) => ({ label: subject, value: teachers.filter((teacher) => (teacher.subject || "Unspecified") === subject).length })).sort((a, b) => b.value - a.value).slice(0, 7);
    return {
      activeSchools: countStatus(schools, "Active"), activeTeachers: countStatus(teachers, "Active"),
      schoolStatus, teacherStatus, levels, topEnrollment, subjects,
    };
  }, [schools, teachers, refreshKey]);

  return (
    <div className="analytics-page">
      <header className="analytics-topbar">
        <div className="analytics-crumb">Workspace <span>/</span> <strong>Analytics &amp; Graphs</strong></div>
        <div className="analytics-top-right"><span className="analytics-sample-pill">● SAMPLE DATA</span><span className="analytics-profile-icon" aria-label="Profile">◉</span></div>
      </header>
      <main className="analytics-content">
        <div className="analytics-page-heading">
          <div><h1>Analytics &amp; Graphs</h1><p>Explore summaries and visual trends from the current school and teacher records.</p></div>
          <button className="analytics-btn" onClick={() => setRefreshKey((value) => value + 1)}>↻ Refresh Analytics</button>
        </div>
        <div className="analytics-stats">
          <StatCard label="Total Schools" value={schools.length} foot="School records" icon="⌂" />
          <StatCard label="Total Teachers" value={teachers.length} foot="Teacher records" icon="♙" />
          <StatCard label="Active Schools" value={metrics.activeSchools} foot={`${schools.length - metrics.activeSchools} for review or inactive`} icon="✓" tone="green" />
          <StatCard label="Active Teachers" value={metrics.activeTeachers} foot={`${teachers.length - metrics.activeTeachers} for review or inactive`} icon="◎" tone="amber" />
        </div>
        <div className="analytics-grid">
          <ChartPanel title="School Status" description="Count of schools by current status" icon="▥"><BarChart items={metrics.schoolStatus} /></ChartPanel>
          <ChartPanel title="Teacher Employment Status" description="Count of teachers by employment status" icon="♙"><BarChart items={metrics.teacherStatus} /></ChartPanel>
          <ChartPanel title="Schools by Level" description="Distribution of school types/levels" icon="⌂"><BarChart items={metrics.levels} /></ChartPanel>
          <ChartPanel title="Teachers by Subject" description="Most represented subject specializations" icon="▤"><BarChart items={metrics.subjects} /></ChartPanel>
          <ChartPanel title="Enrollment by School" description="Top 6 schools by recorded enrollment" icon="↗" wide><BarChart items={metrics.topEnrollment} /></ChartPanel>
        </div>
        <p className="analytics-helper">Analytics are calculated from the current prototype records. This page uses fictional sample data and is not connected to an external database.</p>
      </main>
    </div>
  );
}
