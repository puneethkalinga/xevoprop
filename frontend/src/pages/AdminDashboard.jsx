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
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("approvals"); // "approvals" | "submissions" | "audit" | "content"
  const [userFilter, setUserFilter] = useState("pending"); // "all" | "pending" | "approved" | "rejected" | "developer"
  const [projectFilter, setProjectFilter] = useState("pending"); // "all" | "pending" | "approved" | "rejected"
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
    const loadedNotifications = getStoredNotifications();
    setUsers(loadedUsers);
    setAccessLogs(loadedLogs);
    setProjectSubmissions(loadedSubmissions);
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

                          {/* MEDIA PREVIEW */}
                          {sub.images && sub.images.length > 0 && (
                            <div className="sub-media-section">
                              <span className="sub-section-title">
                                Uploaded Project Photos & Media ({sub.images.length})
                              </span>
                              <div className="sub-media-gallery">
                                {sub.images.map((img, idx) => (
                                  <div key={idx} className="sub-media-thumb">
                                    <img src={img.url} alt={`Upload ${idx + 1}`} />
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
