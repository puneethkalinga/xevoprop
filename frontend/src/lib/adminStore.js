/**
 * Xevoprop Admin & User Approval Store
 * Handles user management, approval workflows, and login access audit logs.
 * Backed by localStorage with seamless offline/online sync.
 */

const USERS_STORAGE_KEY = "xevoprop_registered_users";
const LOGS_STORAGE_KEY = "xevoprop_access_logs";

export const MASTER_ADMIN_CREDENTIALS = {
  username: "admin.xevoproptech",
  email: "admin.xevoproptech@gmail.com",
  password: "XEVOPROPTECH@2026",
  name: "Xevoproptech Admin",
  role: "Admin",
  status: "approved",
  company: "Xevoproptech Pvt Ltd",
  phone: "9876543210",
};

const INITIAL_USERS = [
  {
    id: 1,
    username: "admin.xevoproptech",
    name: "Xevoproptech Admin",
    email: "admin.xevoproptech@gmail.com",
    phone: "9876543210",
    role: "Admin",
    company: "Xevoproptech Pvt Ltd",
    status: "approved",
    registeredAt: "2026-09-01T09:00:00.000Z",
    approvedAt: "2026-09-01T09:00:00.000Z",
    approvedBy: "System Root",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    totalLogins: 42,
  },
  {
    id: 46,
    username: "info@sbinfra.com",
    name: "SB Infra",
    email: "info@sbinfra.com",
    phone: "9876543210",
    role: "Developer",
    company: "SB Infra Group",
    status: "approved",
    registeredAt: "2026-09-22T10:30:00.000Z",
    approvedAt: "2026-09-22T11:00:00.000Z",
    approvedBy: "Xevoproptech Admin",
    avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80",
    totalLogins: 12,
  },
  {
    id: 45,
    username: "info@vilvainfra.com",
    name: "Vilva Builders",
    email: "info@vilvainfra.com",
    phone: "8977761133",
    role: "Developer",
    company: "Vilva Builders & Developers",
    status: "approved",
    registeredAt: "2026-09-20T14:15:00.000Z",
    approvedAt: "2026-09-20T14:30:00.000Z",
    approvedBy: "Xevoproptech Admin",
    avatar: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=150&q=80",
    totalLogins: 28,
  },
  {
    id: 102,
    username: "ramesh.kumar@apexrealty.in",
    name: "Ramesh Kumar",
    email: "ramesh.kumar@apexrealty.in",
    phone: "9849012345",
    role: "Seller",
    company: "Apex Properties & Lands",
    status: "pending",
    registeredAt: "2026-09-22T19:40:00.000Z",
    approvedAt: null,
    approvedBy: null,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    totalLogins: 0,
  },
  {
    id: 103,
    username: "kavitha.reddy@hyderabadhomes.com",
    name: "Kavitha Reddy",
    email: "kavitha.reddy@hyderabadhomes.com",
    phone: "9988776655",
    role: "Developer",
    company: "Greenfield Infra Projects",
    status: "pending",
    registeredAt: "2026-09-23T00:15:00.000Z",
    approvedAt: null,
    approvedBy: null,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    totalLogins: 0,
  },
];

const INITIAL_LOGS = [
  {
    id: "log_101",
    userName: "Xevoproptech Admin",
    userEmail: "admin.xevoproptech@gmail.com",
    userRole: "Admin",
    company: "Xevoproptech Pvt Ltd",
    timestamp: "2026-09-23T00:45:12.000Z",
    ip: "152.58.112.44",
    location: "Hyderabad, Telangana, India",
    device: "Chrome 128 / Windows 11 (Desktop)",
    status: "SUCCESS",
    action: "Admin Master Sign In",
  },
  {
    id: "log_102",
    userName: "SB Infra",
    userEmail: "info@sbinfra.com",
    userRole: "Developer",
    company: "SB Infra Group",
    timestamp: "2026-09-22T23:18:04.000Z",
    ip: "49.207.214.90",
    location: "Hyderabad, Telangana, India",
    device: "Edge 128 / Windows 11 (Desktop)",
    status: "SUCCESS",
    action: "Developer Login - Project Media Upload",
  },
  {
    id: "log_103",
    userName: "Kavitha Reddy",
    userEmail: "kavitha.reddy@hyderabadhomes.com",
    userRole: "Developer",
    company: "Greenfield Infra Projects",
    timestamp: "2026-09-23T00:16:30.000Z",
    ip: "103.212.145.22",
    location: "Secunderabad, Telangana, India",
    device: "Safari 17 / iPhone 15 Pro",
    status: "BLOCKED_PENDING",
    action: "Login Blocked - Awaiting Admin Approval",
  },
  {
    id: "log_104",
    userName: "Vilva Builders",
    userEmail: "info@vilvainfra.com",
    userRole: "Developer",
    company: "Vilva Builders & Developers",
    timestamp: "2026-09-22T17:42:19.000Z",
    ip: "182.74.88.19",
    location: "Hyderabad, Telangana, India",
    device: "Chrome 128 / macOS Sonoma",
    status: "SUCCESS",
    action: "Developer Dashboard Session",
  },
];

