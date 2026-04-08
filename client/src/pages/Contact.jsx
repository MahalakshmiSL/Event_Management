//  Contact.jsx
// ════════════════════════════════════════════════════
import { contactApi } from "../api";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
 const Contact = () => {
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
export default Contact;