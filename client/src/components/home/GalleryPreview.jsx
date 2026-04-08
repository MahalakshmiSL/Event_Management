import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, Send } from "lucide-react";
import { galleryApi, subscribeApi } from "../../api";
import toast from "react-hot-toast";

// ── Gallery Preview ───────────────────────────────────
export const GalleryPreview = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    galleryApi.getAll({ limit: 8 })
      .then((res) => setImages(res.data.data?.images || []))
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-dark-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
              <Image size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Event gallery</h2>
              <p className="text-gray-400 text-xs mt-0.5">
                By joining events subscription, you will get medical events.
              </p>
            </div>
          </div>
          <Link to="/gallery" className="btn-outline text-white border-white text-sm">
            View More Images
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img._id} className="gallery-item relative rounded-xl overflow-hidden h-44 group cursor-pointer">
              <img
                src={img.imageUrl}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="gallery-overlay absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-xs">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Subscribe Section ─────────────────────────────────
export const SubscribeSection = () => {
  const [form, setForm]       = useState({ fullName: "", email: "", specialty: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return toast.error("Email is required");
    setLoading(true);
    try {
      await subscribeApi.subscribe({ email: form.email, specialty: form.specialty });
      toast.success("Successfully subscribed! 🎉");
      setForm({ fullName: "", email: "", specialty: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-cream-2 relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full
                      border-[40px] border-cream opacity-60 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="section-title">Subscribe for upcoming events</h2>
        <p className="section-subtitle">
          By joining events subscription, you will get medical events taking place in a specific events.
        </p>

        <form onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-3 justify-center">
          <input
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 text-sm focus:outline-none
                       focus:border-primary bg-white w-full md:w-auto"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 text-sm focus:outline-none
                       focus:border-primary bg-white w-full md:w-auto"
          />
          <input
            type="text"
            placeholder="Specialty"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 text-sm focus:outline-none
                       focus:border-primary bg-white w-full md:w-auto"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3 whitespace-nowrap flex items-center gap-2"
          >
            {loading ? "..." : <><Send size={14} /> Submit</>}
          </button>
        </form>
      </div>
    </section>
  );
};