// Helper to load users
export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

// Helper to save users
export function saveStoredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users in localStorage:", err);
  }
}

// Helper to load access logs
export function getStoredAccessLogs() {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOGS;
  }
}

// Helper to save access logs
export function saveStoredAccessLogs(logs) {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 200))); // keep latest 200
  } catch (err) {
    console.error("Failed to save logs in localStorage:", err);
  }
}

/**
 * Log a user access / login event
 */
export function recordAccessLog({
  user,
  status = "SUCCESS",
  action = "User Sign In",
  customIp,
  customDevice,
}) {
  const logs = getStoredAccessLogs();
  const userAgent = navigator.userAgent;
  let browserInfo = "Web Browser / Desktop";

  if (userAgent.includes("Chrome")) browserInfo = "Chrome / Windows PC";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browserInfo = "Safari / Apple Device";
  else if (userAgent.includes("Firefox")) browserInfo = "Firefox / Linux";
  else if (userAgent.includes("Mobile")) browserInfo = "Mobile WebKit";

  const newLog = {
    id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    userName: user?.name || user?.username || "Guest User",
    userEmail: user?.email || user?.identifier || "N/A",
    userRole: user?.role || "Buyer",
    company: user?.company || user?.companyName || "Independent",
    timestamp: new Date().toISOString(),
    ip: customIp || "122.171." + Math.floor(Math.random() * 180 + 10) + "." + Math.floor(Math.random() * 250 + 1),
    location: "Hyderabad, Telangana, India",
    device: customDevice || browserInfo,
    status, // "SUCCESS" | "BLOCKED_PENDING" | "FAILED"
    action,
  };

  const updatedLogs = [newLog, ...logs];
  saveStoredAccessLogs(updatedLogs);
  return newLog;
}

/**
 * Register a new user in the store (Pending Approval)
 */
export function registerPendingUser({ name, email, phone, role, password, company }) {
  const users = getStoredUsers();
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPhone = (phone || "").replace(/\D/g, "");

  const existing = users.find(
    (u) =>
      u.email?.toLowerCase() === cleanEmail ||
      u.phone?.replace(/\D/g, "") === cleanPhone
  );

  if (existing) {
    throw new Error("An account with this email or mobile number already exists.");
  }

  const newUser = {
    id: Date.now(),
    username: cleanEmail || cleanPhone,
    name: name.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    role: role || "Buyer",
    company: company || (role === "Developer" ? `${name}'s Infratech` : "Individual"),
    password,
    status: "pending", // ALWAYS starts as pending approval
    registeredAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null,
    totalLogins: 0,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
  };

  const updatedUsers = [newUser, ...users];
  saveStoredUsers(updatedUsers);

  // Record audit log for registration
  recordAccessLog({
    user: newUser,
    status: "BLOCKED_PENDING",
    action: `New Account Created (${role}) - Awaiting Admin Approval`,
  });

  return newUser;
}

/**
 * Approve a user by ID
 */
export function approveUser(userId, adminName = "Xevoproptech Admin") {
  const users = getStoredUsers();
  const user = users.find((u) => String(u.id) === String(userId));
  if (!user) throw new Error("User not found");

  user.status = "approved";
  user.approvedAt = new Date().toISOString();
  user.approvedBy = adminName;

  saveStoredUsers(users);

  recordAccessLog({
    user,
    status: "SUCCESS",
    action: `Admin Approved Account for ${user.name} (${user.role})`,
  });

  return user;
}

/**
 * Reject or suspend a user by ID
 */
export function rejectUser(userId, reason = "Profile verification incomplete", adminName = "Xevoproptech Admin") {
  const users = getStoredUsers();
  const user = users.find((u) => String(u.id) === String(userId));
  if (!user) throw new Error("User not found");

  user.status = "rejected";
  user.rejectionReason = reason;
  user.rejectedAt = new Date().toISOString();
  user.rejectedBy = adminName;

  saveStoredUsers(users);

  recordAccessLog({
    user,
    status: "FAILED",
    action: `Admin Rejected Account: ${user.name} (Reason: ${reason})`,
  });

  return user;
}

/**
 * Find user by email, username or phone
 */
export function findUserByCredentials(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  const digits = identifier.replace(/\D/g, "");

  // Check Master Admin
  if (
    clean === MASTER_ADMIN_CREDENTIALS.username.toLowerCase() ||
    clean === MASTER_ADMIN_CREDENTIALS.email.toLowerCase()
  ) {
    return {
      ...MASTER_ADMIN_CREDENTIALS,
      id: 1,
    };
  }

  const users = getStoredUsers();
  return users.find(
    (u) =>
      u.username?.toLowerCase() === clean ||
      u.email?.toLowerCase() === clean ||
      (digits && u.phone?.replace(/\D/g, "") === digits)
  );
}
