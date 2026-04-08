import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { adminApi, eventsApi } from "../api";
import toast from "react-hot-toast";
import {
  LayoutDashboard, CalendarDays, Users, Mail,
  Plus, Pencil, Trash2, LogOut, Star, X, Save
} from "lucide-react";

// ── Event Form Modal ──────────────────────────────────
const EventFormModal = ({ event, onClose, onSaved }) => {
  const isEdit = !!event;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title:       event?.title       || "",
    description: event?.description || "",
    specialty:   event?.specialty   || "General",
    date:        event?.date ? event.date.slice(0, 10) : "",
    endDate:     event?.endDate ? event.endDate.slice(0, 10) : "",
    time:        event?.time        || "",
    image:       event?.image       || "",
    isPremium:   event?.isPremium   || false,
    isFeatured:  event?.isFeatured  || false,
    maxAttendees:event?.maxAttendees|| 500,
    status:      event?.status      || "upcoming",
    "location.venue":   event?.location?.venue   || "",
    "location.city":    event?.location?.city    || "",
    "location.country": event?.location?.country || "",
    "location.address": event?.location?.address || "",
    tags: event?.tags?.join(", ") || "",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title:        form.title,
        description:  form.description,
        specialty:    form.specialty,
        date:         form.date,
        endDate:      form.endDate || undefined,
        time:         form.time,
        imageUrl:        form.imageUrl,
        isPremium:    form.isPremium,
        isFeatured:   form.isFeatured,
        maxAttendees: Number(form.maxAttendees),
       
        location: {
          venue:   form["location.venue"],
          city:    form["location.city"],
          country: form["location.country"],
          address: form["location.address"],
        },
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };

      if (isEdit) {
        await eventsApi.update(event._id, payload);
        toast.success("Event updated successfully!");
      } else {
        await eventsApi.create(payload);
        toast.success("Event created successfully!");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const SPECIALTIES = ["Cardiology","Ophthalmology","Dentistry","Neurology","General","Technology"];
  const STATUSES    = ["upcoming","ongoing","completed","cancelled"];

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary bg-white";
  const labelCls = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-serif text-xl font-bold text-dark">
            {isEdit ? "Edit Event" : "Add New Event"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className={labelCls}>Event Title *</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="International Conference on Ophthalmology 2026"
              className={inputCls} />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description *</label>
            <textarea required rows={3} value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the event in detail..."
              className={`${inputCls} resize-none`} />
          </div>

          {/* Row: specialty + status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Specialty *</label>
              <select required value={form.specialty} onChange={(e) => set("specialty", e.target.value)}
                className={inputCls}>
                {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className={inputCls}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Row: date + endDate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start Date *</label>
              <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)}
                className={inputCls} />
            </div>
          </div>

          {/* Row: time + maxAttendees */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Time</label>
              <input value={form.time} onChange={(e) => set("time", e.target.value)}
                placeholder="9:00 AM – 6:00 PM" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Max Attendees</label>
              <input type="number" value={form.maxAttendees}
                onChange={(e) => set("maxAttendees", e.target.value)}
                className={inputCls} />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className={labelCls}>Image URL</label>
            <input value={form.image} onChange={(e) => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className={inputCls} />
            {form.image && (
              <img src={form.image} alt="preview"
                className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-100" />
            )}
          </div>

          {/* Location */}
          <div>
            <label className={labelCls}>Location</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "location.venue",   ph: "Venue name"  },
                { key: "location.city",    ph: "City"        },
                { key: "location.country", ph: "Country"     },
                { key: "location.address", ph: "Full address"},
              ].map(({ key, ph }) => (
                <input key={key} value={form[key]} onChange={(e) => set(key, e.target.value)}
                  placeholder={ph} className={inputCls} />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)}
              placeholder="ophthalmology, retina, AI diagnostics"
              className={inputCls} />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[
              { key: "isPremium",  label: "Premium Event"  },
              { key: "isFeatured", label: "Featured Event" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set(key, !form[key])}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
                    form[key] ? "bg-primary" : "bg-gray-200"
                  }`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    form[key] ? "left-6" : "left-1"
                  }`} />
                </div>
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="btn-primary flex items-center gap-2 py-2 px-6">
              <Save size={14} />
              {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
      <Icon size={22} className="text-white" />
    </div>
    <p className="text-3xl font-bold font-serif text-dark">{value ?? "—"}</p>
    <p className="text-sm text-gray-400 mt-1">{label}</p>
  </div>
);

// ── Main Admin Dashboard ──────────────────────────────
const AdminDashboard = () => {
  const { user, logout }    = useAuthStore();
  const navigate            = useNavigate();
  const [tab, setTab]       = useState("events");
  const [stats, setStats]   = useState(null);
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [modal, setModal]   = useState(null); // null | "add" | eventObject
  const [deleting, setDeleting] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Admin access only");
      navigate("/");
    }
  }, [user]);

  const loadStats = () =>
    adminApi.getStats()
      .then((r) => setStats(r.data.data))
      .catch(() => {});

  const loadEvents = () =>
    eventsApi.getAll({ limit: 50 })
      .then((r) => setEvents(r.data.data?.events || []))
      .catch(() => {});

  const loadContacts = () =>
    adminApi.getStats()
      .then((r) => setContacts(r.data.data?.recentContacts || []))
      .catch(() => {});

  const loadRegistrations = () =>
    adminApi.getRegistrations()
      .then((r) => setRegistrations(r.data.data || []))
      .catch(() => {});

  useEffect(() => {
    loadStats();
    loadEvents();
  }, []);

  useEffect(() => {
    if (tab === "contacts")      loadContacts();
    if (tab === "registrations") loadRegistrations();
  }, [tab]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await eventsApi.delete(id);
      toast.success("Event deleted");
      loadEvents();
      loadStats();
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleting(null);
    }
  };

  const sidebarItems = [
    { key: "events",        icon: CalendarDays, label: "Events"        },
    { key: "registrations", icon: Users,        label: "Registrations" },
    { key: "contacts",      icon: Mail,         label: "Contacts"      },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-dark min-h-screen flex flex-col fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-dark-3">
          <h1 className="font-serif text-xl font-bold text-white">EventSphere</h1>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
              tab === "overview" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-dark-3"
            }`}
          >
            <LayoutDashboard size={16} /> Overview
          </button>

          {sidebarItems.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                tab === key ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-dark-3"
              }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-medium">{user?.name}</p>
              <p className="text-gray-400 text-xs">Admin</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-xs py-2 transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-8">

        {/* ── Overview Tab ── */}
        {(tab === "overview" || tab === "") && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-dark mb-8">Dashboard Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
              <StatCard icon={CalendarDays} label="Total Events"         value={stats?.totalEvents}         color="bg-primary"      />
              <StatCard icon={CalendarDays} label="Upcoming Events"      value={stats?.upcomingEvents}      color="bg-blue-500"     />
              <StatCard icon={Users}        label="Total Users"          value={stats?.totalUsers}          color="bg-teal-500"     />
              <StatCard icon={Users}        label="Total Registrations"  value={stats?.totalRegistrations}  color="bg-purple-500"   />
              <StatCard icon={Mail}         label="Contact Messages"     value={stats?.totalContacts}       color="bg-orange-500"   />
              <StatCard icon={Star}         label="Subscribers"          value={stats?.totalSubscribers}    color="bg-gold"         />
            </div>

            {/* Recent contacts */}
            {stats?.recentContacts?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-dark mb-4">Recent Unread Messages</h3>
                <div className="space-y-3">
                  {stats.recentContacts.map((c) => (
                    <div key={c._id} className="flex items-start justify-between p-3 bg-cream rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-dark">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{c.message}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0 ml-4">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Events Tab ── */}
        {tab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-dark">Manage Events</h2>
              <button
                onClick={() => setModal("add")}
                className="btn-primary flex items-center gap-2 py-2 px-5"
              >
                <Plus size={16} /> Add Event
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Event</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Specialty</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Flags</th>
                    <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={event.image} alt={event.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <p className="font-medium text-dark text-sm line-clamp-1 max-w-[200px]">
                            {event.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-cream text-primary px-2 py-1 rounded-full font-medium">
                          {event.specialty}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          event.status === "upcoming"  ? "bg-blue-50 text-blue-600"  :
                          event.status === "ongoing"   ? "bg-green-50 text-green-600":
                          event.status === "completed" ? "bg-gray-100 text-gray-500" :
                          "bg-red-50 text-red-500"
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          {event.isPremium  && <span className="text-xs bg-gold bg-opacity-10 text-gold px-2 py-0.5 rounded-full">Premium</span>}
                          {event.isFeatured && <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-0.5 rounded-full">Featured</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal(event)}
                            className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                            title="Edit event"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            disabled={deleting === event._id}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                            title="Delete event"
                          >
                            {deleting === event._id
                              ? <span className="text-xs">...</span>
                              : <Trash2 size={15} />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        No events yet. Click "Add Event" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Registrations Tab ── */}
        {tab === "registrations" && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-dark mb-8">Registrations</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Event</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Specialty</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {registrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-dark">{reg.user?.name}</p>
                        <p className="text-xs text-gray-400">{reg.user?.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs max-w-[200px] line-clamp-2">
                        {reg.event?.title}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-cream text-primary px-2 py-1 rounded-full">
                          {reg.event?.specialty}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {registrations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">
                        No registrations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Contacts Tab ── */}
        {tab === "contacts" && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-dark mb-8">Contact Messages</h2>
            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c._id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-dark">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email} {c.specialty && `· ${c.specialty}`}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {!c.isRead && (
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">New</span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.message}</p>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-20 text-gray-400">No contact messages yet.</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Event Form Modal */}
      {modal && (
        <EventFormModal
          event={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { loadEvents(); loadStats(); }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;