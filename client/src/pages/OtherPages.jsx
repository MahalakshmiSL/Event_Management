// ════════════════════════════════════════════════════
//  Gallery.jsx
// ════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { galleryApi } from "../api";

export const Gallery = () => {
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [category, setCategory] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const CATS = ["", "conference", "workshop", "ceremony", "exhibition", "general"];

  useEffect(() => {
    setLoading(true);
    galleryApi.getAll({ category, limit: 20 })
      .then((res) => setImages(res.data.data?.images || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-2 pt-24 pb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-white mb-2">Event Gallery</h1>
        <p className="text-gray-400 text-sm">Moments captured from our global medical conferences</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full text-xs font-medium capitalize transition-all border ${
                category === c
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary"
              }`}>
              {c || "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img._id} onClick={() => setLightbox(img)}
                className="gallery-item relative rounded-xl overflow-hidden h-48 cursor-pointer group">
                <img src={img.imageUrl} alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="gallery-overlay absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div className="max-w-3xl w-full">
            <img src={lightbox.imageUrl} alt={lightbox.caption} className="w-full rounded-xl" />
            {lightbox.caption && <p className="text-white text-center mt-3 text-sm">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════
//  Contact.jsx
// ════════════════════════════════════════════════════
import { contactApi } from "../api";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

export const Contact = () => {
  const [form, setForm]       = useState({ name: "", email: "", specialty: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.submit(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", specialty: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-2 pt-24 pb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-gray-400 text-sm">Get in touch with our team</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="font-serif text-2xl font-semibold text-dark mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Dr. John Smith" },
                { label: "Email",     key: "email", type: "email", placeholder: "john@hospital.com" },
                { label: "Specialty", key: "specialty", type: "text", placeholder: "Cardiology" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Message</label>
                <textarea rows={4} placeholder="Your message..."
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                <Send size={14} /> {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-dark mb-6">Get in Touch</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Have questions about our events or premium membership? Our team is here to help you
              connect with the right medical conferences worldwide.
            </p>
            {[
              { icon: Phone, label: "Phone", value: "+223 654 345 1274" },
              { icon: Mail,  label: "Email", value: "info@eventsphere.com" },
              { icon: MapPin,label: "Address", value: "5664 Smithfield Avenue, Bengaluru, Karnataka 78989" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-cream-2 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-dark">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════
//  Premium.jsx
// ════════════════════════════════════════════════════
import { eventsApi } from "../api";
import { EventCard } from "../components/home/EventsPreview";
import { Star } from "lucide-react";

export const Premium = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventsApi.getAll({ isPremium: true, limit: 9 })
      .then((res) => setEvents(res.data.data?.events || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-2 pt-24 pb-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-primary flex items-center justify-center">
          <Star size={22} className="text-primary" fill="currentColor" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-white mb-2">Premium Events</h1>
        <p className="text-gray-400 text-sm">Exclusive access to world-class medical conferences</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
        {events.length === 0 && (
          <p className="text-center text-gray-400 py-20">No premium events available yet.</p>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════
//  Login.jsx
// ════════════════════════════════════════════════════
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import useAuthStore from "../store/authStore";

export const Login = () => {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setAuth }           = useAuthStore();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-16">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-dark">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your EventSphere account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <input type="email" required placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Password</label>
            <input type="password" required placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium">Register</Link>
        </p>
        <div className="mt-4 p-3 bg-cream rounded-xl text-xs text-gray-500 text-center">
          Test: <b>user@eventsphere.com</b> / <b>User@123</b><br/>
          Admin: <b>admin@eventsphere.com</b> / <b>Admin@123</b>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════
//  Register.jsx
// ════════════════════════════════════════════════════
export const Register = () => {
  const [form, setForm]       = useState({ name: "", email: "", password: "", specialty: "General" });
  const [loading, setLoading] = useState(false);
  const { setAuth }           = useAuthStore();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-16">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-dark">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join EventSphere today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Dr. Jane Smith" },
            { label: "Email",     key: "email", type: "email", placeholder: "jane@hospital.com" },
            { label: "Password",  key: "password", type: "password", placeholder: "Min 6 characters" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
              <input type={type} required placeholder={placeholder}
                value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Specialty</label>
            <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary bg-white">
              {["Cardiology","Ophthalmology","Dentistry","Neurology","General","Other"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
export default Gallery;