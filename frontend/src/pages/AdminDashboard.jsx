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
  FileText,
  Download,
  Eye,
  Bell,
  CheckSquare,
  Video,
  Play,
  Home,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  IndianRupee,
  BellRing,
  CheckCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AgreementViewerModal from "../components/AgreementViewerModal";
import {
  getStoredUsers,
  approveUser,
  rejectUser,
  getStoredAccessLogs,
  recordAccessLog,
  getStoredProjectSubmissions,
  approveProjectSubmission,
  rejectProjectSubmission,
  getStoredNotifications,
  getStoredPropertySubmissions,
  approvePropertyListing,
  rejectPropertyListing,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../lib/adminStore";
import { vilvaProjects } from "../data/vilvaProjects";
import { sbInfraVentures } from "../data/sbInfraProjects";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [projectSubmissions, setProjectSubmissions] = useState([]);
  const [propertySubmissions, setPropertySubmissions] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("approvals"); // "approvals" | "properties" | "submissions" | "audit" | "content"
  const [userFilter, setUserFilter] = useState("pending"); // "all" | "pending" | "approved" | "rejected" | "developer"
  const [projectFilter, setProjectFilter] = useState("pending"); // "all" | "pending" | "approved" | "rejected"
  const [propertyFilter, setPropertyFilter] = useState("pending"); // "all" | "pending" | "approved" | "rejected"
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/dashboard");
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    const loadedUsers = getStoredUsers();
    const loadedLogs = getStoredAccessLogs();
    const loadedSubmissions = getStoredProjectSubmissions();
    const loadedProperties = getStoredPropertySubmissions();
    const loadedNotifications = getStoredNotifications();
    setUsers(loadedUsers);
    setAccessLogs(loadedLogs);
    setProjectSubmissions(loadedSubmissions);
    setPropertySubmissions(loadedProperties);
    setAdminNotifications(loadedNotifications);
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

  // Project submission actions
  const handleApproveProject = (submissionId) => {
    try {
      const updated = approveProjectSubmission(submissionId, user?.name || "Xevoproptech Admin");
      loadData();
      showNotification(`✅ Approved project "${updated.name}" & verified signed agreement. Project is now live!`);
    } catch (err) {
      alert("Error approving project: " + err.message);
    }
  };

  const handleRejectProject = (submissionId) => {
    const reason = window.prompt("Reason for rejecting or requesting revision:", "Incomplete documentation or agreement details");
    if (reason === null) return;
    try {
      const updated = rejectProjectSubmission(submissionId, reason, user?.name || "Xevoproptech Admin");
      loadData();
      showNotification(`❌ Project "${updated.name}" marked for revision.`);
    } catch (err) {
      alert("Error rejecting project: " + err.message);
    }
  };

  // Property listing actions
  const handleApproveProperty = (propertyId) => {
    try {
      const updated = approvePropertyListing(propertyId, user?.name || "Xevoproptech Admin");
      // Sync to backend if available
      const token = localStorage.getItem("token");
      if (token && !String(propertyId).startsWith("prop_sub_")) {
        fetch(`https://xevoprop.onrender.com/api/admin/properties/${propertyId}/approve`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch((e) => console.log("Backend property approve notice:", e.message));
      }
      loadData();
      showNotification(`✅ Approved property "${updated.title}". Property listing is now live!`);
    } catch (err) {
      alert("Error approving property: " + err.message);
    }
  };

  const handleRejectProperty = (propertyId) => {
    const reason = window.prompt("Reason for rejecting or requesting revision:", "Incomplete property specifications or image verification needed");
    if (reason === null) return;
    try {
      const updated = rejectPropertyListing(propertyId, reason, user?.name || "Xevoproptech Admin");
      const token = localStorage.getItem("token");
      if (token && !String(propertyId).startsWith("prop_sub_")) {
        fetch(`https://xevoprop.onrender.com/api/admin/properties/${propertyId}/reject`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }).catch((e) => console.log("Backend property reject notice:", e.message));
      }
      loadData();
      showNotification(`❌ Property "${updated.title}" marked for revision.`);
    } catch (err) {
      alert("Error rejecting property: " + err.message);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    markAllNotificationsAsRead();
    setAdminNotifications(getStoredNotifications());
  };

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    setAdminNotifications(getStoredNotifications());
    setIsNotifOpen(false);

    if (notif.type === "property_submission" || notif.type === "property_approved" || notif.type === "property_rejected") {
      setActiveTab("properties");
      setPropertyFilter("all");
    } else if (notif.type === "agreement_submission" || notif.type === "project_approved" || notif.type === "project_rejected") {
      setActiveTab("submissions");
      setProjectFilter("all");
    } else if (notif.type === "user_registration") {
      setActiveTab("approvals");
      setUserFilter("pending");
    }
  };

  const handleDownloadSignedDoc = (agreement) => {
    const a = document.createElement("a");
    a.href = agreement?.fileDataUrl || "/documents/Builder_Listing_Commission_Agreementfinal.docx";
    a.download = agreement?.fileName || "Signed_Builder_Agreement.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
  const pendingProjectsCount = projectSubmissions.filter((p) => p.status === "pending_approval").length;
  const pendingPropertiesCount = propertySubmissions.filter((p) => p.status === "pending_approval" || p.status === "pending").length;
  const unreadNotifsCount = adminNotifications.filter((n) => !n.read_at).length;

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

  // Filtered project submissions
  const filteredSubmissions = projectSubmissions.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name?.toLowerCase().includes(q) ||
        p.builderName?.toLowerCase().includes(q) ||
        p.builderCompany?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (projectFilter === "pending") return p.status === "pending_approval";
    if (projectFilter === "approved") return p.status === "approved";
    if (projectFilter === "rejected") return p.status === "rejected";
    return true;
  });

  // Filtered property submissions
  const filteredProperties = propertySubmissions.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title?.toLowerCase().includes(q) ||
        p.submitterName?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (propertyFilter === "pending") return p.status === "pending_approval" || p.status === "pending";
    if (propertyFilter === "approved") return p.status === "approved";
    if (propertyFilter === "rejected") return p.status === "rejected";
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
            {/* NOTIFICATION CENTER BELL & DROPDOWN */}
            <div className="admin-notif-btn-wrapper">
              <button
                type="button"
                className={`admin-notif-bell-btn ${isNotifOpen ? "active" : ""}`}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                aria-label="Admin Notifications"
                title={`Admin Notifications (${unreadNotifsCount} unread)`}
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span className="admin-notif-badge">{unreadNotifsCount}</span>
                )}
              </button>

              {isNotifOpen && (
                <div className="admin-notif-dropdown">
                  <div className="admin-notif-header">
                    <div className="admin-notif-title">
                      <BellRing size={16} color="#1d4ed8" />
                      <strong>Action Center</strong>
                      {unreadNotifsCount > 0 && (
                        <span className="admin-notif-count-pill">{unreadNotifsCount} new</span>
                      )}
                    </div>
                    {adminNotifications.length > 0 && (
                      <button
                        type="button"
                        className="admin-notif-mark-all"
                        onClick={handleMarkAllNotificationsRead}
                      >
                        <CheckCheck size={13} style={{ marginRight: 4 }} />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="admin-notif-list">
                    {adminNotifications.length === 0 ? (
                      <div className="admin-notif-empty">No notifications yet</div>
                    ) : (
                      adminNotifications.slice(0, 15).map((notif) => {
                        const isUnread = !notif.read_at;
                        return (
                          <div
                            key={notif.id}
                            className={`admin-notif-item ${isUnread ? "is-unread" : ""}`}
                            onClick={() => handleNotificationClick(notif)}
                          >
                            <div className={`admin-notif-icon-col ${notif.type}`}>
                              {notif.type === "property_submission" || notif.type === "property_approved" ? (
                                <Home size={16} />
                              ) : notif.type === "user_registration" ? (
                                <Users size={16} />
                              ) : (
                                <FileText size={16} />
                              )}
                            </div>
                            <div className="admin-notif-content-col">
                              <div className="admin-notif-item-title">
                                <strong>{notif.title}</strong>
                                <span className="admin-notif-item-time">
                                  {new Date(notif.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="admin-notif-item-msg">{notif.message}</p>
                              <span className="admin-notif-jump-pill">
                                Review & Approve →
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-profile-pill">
              <div className="admin-avatar">
                <ShieldCheck size={18} color="#1d4ed8" />
              </div>
              <div>
                <strong>{user?.name || "Xevoproptech Admin"}</strong>
                <span>{user?.username || "admin.xevoproptech"}</span>
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
              <span className="kpi-label">PENDING USER APPROVALS</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{pendingCount}</span>
                {pendingCount > 0 && <span className="kpi-tag alert">Action Required</span>}
              </div>
              <p className="kpi-sub">Accounts awaiting verification before login access</p>
            </div>
          </div>

          <div className="admin-kpi-card pending-kpi">
            <div className="kpi-icon-wrap" style={{ background: "#ecfdf5", color: "#059669" }}>
              <Home size={22} />
            </div>
            <div>
              <span className="kpi-label">PENDING PROPERTY LISTINGS</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{pendingPropertiesCount}</span>
                {pendingPropertiesCount > 0 ? (
                  <span className="kpi-tag alert">Action Required</span>
                ) : (
                  <span className="kpi-tag success">All Reviewed</span>
                )}
              </div>
              <p className="kpi-sub">Sellers & developer properties awaiting admin verification</p>
            </div>
          </div>

          <div className="admin-kpi-card pending-kpi">
            <div className="kpi-icon-wrap dev">
              <FileText size={22} />
            </div>
            <div>
              <span className="kpi-label">PROJECT SUBMISSIONS & AGREEMENTS</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{pendingProjectsCount}</span>
                {pendingProjectsCount > 0 ? (
                  <span className="kpi-tag alert">Awaiting Review</span>
                ) : (
                  <span className="kpi-tag success">All Reviewed</span>
                )}
              </div>
              <p className="kpi-sub">Signed agreements & listings awaiting admin approval</p>
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
            className={`admin-tab-btn ${activeTab === "properties" ? "active" : ""}`}
            onClick={() => setActiveTab("properties")}
          >
            <Home size={16} />
            Property Listings & Approvals
            {pendingPropertiesCount > 0 && <span className="tab-counter-badge">{pendingPropertiesCount}</span>}
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "submissions" ? "active" : ""}`}
            onClick={() => setActiveTab("submissions")}
          >
            <FileText size={16} />
            Project Submissions & Signed Agreements
            {pendingProjectsCount > 0 && <span className="tab-counter-badge">{pendingProjectsCount}</span>}
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

        {/* TAB: PROPERTY LISTINGS & APPROVALS */}
        {activeTab === "properties" && (
          <section className="admin-content-section">
            {/* ALERT NOTIFICATION BANNER */}
            {pendingPropertiesCount > 0 && (
              <div className="admin-submission-alert-banner">
                <Bell size={20} className="alert-bell-icon" />
                <div className="alert-banner-content">
                  <strong>
                    {pendingPropertiesCount} Property Listing{pendingPropertiesCount > 1 ? "s" : ""} Awaiting Verification
                  </strong>
                  <p>
                    Sellers and developers have uploaded property listings with media and pricing details.
                    Review the property details, inspect uploaded photos & video walkthroughs, and authorize publication.
                  </p>
                </div>
              </div>
            )}

            {/* TOOLBAR */}
            <div className="admin-section-toolbar">
              <div className="admin-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by title, seller, city or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                    ×
                  </button>
                )}
              </div>

              <div className="admin-filter-tabs">
                {[
                  { key: "all", label: "All Properties", count: propertySubmissions.length },
                  { key: "pending", label: "Awaiting Approval", count: pendingPropertiesCount },
                  { key: "approved", label: "Approved & Live", count: propertySubmissions.filter((p) => p.status === "approved").length },
                  { key: "rejected", label: "Revision Requested", count: propertySubmissions.filter((p) => p.status === "rejected").length },
                ].map((f) => (
                  <button
                    key={f.key}
                    className={`admin-filter-btn ${propertyFilter === f.key ? "active" : ""}`}
                    onClick={() => setPropertyFilter(f.key)}
                  >
                    {f.label}
                    <span className="filter-count-pill">{f.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PROPERTY LISTINGS */}
            {filteredProperties.length === 0 ? (
              <div className="admin-empty-state">
                <Home size={42} className="empty-state-icon" />
                <h3>No property listings found</h3>
                <p>No property listings match the selected filter or search query.</p>
              </div>
            ) : (
              <div className="admin-submissions-list">
                {filteredProperties.map((prop) => {
                  const isPending = prop.status === "pending_approval" || prop.status === "pending";
                  const isApproved = prop.status === "approved";
                  const isRejected = prop.status === "rejected";

                  return (
                    <div
                      key={prop.id}
                      className={`admin-submission-card ${isPending ? "is-pending" : ""}`}
                    >
                      {/* CARD HEADER */}
                      <div className="submission-card-header">
                        <div className="sub-header-left">
                          <div className="builder-avatar">
                            {(prop.submitterName || "S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <strong className="sub-builder-name">{prop.submitterName}</strong>
                              <span className="builder-company-pill">{prop.submitterRole || "Seller"}</span>
                            </div>
                            <div className="sub-builder-contact">
                              {prop.submitterEmail && (
                                <span>
                                  <Mail size={12} /> {prop.submitterEmail}
                                </span>
                              )}
                              {prop.submitterPhone && (
                                <span>
                                  <Phone size={12} /> {prop.submitterPhone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="sub-header-right">
                          <span className="sub-date">
                            <Clock size={13} />
                            {new Date(prop.submittedAt || Date.now()).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                          {isPending && (
                            <span className="sub-status-pill pending">
                              <Clock size={12} />
                              Awaiting Review
                            </span>
                          )}
                          {isApproved && (
                            <span className="sub-status-pill approved">
                              <CheckCircle2 size={12} />
                              Live on Platform
                            </span>
                          )}
                          {isRejected && (
                            <span className="sub-status-pill rejected">
                              <XCircle size={12} />
                              Revision Requested
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CARD BODY */}
                      <div className="submission-card-body">
                        {/* LEFT: SPECS */}
                        <div className="sub-details-col">
                          <div className="sub-project-title-row">
                            <h3>{prop.title}</h3>
                            {prop.price && (
                              <span className="sub-price-tag">
                                <IndianRupee size={15} />
                                {prop.price}
                              </span>
                            )}
                          </div>

                          <div className="sub-meta-badges">
                            <span className="meta-badge type">{prop.type}</span>
                            <span className="meta-badge">{prop.usage_type || "Investment"}</span>
                            <span className="meta-badge location">
                              <MapPin size={12} />
                              {prop.location}, {prop.city}
                            </span>
                          </div>

                          {/* SPECS ROW */}
                          <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
                            {prop.bedrooms && (
                              <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                <BedDouble size={15} color="#2563eb" /> {prop.bedrooms} BHK
                              </span>
                            )}
                            {prop.bathrooms && (
                              <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                <Bath size={15} color="#2563eb" /> {prop.bathrooms} Baths
                              </span>
                            )}
                            {prop.area && (
                              <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                <Maximize size={15} color="#2563eb" /> {prop.area} sq.ft
                              </span>
                            )}
                          </div>

                          {prop.description && (
                            <p className="sub-description">{prop.description}</p>
                          )}
                        </div>

                        {/* RIGHT: MEDIA GALLERY (PHOTOS & VIDEOS) */}
                        <div className="sub-media-col">
                          <div className="media-section-title">
                            <span>
                              📷 Uploaded Property Media ({prop.images?.length || (prop.image ? 1 : 0)})
                            </span>
                          </div>

                          <div className="sub-media-grid">
                            {prop.images && prop.images.length > 0 ? (
                              prop.images.map((media, idx) => {
                                const isVid = media.type === "video" || /\.(mp4|mov|webm|mkv|avi|m4v)$/i.test(media.url || media.name || "");
                                return (
                                  <div key={idx} className="sub-media-thumb-wrap">
                                    {isVid ? (
                                      <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                        <video
                                          src={media.url}
                                          controls
                                          playsInline
                                          preload="metadata"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                          }}
                                        />
                                        <span className="media-type-badge video">
                                          <Video size={10} /> Video
                                        </span>
                                      </div>
                                    ) : (
                                      <>
                                        <img src={media.url} alt={media.name || "Property Photo"} />
                                        <span className="media-type-badge photo">Photo</span>
                                      </>
                                    )}
                                  </div>
                                );
                              })
                            ) : prop.image ? (
                              <div className="sub-media-thumb-wrap">
                                <img src={prop.image} alt={prop.title} />
                                <span className="media-type-badge photo">Photo</span>
                              </div>
                            ) : (
                              <div className="no-media-placeholder">No images attached</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CARD FOOTER */}
                      <div className="submission-card-footer">
                        <div className="sub-footer-meta">
                          {isApproved && (
                            <span className="review-meta">
                              ✅ Approved by <strong>{prop.reviewedBy || "Admin"}</strong> on{" "}
                              {new Date(prop.reviewedAt || Date.now()).toLocaleDateString("en-IN")}
                            </span>
                          )}
                          {isRejected && (
                            <span className="rejection-note">
                              ❌ Revision requested: "{prop.rejectionReason}"
                            </span>
                          )}
                          {isPending && (
                            <span style={{ color: "#d97706", fontWeight: "600" }}>
                              ⚠️ Approval required to publish this listing live to public buyers.
                            </span>
                          )}
                        </div>

                        <div className="sub-footer-actions">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                className="btn-approve-project"
                                onClick={() => handleApproveProperty(prop.id)}
                              >
                                <CheckCircle2 size={16} />
                                Approve Property Listing
                              </button>
                              <button
                                type="button"
                                className="btn-reject-project"
                                onClick={() => handleRejectProperty(prop.id)}
                              >
                                <XCircle size={16} />
                                Request Revision / Reject
                              </button>
                            </>
                          )}
                          {isApproved && (
                            <button
                              type="button"
                              className="btn-reject-project"
                              onClick={() => handleRejectProperty(prop.id)}
                            >
                              Suspend Listing
                            </button>
                          )}
                          {isRejected && (
                            <button
                              type="button"
                              className="btn-approve-project"
                              onClick={() => handleApproveProperty(prop.id)}
                            >
                              Re-Approve Listing
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: PROJECT SUBMISSIONS & SIGNED AGREEMENTS */}
        {activeTab === "submissions" && (
          <section className="admin-content-section">
            {/* ALERT NOTIFICATION BANNER */}
            {pendingProjectsCount > 0 && (
              <div className="admin-submission-alert-banner">
                <Bell size={20} className="alert-bell-icon" />
                <div className="alert-banner-content">
                  <strong>
                    {pendingProjectsCount} Project Listing{pendingProjectsCount > 1 ? "s" : ""} Awaiting Verification
                  </strong>
                  <p>
                    Builders have submitted property listings along with their digitally signed Builder Listing & Commission Agreements.
                    Review the project specifications, inspect the attached signed agreements, and authorize publication.
                  </p>
                </div>
              </div>
            )}

            {/* TOOLBAR */}
            <div className="admin-section-toolbar">
              <div className="admin-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search project by name, builder, location, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="admin-filter-pills">
                <button
                  className={projectFilter === "pending" ? "active" : ""}
                  onClick={() => setProjectFilter("pending")}
                >
                  ⏳ Pending Review ({pendingProjectsCount})
                </button>
                <button
                  className={projectFilter === "approved" ? "active" : ""}
                  onClick={() => setProjectFilter("approved")}
                >
                  ✅ Approved & Live ({projectSubmissions.filter((p) => p.status === "approved").length})
                </button>
                <button
                  className={projectFilter === "rejected" ? "active" : ""}
                  onClick={() => setProjectFilter("rejected")}
                >
                  ❌ Revision Required ({projectSubmissions.filter((p) => p.status === "rejected").length})
                </button>
                <button
                  className={projectFilter === "all" ? "active" : ""}
                  onClick={() => setProjectFilter("all")}
                >
                  All Submissions ({projectSubmissions.length})
                </button>
              </div>
            </div>

            {/* PROJECT SUBMISSION CARDS */}
            {filteredSubmissions.length === 0 ? (
              <div className="admin-empty-box">
                <CheckCircle2 size={36} color="#16a34a" />
                <h3>No Project Submissions Found</h3>
                <p>There are no projects matching the selected filter criteria.</p>
              </div>
            ) : (
              <div className="admin-submissions-list">
                {filteredSubmissions.map((sub) => {
                  const isPending = sub.status === "pending_approval";
                  const isApproved = sub.status === "approved";
                  const isRejected = sub.status === "rejected";

                  return (
                    <article key={sub.id} className={`admin-submission-card ${isPending ? "is-pending" : ""}`}>
                      {/* CARD HEADER */}
                      <div className="submission-card-header">
                        <div className="sub-header-left">
                          <span className="sub-builder-tag">
                            <Building2 size={14} /> {sub.builderCompany || sub.builderName}
                          </span>
                          <span className="sub-type-badge">{sub.type}</span>
                          <span className="sub-date">
                            Submitted: {new Date(sub.submittedAt || Date.now()).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="sub-header-right">
                          {isPending && (
                            <span className="status-pill status-pending">
                              <Clock size={13} /> Awaiting Admin Approval
                            </span>
                          )}
                          {isApproved && (
                            <span className="status-pill status-approved">
                              <CheckCircle2 size={13} /> Approved & Live
                            </span>
                          )}
                          {isRejected && (
                            <span className="status-pill status-rejected">
                              <XCircle size={13} /> Revision Requested
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CARD BODY */}
                      <div className="submission-card-body">
                        {/* LEFT: PROJECT OVERVIEW */}
                        <div className="sub-project-overview">
                          <h3 className="sub-project-title">{sub.name}</h3>

                          <div className="sub-specs-row">
                            <span className="sub-spec-item">
                              <strong>Location:</strong> {sub.location || `${sub.city}, ${sub.state}`}
                            </span>
                            {sub.units && (
                              <span className="sub-spec-item">
                                <strong>Units:</strong> {sub.units} Units
                              </span>
                            )}
                            {sub.price && (
                              <span className="sub-spec-item">
                                <strong>Price:</strong> {sub.price}
                              </span>
                            )}
                          </div>

                          {sub.description && (
                            <p className="sub-description">{sub.description}</p>
                          )}

                          {/* MEDIA PREVIEW (PHOTOS & VIDEOS) */}
                          {sub.images && sub.images.length > 0 && (
                            <div className="sub-media-section">
                              <span className="sub-section-title">
                                Uploaded Project Media ({sub.images.length}) ·{" "}
                                {sub.images.filter((m) => m.type !== "video").length} Photos,{" "}
                                {sub.images.filter((m) => m.type === "video").length} Videos
                              </span>
                              <div className="sub-media-gallery">
                                {sub.images.map((img, idx) => (
                                  <div
                                    key={idx}
                                    className={`sub-media-thumb ${img.type === "video" ? "is-video-thumb" : ""}`}
                                  >
                                    {img.type === "video" ? (
                                      <div className="admin-video-thumb-container">
                                        <video
                                          src={img.url}
                                          controls
                                          preload="metadata"
                                          playsInline
                                        />
                                        <span className="media-sub-tag">
                                          <Video size={10} /> VIDEO
                                        </span>
                                      </div>
                                    ) : (
                                      <img src={img.url} alt={`Upload ${idx + 1}`} />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT: SIGNED AGREEMENT & AUTHORIZATION BOX */}
                        <div className="sub-agreement-review-box">
                          <div className="sub-agreement-box-header">
                            <div className="doc-icon-wrap">
                              <FileCheck size={20} />
                            </div>
                            <div>
                              <h4>Digitally Signed Agreement</h4>
                              <p>Builder Listing & Commission Agreement</p>
                            </div>
                          </div>

                          {/* ATTACHED FILE DETAILS */}
                          <div className="sub-attached-doc-pill">
                            <FileText size={18} className="doc-pill-icon" />
                            <div className="doc-pill-meta">
                              <span className="doc-pill-filename">
                                {sub.agreement?.fileName || "Digitally_Signed_Agreement.docx"}
                              </span>
                              <span className="doc-pill-size">
                                {sub.agreement?.fileSize || "1.5 MB"} · Digitally Signed Document
                              </span>
                            </div>
                          </div>

                          {/* 3 VERIFIED DECLARATIONS */}
                          <div className="sub-declarations-checklist">
                            <div className="checklist-item verified">
                              <CheckSquare size={15} />
                              <span>Read & agreed to terms of Builder Commission Agreement</span>
                            </div>
                            <div className="checklist-item verified">
                              <CheckSquare size={15} />
                              <span>Confirmed all project info, pricing and specs are accurate</span>
                            </div>
                            <div className="checklist-item verified">
                              <CheckSquare size={15} />
                              <span>Confirmed authorized developer/representative to list</span>
                            </div>
                          </div>

                          {/* DOCUMENT ACTIONS */}
                          <div className="sub-doc-buttons">
                            <button
                              type="button"
                              className="btn-read-agreement"
                              onClick={() => setIsAgreementModalOpen(true)}
                            >
                              <Eye size={14} /> Read Agreement Text
                            </button>

                            <button
                              type="button"
                              className="btn-download-agreement"
                              onClick={() => handleDownloadSignedDoc(sub.agreement)}
                            >
                              <Download size={14} /> Download Signed Doc
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CARD FOOTER: ACTIONS */}
                      <div className="submission-card-footer">
                        <div className="sub-footer-meta">
                          <span>Builder Contact: <strong>{sub.builderName}</strong> ({sub.builderEmail})</span>
                          {sub.rejectionReason && (
                            <span className="rejection-note">Reason: {sub.rejectionReason}</span>
                          )}
                          {sub.reviewedAt && (
                            <span className="review-meta">
                              Reviewed by {sub.reviewedBy || "Admin"} on {new Date(sub.reviewedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="sub-footer-actions">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                className="btn-approve-project"
                                onClick={() => handleApproveProject(sub.id)}
                              >
                                <CheckCircle2 size={16} /> Approve Project & Agreement
                              </button>
                              <button
                                type="button"
                                className="btn-reject-project"
                                onClick={() => handleRejectProject(sub.id)}
                              >
                                <XCircle size={16} /> Request Revision / Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              type="button"
                              className="btn-reject-project"
                              onClick={() => handleRejectProject(sub.id)}
                            >
                              Revoke Approval
                            </button>
                          )}

                          {isRejected && (
                            <button
                              type="button"
                              className="btn-approve-project"
                              onClick={() => handleApproveProject(sub.id)}
                            >
                              <CheckCircle2 size={16} /> Re-Approve Project
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: LOGIN & ACCESS AUDIT LOGS */}
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

      {/* In-App Agreement Reader Modal */}
      <AgreementViewerModal
        isOpen={isAgreementModalOpen}
        onClose={() => setIsAgreementModalOpen(false)}
      />
    </div>
  );
}
