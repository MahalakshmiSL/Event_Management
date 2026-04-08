import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  // ← new
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");  // ← clear previous error

    try {
      const res = await authApi.login(form);
      const { user, token } = res.data.data;
      setAuth(user, token);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError("No account found with this email or password is incorrect.");
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-96 shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={(e) => { setError(""); setForm({ ...form, email: e.target.value }); }}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={(e) => { setError(""); setForm({ ...form, password: e.target.value }); }}
          />

          {/* ── Inline error message ── */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded p-2 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-sm mt-3">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;