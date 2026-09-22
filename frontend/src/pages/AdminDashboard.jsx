import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Building2,
  Phone,
  Mail,
  Smartphone,
  Laptop,
  Globe,
  Filter,
  LogOut,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import {
  getStoredUsers,
  approveUser,
  rejectUser,
  getStoredAccessLogs,
  recordAccessLog,
} from "../lib/adminStore";
import { vilvaProjects } from "../data/vilvaProjects";
import { sbInfraVentures } from "../data/sbInfraProjects";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("approvals"); // "approvals" | "audit" | "content"
  const [userFilter, setUserFilter] = useState("pending"); // "all" | "pending" | "approved" | "rejected" | "developer"
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedUsers = getStoredUsers();
    const loadedLogs = getStoredAccessLogs();
    setUsers(loadedUsers);
    setAccessLogs(loadedLogs);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  // Approval actions
  const handleApprove = (userId) => {
    try {
      const updated = approveUser(userId, user?.name || "Xevoproptech Admin");
      loadData();
      showNotification(`✅ Approved access for ${updated.name} (${updated.role}). They can now log in and upload assets!`);
    } catch (err) {
      alert("Error approving user: " + err.message);
    }
  };

  const handleReject = (userId) => {
    const reason = window.prompt("Reason for rejection / suspension:", "Document or business verification incomplete");
    if (reason === null) return;

    try {
      const updated = rejectUser(userId, reason, user?.name || "Xevoproptech Admin");
      loadData();
      showNotification(`❌ Rejected access for ${updated.name}.`);
    } catch (err) {
      alert("Error rejecting user: " + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Stats calculation
  const pendingCount = users.filter((u) => u.status === "pending").length;
  const approvedCount = users.filter((u) => u.status === "approved").length;
  const developerCount = users.filter((u) => u.role === "Developer" || u.role === "Builder").length;
  const totalLogsCount = accessLogs.length;

  // Filtered users
  const filteredUsers = users.filter((u) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.company?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (userFilter === "pending") return u.status === "pending";
    if (userFilter === "approved") return u.status === "approved";
    if (userFilter === "rejected") return u.status === "rejected";
    if (userFilter === "developer") return u.role === "Developer" || u.role === "Builder";
    return true;
  });

  return (
    <div className="admin-page">
      {/* ADMIN HEADER */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand-col">
            <div className="admin-badge">
              <ShieldCheck size={14} />
              MASTER ADMIN CONTROL PANEL
            </div>
            <h1>
              Xevoprop <span>Governance & Approvals</span>
            </h1>
            <p>
              Manage builder & developer on-boarding, enforce verification approvals, and inspect real-time login audit trails.
            </p>
          </div>

          <div className="admin-user-col">
            <div className="admin-profile-pill">
              <div className="admin-avatar">
                <ShieldCheck size={18} color="#38bdf8" />
              </div>
              <div>
                <strong>{user?.name || "Xevoproptech Admin"}</strong>
                <span>admin.xevoproptech · Superuser</span>
              </div>
            </div>

            <button className="admin-logout-btn" onClick={handleLogout} title="Sign Out">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* FLASH NOTIFICATION */}
      {notification && (
        <div className="admin-flash-banner">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="admin-container">
        {/* KPI METRICS ROW */}
        <section className="admin-kpi-grid">
          <div className="admin-kpi-card pending-kpi">
            <div className="kpi-icon-wrap pending">
              <Clock size={22} />
            </div>
            <div>
              <span className="kpi-label">PENDING APPROVALS</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{pendingCount}</span>
                {pendingCount > 0 && <span className="kpi-tag alert">Action Required</span>}
              </div>
              <p className="kpi-sub">Accounts awaiting verification before login access</p>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-wrap approved">
              <UserCheck size={22} />
            </div>
            <div>
              <span className="kpi-label">APPROVED ACTIVE ACCOUNTS</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{approvedCount}</span>
                <span className="kpi-tag success">Verified</span>
              </div>
              <p className="kpi-sub">Permitted to publish projects, upload photos & brands</p>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-wrap dev">
              <Building2 size={22} />
            </div>
            <div>
              <span className="kpi-label">DEVELOPERS & BUILDERS</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{developerCount}</span>
                <span className="kpi-tag">SB Infra & Vilva</span>
              </div>
              <p className="kpi-sub">Authorized real estate development brands</p>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-wrap logs">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="kpi-label">LOGIN & ACCESS AUDIT LOGS</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{totalLogsCount}</span>
                <span className="kpi-tag info">Live Tracking</span>
              </div>
              <p className="kpi-sub">Recorded sign-ins, device fingerprints & blocked attempts</p>
            </div>
          </div>
        </section>

        {/* NAVIGATION TABS */}
        <div className="admin-tabs-row">
          <button
            className={`admin-tab-btn ${activeTab === "approvals" ? "active" : ""}`}
            onClick={() => setActiveTab("approvals")}
          >
            <Users size={16} />
            Account Approvals & Users
            {pendingCount > 0 && <span className="tab-counter-badge">{pendingCount}</span>}
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "audit" ? "active" : ""}`}
            onClick={() => setActiveTab("audit")}
          >
            <ShieldAlert size={16} />
            Login & Access Audit Logs
            <span className="tab-counter-badge neutral">{accessLogs.length}</span>
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            <FileCheck size={16} />
            Published Projects & Ventures
            <span className="tab-counter-badge neutral">{vilvaProjects.length + sbInfraVentures.length}</span>
          </button>
        </div>

        {/* TAB 1: ACCOUNT APPROVALS & USERS */}
        {activeTab === "approvals" && (
          <section className="admin-content-section">
            {/* TOOLBAR */}
            <div className="admin-section-toolbar">
              <div className="admin-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search user by name, email, phone, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="admin-filter-pills">
                <button
                  className={userFilter === "pending" ? "active" : ""}
                  onClick={() => setUserFilter("pending")}
                >
                  ⏳ Pending ({pendingCount})
                </button>
                <button
                  className={userFilter === "approved" ? "active" : ""}
                  onClick={() => setUserFilter("approved")}
                >
                  ✅ Approved ({approvedCount})
                </button>
                <button
                  className={userFilter === "developer" ? "active" : ""}
                  onClick={() => setUserFilter("developer")}
                >
                  🏢 Developers ({developerCount})
                </button>
                <button
                  className={userFilter === "all" ? "active" : ""}
                  onClick={() => setUserFilter("all")}
                >
                  All Users ({users.length})
                </button>
              </div>
            </div>

            {/* USERS LIST / TABLE */}
            {filteredUsers.length === 0 ? (
              <div className="admin-empty-box">
                <CheckCircle2 size={36} color="#16a34a" />
                <h3>No Accounts Found</h3>
                <p>There are no accounts matching the selected filter criteria.</p>
              </div>
            ) : (
              <div className="admin-users-table-wrap">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>User Profile & Brand</th>
                      <th>Role & Permissions</th>
                      <th>Contact Info</th>
                      <th>Registered On</th>
                      <th>Approval Status</th>
                      <th>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const isPending = u.status === "pending";
                      const isApproved = u.status === "approved";
                      const isRejected = u.status === "rejected";

                      return (
                        <tr key={u.id} className={isPending ? "row-pending" : ""}>
                          <td>
                            <div className="user-name-cell">
                              <img
                                src={
                                  u.avatar ||
                                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                    u.name
                                  )}`
                                }
                                alt={u.name}
                                className="user-table-avatar"
                              />
                              <div>
                                <strong className="user-cell-name">{u.name}</strong>
                                <span className="user-cell-company">{u.company || "Individual Account"}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className={`role-pill role-${String(u.role).toLowerCase()}`}>
                              {u.role}
                            </span>
                          </td>

                          <td>
                            <div className="contact-cell">
                              <span className="contact-line">
                                <Mail size={12} /> {u.email}
                              </span>
                              {u.phone && (
                                <span className="contact-line">
                                  <Phone size={12} /> +91 {u.phone.replace(/\D/g, "")}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <span className="date-cell">
                              {new Date(u.registeredAt || Date.now()).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </td>

                          <td>
                            {isPending && (
                              <span className="status-pill status-pending">
                                <Clock size={12} /> Awaiting Approval
                              </span>
                            )}
                            {isApproved && (
                              <span className="status-pill status-approved">
                                <CheckCircle2 size={12} /> Approved
                              </span>
                            )}
                            {isRejected && (
                              <span className="status-pill status-rejected">
                                <XCircle size={12} /> Rejected
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="action-buttons-cell">
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-approve"
                                    onClick={() => handleApprove(u.id)}
                                    title="Grant Login & Upload Access"
                                  >
                                    <CheckCircle2 size={14} /> Approve Access
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-reject"
                                    onClick={() => handleReject(u.id)}
                                    title="Reject Registration"
                                  >
                                    <XCircle size={14} /> Reject
                                  </button>
                                </>
                              )}

                              {isApproved && u.role !== "Admin" && (
                                <button
                                  type="button"
                                  className="btn-suspend"
                                  onClick={() => handleReject(u.id)}
                                  title="Suspend user access"
                                >
                                  Suspend Access
                                </button>
                              )}

                              {isRejected && (
                                <button
                                  type="button"
                                  className="btn-approve"
                                  onClick={() => handleApprove(u.id)}
                                  title="Re-approve user"
                                >
                                  Re-Approve
                                </button>
                              )}

                              {u.role === "Admin" && (
                                <span className="system-root-label">System Protected</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: LOGIN & ACCESS AUDIT LOGS */}
        {activeTab === "audit" && (
          <section className="admin-content-section">
            <div className="audit-section-header">
              <div>
                <h2>Real-Time Access & Login Audit Trail</h2>
                <p>
                  Comprehensive compliance log documenting every user who logged in, attempted access, their device fingerprint, IP address, and status.
                </p>
              </div>

              <button className="refresh-logs-btn" onClick={loadData}>
                <RefreshCw size={14} /> Refresh Logs
              </button>
            </div>

            <div className="admin-users-table-wrap">
              <table className="admin-users-table audit-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User & Role</th>
                    <th>Access Result</th>
                    <th>Action Taken</th>
                    <th>Client Device / Browser</th>
                    <th>IP Address & Location</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map((log) => {
                    const isSuccess = log.status === "SUCCESS";
                    const isBlocked = log.status === "BLOCKED_PENDING";
                    const isFailed = log.status === "FAILED";

                    return (
                      <tr key={log.id}>
                        <td>
                          <div className="audit-time-cell">
                            <strong>
                              {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </strong>
                            <span>{new Date(log.timestamp).toLocaleDateString("en-IN")}</span>
                          </div>
                        </td>

                        <td>
                          <div className="user-name-cell">
                            <div>
                              <strong className="user-cell-name">{log.userName}</strong>
                              <span className="user-cell-company">
                                {log.userEmail} · <span className="text-blue">{log.userRole}</span>
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {isSuccess && (
                            <span className="log-badge log-success">
                              🟢 Authorized Sign In
                            </span>
                          )}
                          {isBlocked && (
                            <span className="log-badge log-blocked">
                              🟠 Blocked (Pending Approval)
                            </span>
                          )}
                          {isFailed && (
                            <span className="log-badge log-failed">
                              🔴 Disapproved / Failed
                            </span>
                          )}
                        </td>

                        <td>
                          <span className="audit-action-text">{log.action}</span>
                        </td>

                        <td>
                          <div className="device-cell">
                            <Laptop size={13} />
                            <span>{log.device || "Chrome / Windows 11"}</span>
                          </div>
                        </td>

                        <td>
                          <div className="ip-cell">
                            <Globe size={13} />
                            <span>{log.ip}</span>
                            <span className="ip-location">{log.location || "Hyderabad, India"}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: PUBLISHED CONTENT MODERATION */}
        {activeTab === "content" && (
          <section className="admin-content-section">
            <div className="audit-section-header">
              <div>
                <h2>Verified Real Estate Catalog & Ventures</h2>
                <p>
                  Active projects and ventures uploaded by verified developers (SB Infra and Vilva Builders).
                </p>
              </div>
            </div>

            <div className="admin-projects-grid">
              {sbInfraVentures.map((proj) => (
                <div key={proj.id} className="admin-project-item-card">
                  <img src={proj.image} alt={proj.name} className="admin-proj-cover" />
                  <div className="admin-proj-info">
                    <div className="proj-top-badges">
                      <span className="proj-dev-pill">🏢 SB Infra</span>
                      <span className="proj-cat-pill">VENTURE</span>
                    </div>
                    <h4>{proj.name}</h4>
                    <p>{proj.subtitle || proj.location}</p>
                    <div className="admin-proj-footer">
                      <span className="proj-status-tag">✅ Approved & Live</span>
                      <a
                        href={`/projects/${proj.slug || proj.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="proj-view-link"
                      >
                        Inspect Page <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {vilvaProjects.map((proj) => (
                <div key={proj.id} className="admin-project-item-card">
                  <img src={proj.image} alt={proj.name} className="admin-proj-cover" />
                  <div className="admin-proj-info">
                    <div className="proj-top-badges">
                      <span className="proj-dev-pill">🏗️ Vilva Builders</span>
                      <span className="proj-cat-pill">{proj.category || "PROJECT"}</span>
                    </div>
                    <h4>{proj.name}</h4>
                    <p>{proj.subtitle || proj.location}</p>
                    <div className="admin-proj-footer">
                      <span className="proj-status-tag">✅ Approved & Live</span>
                      <a
                        href={`/projects/${proj.slug || proj.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="proj-view-link"
                      >
                        Inspect Page <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
