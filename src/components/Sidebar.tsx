import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="dms-sidebar">
      <div className="dms-sidebar__brand">
        <div className="dms-sidebar__brand-mark" aria-hidden="true">DMS</div>
        <div className="dms-sidebar__brand-copy">
          <strong>DepEd Data<br />Management System</strong>
          <small>Education records portal</small>
        </div>
      </div>

      <div className="dms-sidebar__nav-label">Workspace</div>
      <nav className="dms-sidebar__nav" aria-label="Main navigation">
        <NavLink to="/dashboard" end className={({ isActive }) =>
          `dms-sidebar__nav-link${isActive ? " is-active" : ""}`}>
          <span className="dms-sidebar__nav-icon" aria-hidden="true">▦</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/teachers" className={({ isActive }) =>
          `dms-sidebar__nav-link${isActive ? " is-active" : ""}`}>
          <span className="dms-sidebar__nav-icon" aria-hidden="true">♙</span>
          <span>Teachers</span>
        </NavLink>

        <NavLink to="/schools" className={({ isActive }) =>
          `dms-sidebar__nav-link${isActive ? " is-active" : ""}`}>
          <span className="dms-sidebar__nav-icon" aria-hidden="true">⌂</span>
          <span>Schools</span>
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) =>
          `dms-sidebar__nav-link${isActive ? " is-active" : ""}`}>
          <span className="dms-sidebar__nav-icon" aria-hidden="true">▥</span>
          <span>Analytics &amp; Graphs</span>
        </NavLink>
      </nav>

      <div className="dms-sidebar__bottom">
        <div className="dms-sidebar__prototype-note">
          <strong><span aria-hidden="true">ⓘ</span> Demonstration prototype</strong>
          All records are fictional sample data stored in this browser session.
          This is not an official DepEd service.
        </div>
        <div className="dms-sidebar__user-card">
          <div className="dms-sidebar__avatar" aria-hidden="true">AD</div>
          <div className="dms-sidebar__user-copy">
            <strong>Demo Administrator</strong>
            <small>Prototype access</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
