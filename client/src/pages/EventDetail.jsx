import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Users, Star, ArrowLeft, CheckCircle } from "lucide-react";
import { eventsApi } from "../api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const EventDetail = () => {
  const { id }            = useParams();
  const { user }          = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [registered, setRegistered] = useState(false); // ← new

  useEffect(() => {
    eventsApi.getById(id)
      .then((res) => setEvent(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) return toast.error("Please login to register");
    setRegLoading(true);
    try {
      await eventsApi.register(id);
      setRegistered(true); // ← mark as registered
      toast.success("Successfully registered! Check your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen pt-24 text-center text-gray-400">Event not found.</div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      <div className="relative h-80 md:h-96">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute bottom-6 left-6">
          <Link to="/events" className="flex items-center gap-2 text-white text-sm hover:text-primary-light mb-3">
            <ArrowLeft size={16} /> Back to Events
          </Link>
          <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">{event.specialty}</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2 max-w-3xl">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-semibold text-dark mb-4">About This Event</h2>
            <p className="text-gray-500 leading-relaxed mb-8">{event.description}</p>

            {event.speakers?.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl font-semibold text-dark mb-6">Speakers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.speakers.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center
                                      text-white font-bold font-serif text-lg shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark text-sm">{s.name}</h3>
                        <p className="text-primary text-xs mb-1">{s.designation}</p>
                        <p className="text-gray-500 text-xs leading-relaxed">{s.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="font-serif text-xl font-semibold text-dark mb-5">Event Details</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-medium text-dark">{new Date(event.date).toDateString()}</p>
                  </div>
                </div>
                {event.time && (
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="text-sm font-medium text-dark">{event.time}</p>
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm font-medium text-dark">{event.location.venue}</p>
                      <p className="text-xs text-gray-500">{event.location.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Users size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Capacity</p>
                    <p className="text-sm font-medium text-dark">{event.maxAttendees} attendees</p>
                  </div>
                </div>
                {event.isPremium && (
                  <div className="flex items-center gap-2 bg-gold bg-opacity-10 rounded-lg px-3 py-2">
                    <Star size={14} className="text-gold" fill="currentColor" />
                    <span className="text-gold text-xs font-medium">Premium Event</span>
                  </div>
                )}
              </div>

              {/* ── Registration button / success state ── */}
              {registered ? (
                <div className="w-full bg-green-50 border border-green-200 rounded-xl py-4 px-4 flex flex-col items-center gap-2">
                  <CheckCircle size={28} className="text-green-500" />
                  <p className="text-green-700 font-semibold text-sm">You're Registered!</p>
                  <p className="text-green-500 text-xs text-center">
                    A confirmation has been sent to your email.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={regLoading}
                  className="btn-primary w-full text-center py-3 text-sm"
                >
                  {regLoading ? "Registering..." : "Register for this Event"}
                </button>
              )}

              {!user && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  <Link to="/login" className="text-primary">Login</Link> to register
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;