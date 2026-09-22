import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Building,
  CheckCircle2,
  Edit3,
  Save,
  X,
  LockKeyhole,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  MASTER_ADMIN_CREDENTIALS,
  findUserByCredentials,
  updateUserInStore,
  updatePasswordInStore,
} from "../lib/adminStore";
import "./Profile.css";

const API_URL = "https://xevoprop.onrender.com/api";

function Profile() {
  const navigate = useNavigate();
  const { user: authUser, login } = useAuth();

  // Helper to resolve the most up-to-date user profile
  const resolveActiveUser = useCallback(() => {
    let u = authUser;
    if (!u) {
      try {
        const stored = localStorage.getItem("xevoprop_user") || localStorage.getItem("user");
        if (stored) u = JSON.parse(stored);
      } catch {
        // ignore JSON parse error
      }
    }

    // Check if this is the Master Admin
    const isMasterAdmin =
      u?.username === MASTER_ADMIN_CREDENTIALS.username ||
      u?.email?.toLowerCase() === MASTER_ADMIN_CREDENTIALS.email.toLowerCase() ||
      u?.role?.toLowerCase() === "admin" ||
      localStorage.getItem("token")?.startsWith("jwt_token_admin_");

    if (isMasterAdmin) {
      const cleanPhone =
        u?.phone && u.phone !== "9876543210" && u.phone !== "+91 98765 43210"
          ? u.phone
          : "";

      return {
        ...MASTER_ADMIN_CREDENTIALS,
        id: 1,
        ...u,
        name: u?.name || MASTER_ADMIN_CREDENTIALS.name,
        email: u?.email || MASTER_ADMIN_CREDENTIALS.email,
        phone: cleanPhone,
        company: u?.company || MASTER_ADMIN_CREDENTIALS.company,
        role: "Admin",
      };
    }

    // If it's a registered user from local adminStore
    if (u?.email || u?.username) {
      const match = findUserByCredentials(u.email || u.username);
      if (match) {
        return {
          ...match,
          ...u,
        };
      }
    }

    return u || null;
  }, [authUser]);

  const [user, setUser] = useState(resolveActiveUser);

  const [formData, setFormData] = useState(() => {
    const active = resolveActiveUser();
    return {
      name: active?.name || "",
      email: active?.email || "",
      phone: active?.phone || "",
      company: active?.company || "",
    };
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [editing, setEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      const active = resolveActiveUser();
      const token = localStorage.getItem("token");

      if (active) {
        if (!cancelled) {
          setUser(active);
          setFormData({
            name: active.name || "",
            email: active.email || "",
            phone: active.phone || "",
            company: active.company || "",
          });
        }
      }

      if (!token && !active) {
        navigate("/login");
        return;
      }

      // If token is local or user is admin, skip backend network call
      const isLocalToken =
        token?.startsWith("jwt_token_") ||
        active?.username === MASTER_ADMIN_CREDENTIALS.username ||
        active?.role?.toLowerCase() === "admin";

      if (isLocalToken) {
        return;
      }

      // Only attempt backend fetch if we have an external token
      if (token) {
        try {
          const response = await fetch(`${API_URL}/users/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const profile = data.user || data;

            if (!cancelled && profile) {
              const merged = { ...active, ...profile };
              setUser(merged);
              setFormData({
                name: merged.name || "",
                email: merged.email || "",
                phone: merged.phone || "",
                company: merged.company || "",
              });
              login({ user: merged, token });
            }
          } else if (!active && !cancelled) {
            setError("Unable to load profile. Please log in again.");
          }
        } catch (err) {
          console.warn("Backend API sync failed (offline or server asleep), using local session:", err);
          // Only show error if we have completely no profile data
          if (!active && !cancelled) {
            setError("Unable to connect to server. Please check your network connection.");
          }
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [navigate, resolveActiveUser, login]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedUser = {
        ...(user || {}),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: (formData.company || user?.company || "").trim(),
      };

      // 1. Update in local state & context
      setUser(updatedUser);
      login({ user: updatedUser, token: localStorage.getItem("token") });
      localStorage.setItem("username", updatedUser.name);

      // 2. Update in adminStore
      updateUserInStore(updatedUser);

      // 3. Sync to backend if token is a remote token
      const token = localStorage.getItem("token");
      if (token && !token.startsWith("jwt_token_")) {
        try {
          await fetch(`${API_URL}/users/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: updatedUser.name,
              email: updatedUser.email,
              phone: updatedUser.phone,
            }),
          });
        } catch (apiErr) {
          console.warn("Backend update failed, profile updated locally:", apiErr);
        }
      }

      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    try {
      setChangingPassword(true);
      const token = localStorage.getItem("token");

      // Check Master Admin or local store users
      const isLocalOrAdmin =
        user?.username === MASTER_ADMIN_CREDENTIALS.username ||
        token?.startsWith("jwt_token_");

      if (isLocalOrAdmin) {
        if (
          user?.password &&
          user.password !== currentPassword &&
          currentPassword !== MASTER_ADMIN_CREDENTIALS.password
        ) {
          setError("Current password is incorrect.");
          setChangingPassword(false);
          return;
        }

        updatePasswordInStore(user?.id || user?.email || user?.username, newPassword);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordSection(false);
        setSuccess("Password updated successfully.");
        return;
      }

      // External API token
      if (token) {
        const response = await fetch(`${API_URL}/users/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to update password.");
        }
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);
      setSuccess("Password updated successfully.");
    } catch (err) {
      console.error("Update password error:", err);
      setError(err.message || "Unable to update password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancel = () => {
    setError("");
    setSuccess("");
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company: user?.company || "",
    });
    setEditing(false);
  };

  const getInitial = () => {
    if (!user?.name) {
      return "U";
    }
    return user.name.trim().charAt(0).toUpperCase();
  };

  const getRole = () => {
    if (!user?.role) {
      return "User";
    }
    if (user.role.toLowerCase() === "admin") {
      return "Master Administrator";
    }
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else if (user?.role?.toLowerCase() === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="my-profile-page">
        <div className="my-profile-container">
          <div className="profile-card">
            <div className="profile-loading">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-profile-page">
      <div className="my-profile-container">
        <div className="my-profile-header">
          <button
            type="button"
            className="profile-back-button"
            onClick={handleBack}
            title="Go back"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1>My Profile</h1>
            <p>Manage your Xevoprop account information.</p>
          </div>
        </div>

        {error && (
          <div className="profile-alert profile-error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-alert profile-success">
            {success}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-card-top">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "Profile"}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                getInitial()
              )}
            </div>

            <div className="profile-main-info">
              <h2>{user?.name || "User"}</h2>
              <p>{user?.email || "No email available"}</p>

              <span className="profile-role">
                {user?.role?.toLowerCase() === "admin" ? (
                  <ShieldCheck size={14} color="#38bdf8" />
                ) : (
                  <Shield size={13} />
                )}
                {getRole()}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-section-title">
              <User size={20} />
              <h3>Personal Information</h3>
            </div>

            {!editing ? (
              <>
                <div className="profile-grid">
                  <div className="profile-info-item">
                    <div className="profile-info-label">
                      <User size={14} />
                      Full Name
                    </div>
                    <div className="profile-info-value">
                      {user?.name || "Not provided"}
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-info-label">
                      <Mail size={14} />
                      Email
                    </div>
                    <div className="profile-info-value">
                      {user?.email || "Not provided"}
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-info-label">
                      <Phone size={14} />
                      Phone
                    </div>
                    <div className="profile-info-value">
                      {user?.phone || "Not provided"}
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-info-label">
                      {user?.role?.toLowerCase() === "admin" ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <Shield size={14} />
                      )}
                      Account Type
                    </div>
                    <div className="profile-info-value">{getRole()}</div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-info-label">
                      <Building size={14} />
                      Company / Organization
                    </div>
                    <div className="profile-info-value">
                      {user?.company || (user?.role === "Admin" ? "Xevoproptech Pvt Ltd" : "Individual")}
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-info-label">
                      <CheckCircle2 size={14} />
                      Verification Status
                    </div>
                    <div
                      className="profile-info-value"
                      style={{
                        color: "#16a34a",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#22c55e",
                          display: "inline-block",
                        }}
                      />
                      {user?.status === "approved" || user?.role === "Admin"
                        ? "Approved & Verified"
                        : "Active"}
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    type="button"
                    className="profile-edit-button"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setEditing(true);
                    }}
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>

                  <button
                    type="button"
                    className="profile-password-button"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setShowPasswordSection((previous) => !previous);
                    }}
                  >
                    <KeyRound size={16} />
                    {showPasswordSection
                      ? "Close Password"
                      : "Update Password"}
                  </button>
                </div>
              </>
            ) : (
              <form className="profile-edit-form" onSubmit={handleSave}>
                <div className="profile-form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="company">Company / Organization</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter your organization name"
                  />
                </div>

                <div className="profile-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {showPasswordSection && (
              <form
                className="password-update-card"
                onSubmit={handleChangePassword}
              >
                <div className="password-update-header">
                  <div className="password-update-icon">
                    <LockKeyhole size={19} />
                  </div>

                  <div>
                    <h3>Update Password</h3>
                    <p>Choose a new password to keep your account secure.</p>
                  </div>
                </div>

                <div className="password-update-fields">
                  <div className="profile-form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="profile-password-input">
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("current")}
                        aria-label={
                          showPasswords.current
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="profile-password-input">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        minLength="6"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("new")}
                        aria-label={
                          showPasswords.new
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                    <span className="profile-password-hint">
                      Minimum 6 characters
                    </span>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <div className="profile-password-input">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        minLength="6"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("confirm")}
                        aria-label={
                          showPasswords.confirm
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="password-update-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={() => {
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setShowPasswordSection(false);
                    }}
                    disabled={changingPassword}
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={changingPassword}
                  >
                    <LockKeyhole size={16} />
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;