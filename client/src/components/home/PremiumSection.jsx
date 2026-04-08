import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Clock, Star, Rocket, Users } from "lucide-react";
import { eventsApi } from "../../api";

// ── Premium Events Section ────────────────────────────
export const PremiumSection = () => {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    eventsApi.getAll({ isPremium: true, limit: 1 })
      .then((res) => setEvent(res.data.data?.events?.[0]))
      .catch(() => {});
  }, []);

  return (
    <section className="bg-dark-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Images */}
          <div className="grid grid-rows-2 h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
              alt="premium event"
              className="w-full h-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800"
              alt="premium conference"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="bg-dark-2 flex flex-col justify-center px-10 py-12">
            <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mb-6">
              <Star size={20} className="text-primary" fill="currentColor" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-white mb-6">Premium<br />Events</h2>

            {event && (
              <div>
                <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3">
                  {event.specialty} Conference
                </p>
                <h3 className="text-white font-semibold text-lg mb-3">{event.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                  {event.description}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Clock size={12} className="text-primary" />
                    Date: {new Date(event.date).toDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Clock size={12} className="text-primary" />
                    Timing: {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <MapPin size={12} className="text-primary" />
                      {event.location.venue}, {event.location.city}
                    </div>
                  )}
                </div>
                <Link to="/premium" className="btn-outline text-white border-white text-sm">
                  View All Premium Events
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Become a Member Section ───────────────────────────
export const MembershipSection = () => {
  const steps = [
    { icon: Star,   label: "Create",  desc: "Send us your premium event details"          },
    { icon: Rocket, label: "Boost",   desc: "We will boost your premium event on our website" },
    { icon: Users,  label: "Result",  desc: "You will see your premium event response"    },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="section-title">Become a premium member</h2>
        <p className="section-subtitle">
          By joining the premium subscription, you will get boost on the medical events
          taking place in a specific events.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-cream-2 flex items-center justify-center">
                <Icon size={28} className="text-primary" />
              </div>
              <h3 className="font-semibold text-dark text-lg mb-2">{label}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <Link to="/premium" className="btn-gold">Become a Premium</Link>
      </div>
    </section>
  );
};