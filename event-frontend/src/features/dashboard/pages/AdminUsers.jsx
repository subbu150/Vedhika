import { useEffect, useState, useMemo } from "react";
import { getUsers, deleteUser, updateUserRole } from "../../dashboard/api/userApi";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Feedback States
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }
  const [successId, setSuccessId] = useState(null); // ID of the user just updated

  const navigate = useNavigate();

  const theme = {
    bg: "#020617",
    card: "#0f172a",
    accent: "#38bdf8",
    textMain: "#f8fafc",
    textMuted: "#94a3b8",
    border: "rgba(255,255,255,0.08)",
    danger: "#ef4444",
    success: "#22c55e",
    ghost: "rgba(255,255,255,0.03)"
  };

  useEffect(() => {
    loadUsers();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper to show temporary notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      
      // Trigger Visual Feedback
      setSuccessId(id); 
      showToast(`Role updated to ${role.toUpperCase()}`);
      
      // Refresh data and clear glow after 2 seconds
      loadUsers();
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return users.filter(u => u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query));
  }, [users, searchQuery]);

  const styles = {
    wrapper: { backgroundColor: theme.bg, color: theme.textMain, minHeight: "100vh", padding: isMobile ? "20px" : "40px", fontFamily: "'Inter', sans-serif" },
    container: { width: "100%", maxWidth: "1000px", margin: "0 auto" },
    searchBar: { width: "100%", padding: "14px 20px", borderRadius: "12px", border: `1px solid ${theme.border}`, backgroundColor: theme.ghost, color: theme.textMain, marginBottom: "30px", outline: "none" },
    
    // Dynamic Card Glow logic
    card: (id) => ({
      background: theme.card, borderRadius: "16px", padding: "20px", marginBottom: "12px",
      border: `1px solid ${successId === id ? theme.success : theme.border}`,
      boxShadow: successId === id ? `0 0 20px rgba(34, 197, 94, 0.2)` : "none",
      transition: "all 0.4s ease",
      display: isMobile ? "block" : "grid",
      gridTemplateColumns: "2fr 2fr 1.5fr 1fr",
      alignItems: "center", gap: "15px"
    }),

    toast: {
      position: "fixed", bottom: "30px", right: "30px", padding: "12px 24px",
      borderRadius: "12px", backgroundColor: toast?.type === "error" ? theme.danger : theme.success,
      color: "#fff", fontWeight: "700", boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
      zIndex: 1000, animation: "slideUp 0.3s ease-out"
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Toast Notification Pop-up */}
      {toast && <div style={styles.toast}>{toast.message}</div>}

      <div style={styles.container}>
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "900", margin: 0 }}>User<span style={{ color: theme.accent }}>.</span>control</h1>
          <p style={{ color: theme.textMuted, fontSize: "14px" }}>Admin Authority Panel</p>
        </header>

        <input 
          type="text" placeholder="Search accounts..." 
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
          style={styles.searchBar} 
        />

        {loading && users.length === 0 ? <p>Loading...</p> : (
          filteredUsers.map(u => (
            <div key={u._id} style={styles.card(u._id)}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: successId === u._id ? theme.success : theme.accent, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", transition: "all 0.4s" }}>
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: "600" }}>{u.name}</span>
              </div>

              <div style={{ color: theme.textMuted, fontSize: "14px" }}>{u.email}</div>

              <div>
                <select 
                  value={u.role} 
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  style={{ backgroundColor: theme.bg, color: theme.textMain, border: `1px solid ${theme.border}`, padding: "6px", borderRadius: "8px", outline: "none" }}
                >
                  <option value="participant">Participant</option>
                  <option value="organizer">Organizer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ padding: "8px 12px", borderRadius: "8px", border: `1px solid ${theme.border}`, background: "none", color: theme.textMain, cursor: "pointer" }} onClick={() => navigate(`/dashboard/users/${u._id}`)}>Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}