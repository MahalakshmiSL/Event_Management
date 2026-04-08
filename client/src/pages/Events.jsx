import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { eventsApi } from "../api";
import { EventCard } from "../components/home/EventsPreview";

const SPECIALTIES = ["All", "Cardiology", "Ophthalmology", "Dentistry", "Neurology", "General", "Technology"];

const Events = () => {
  const [events,     setEvents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [specialty,  setSpecialty]  = useState("All");
  const [page,       setPage]       = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search)               params.search    = search;
      if (specialty !== "All")  params.specialty = specialty;
      const res = await eventsApi.getAll(params);
      setEvents(res.data.data?.events || []);
      setPagination(res.data.data?.pagination || {});
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [page, specialty]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-dark-2 pt-24 pb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-white mb-2">Events</h1>
        <p className="text-gray-400 text-sm">
          By joining events subscription, you will get medical events taking place in a specific events.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search + Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 text-sm
                           focus:outline-none focus:border-primary bg-white"
              />
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
          </form>

          {/* Specialty filter pills */}
          <div className="flex gap-2 flex-wrap">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => { setSpecialty(s); setPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                  specialty === s
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Filter size={48} className="mx-auto mb-4 opacity-30" />
            <p>No events found. Try a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => <EventCard key={event._id} event={event} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                  page === i + 1
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;