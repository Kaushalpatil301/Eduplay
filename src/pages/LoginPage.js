import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") || "kid");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        // Navigate based on role from backend response
        if (result.role === "PARENT") {
          navigate("/parent/dashboard");
        } else if (result.role === "KID") {
          navigate("/kid/dashboard");
        }
      } else {
        setError(result.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={styles.formCard}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.header}
        >
          <motion.h1
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            style={styles.logo}
          >
            🎮
          </motion.h1>
          <h1 style={styles.title}>EduPlay</h1>
          <p style={styles.subtitle}>
            {role === "parent" ? "👨‍👩‍👧 Parent Login" : "🧒 Kid Login"}
          </p>
        </motion.div>

        {/* Role Toggle */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={styles.toggleContainer}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setRole("parent")}
            style={{
              ...styles.toggleBtn,
              background:
                role === "parent"
                  ? "linear-gradient(135deg, #FFB347 0%, #ff9a00 100%)"
                  : "#f5f5f5",
              color: role === "parent" ? "white" : "#666",
              boxShadow:
                role === "parent"
                  ? "0 6px 20px rgba(255, 179, 71, 0.4)"
                  : "none",
            }}
          >
            👨‍👩‍👧 Parent
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setRole("kid")}
            style={{
              ...styles.toggleBtn,
              background:
                role === "kid"
                  ? "linear-gradient(135deg, #00BFFF 0%, #0099cc 100%)"
                  : "#f5f5f5",
              color: role === "kid" ? "white" : "#666",
              boxShadow:
                role === "kid" ? "0 6px 20px rgba(0, 191, 255, 0.4)" : "none",
            }}
          >
            🧒 Kid
          </motion.button>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <div style={styles.inputGroup}>
            <label style={styles.label}>👤 Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔒 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.error}
            >
              ❌ {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background:
                role === "parent"
                  ? "linear-gradient(135deg, #FFB347 0%, #ff9a00 100%)"
                  : "linear-gradient(135deg, #00BFFF 0%, #0099cc 100%)",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "🔄 Logging in..." : "🚀 Login"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  formCard: {
    background: "white",
    borderRadius: "2rem",
    padding: "3rem",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    maxWidth: "480px",
    width: "100%",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  logo: {
    fontSize: "4rem",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#333",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#666",
    fontWeight: "600",
  },
  toggleContainer: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    padding: "0.5rem",
    background: "#f5f5f5",
    borderRadius: "1.2rem",
  },
  toggleBtn: {
    flex: 1,
    padding: "1rem",
    border: "none",
    borderRadius: "0.8rem",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "1rem 1.2rem",
    border: "2px solid #e0e0e0",
    borderRadius: "1rem",
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "1rem",
    borderRadius: "1rem",
    textAlign: "center",
    fontWeight: "600",
  },
  submitBtn: {
    padding: "1.2rem",
    border: "none",
    borderRadius: "1rem",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
  },
};

export default LoginPage;
