import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", specialty: "" });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, password: form.password };
      if (form.specialty) payload.specialty = form.specialty;

      const res = await authApi.register(payload);
      const { user, token } = res.data.data;
      setAuth(user, token);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-96 shadow">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Name"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div>
            <input
              type="password"
              required
              placeholder="Password"
              className={`w-full p-2 border rounded ${
                form.password && form.password.length < 6 ? "border-red-400" : ""
              }`}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {form.password && form.password.length < 6 && (
              <p className="text-red-500 text-xs mt-1">
                Password must be at least 6 characters ({form.password.length}/6)
              </p>
            )}
          </div>

          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          >
            <option value="">Specialty (optional)</option>
            <option>Cardiology</option>
            <option>General</option>
          </select>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-sm mt-3">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;