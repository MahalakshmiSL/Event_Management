import { Link } from "react-router-dom";
import { MapPin, Calendar, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { eventsApi } from "../../api";

// ── Single Event Card ─────────────────────────────────
export const EventCard = ({ event }) => {
  const d = new Date(event.date);
  return (
    <div className="card group">
      <div className="relative overflow-hidden h-44">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-primary text-white text-center rounded-lg px-3 py-1.5 leading-tight">
          <div className="text-xl font-bold font-serif">{d.getDate()}</div>
          <div className="text-xs uppercase">{d.toLocaleString("default", { month: "short" })}</div>
        </div>
        {event.isPremium && (
          <div className="absolute top-3 right-3 bg-gold text-white text-xs px-2 py-1 rounded-full font-medium">
            Premium
          </div>
        )}
      </div>

      <div className="p-4">
        <span className="text-xs text-primary font-medium uppercase tracking-wider">{event.specialty}</span>
        <h3 className="font-serif font-semibold text-dark text-base mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Calendar size={11} className="text-primary" />
            {d.toDateString()}
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <MapPin size={11} className="text-primary" />
              {event.location.venue}, {event.location.city}
            </div>
          )}
        </div>
        <Link to={`/events/${event._id}`} className="btn-primary text-xs px-4 py-2">
          View Details
        </Link>
      </div>
    </div>
  );
};

// ── Events Preview on Home Page ───────────────────────
const EventsPreview = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventsApi.getAll({ limit: 5 })
      .then((res) => setEvents(res.data.data?.events || []))
      .catch(() => {});
  }, []);

  if (!events.length) return null;

  const [main, ...rest] = events;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Events</h2>
          <p className="section-subtitle">
            By joining events subscription, you will get medical events taking place in a specific events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large featured card */}
          <div className="md:col-span-1 card group">
            <div className="relative overflow-hidden h-56">
              <img src={main.image} alt={main.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-primary text-white text-center rounded-lg px-3 py-1.5">
                <div className="text-xl font-bold font-serif">{new Date(main.date).getDate()}</div>
                <div className="text-xs uppercase">
                  {new Date(main.date).toLocaleString("default", { month: "short" })}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-serif font-semibold text-dark text-base mb-2 line-clamp-2">{main.title}</h3>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                <Calendar size={11} className="text-primary" />
                {new Date(main.date).toDateString()}
              </div>
              {main.location && (
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <MapPin size={11} className="text-primary" />
                  {main.location.venue}, {main.location.city}
                </div>
              )}
            </div>
          </div>

          {/* Grid of smaller cards */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {rest.map((event) => (
              <Link key={event._id} to={`/events/${event._id}`}
                className="relative rounded-xl overflow-hidden h-44 group">
                <img src={event.image} alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute top-2 left-2 bg-primary text-white text-center rounded-lg px-2 py-1 leading-tight">
                  <div className="text-base font-bold font-serif">{new Date(event.date).getDate()}</div>
                  <div className="text-xs uppercase">
                    {new Date(event.date).toLocaleString("default", { month: "short" })}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold line-clamp-2">{event.title}</p>
                  {event.location && (
                    <p className="text-gray-300 text-xs mt-0.5">{event.location.city}, {event.location.country}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/events" className="btn-primary">View More Events</Link>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;