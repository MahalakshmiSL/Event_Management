import { useState, useEffect } from "react";
import { eventsApi } from "../api";
import { EventCard } from "../components/home/EventsPreview";
import { Star } from "lucide-react";

const Premium = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventsApi
      .getAll({ isPremium: true, limit: 9 })
      .then((res) => setEvents(res.data.data?.events || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-dark-2 pt-24 pb-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-primary flex items-center justify-center">
          <Star size={22} className="text-primary" fill="currentColor" />
        </div>

        <h1 className="font-serif text-4xl font-bold text-white mb-2">
          Premium Events
        </h1>

        <p className="text-gray-400 text-sm">
          Exclusive access to world-class medical conferences
        </p>
      </div>

      {/* Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <p className="text-center text-gray-400 py-20">
            No premium events available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Premium;