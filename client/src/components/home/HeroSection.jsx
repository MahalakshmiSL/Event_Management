import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { eventsApi } from "../../api";
import useCountdown from "../../hooks/useCountdown";

const CountdownBox = ({ value, label }) => (
  <div className="countdown-box rounded-lg px-4 py-3 text-center min-w-[70px]">
    <div className="text-3xl font-bold text-white font-serif">
      {String(value).padStart(2, "0")}
    </div>
    <div className="text-xs text-gray-300 uppercase tracking-wider mt-1">{label}</div>
  </div>
);

const HeroSection = () => {
  const [featured, setFeatured] = useState(null);
  const timeLeft = useCountdown(featured?.date || new Date(Date.now() + 86400000 * 100));

  useEffect(() => {
    eventsApi.getFeatured()
      .then((res) => setFeatured(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600')`,
        }}
      />
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-4 pt-24 pb-16">
        <p className="text-primary-light text-xs uppercase tracking-[0.3em] mb-4 font-medium">
          Corporate Medical Events
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6 max-w-3xl">
          Set Your Event In<br />Motion Today
        </h1>
        <a
  href="/#contact"
  className="btn-outline text-white border-white hover:bg-white hover:text-dark mb-16"
>
  Arrange Your Event
</a>

        {/* Countdown bar */}
        {featured && (
          <div className="w-full max-w-4xl bg-black bg-opacity-60 backdrop-blur-sm rounded-xl p-5
                          flex flex-col md:flex-row items-center justify-between gap-6 border border-white border-opacity-10">
            {/* Event info */}
            <div className="text-left">
              <h3 className="text-white font-serif font-semibold text-lg mb-2">{featured.title}</h3>
              <div className="flex items-center gap-2 text-gray-300 text-xs mb-1">
                <Calendar size={12} className="text-primary" />
                {new Date(featured.date).toDateString()}
              </div>
              {featured.endDate && (
                <div className="flex items-center gap-2 text-gray-300 text-xs">
                  <Calendar size={12} className="text-primary" />
                  Ends: {new Date(featured.endDate).toDateString()}
                </div>
              )}
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-3">
              <CountdownBox value={timeLeft.days}    label="Days"    />
              <CountdownBox value={timeLeft.hours}   label="Hours"   />
              <CountdownBox value={timeLeft.minutes} label="Minutes" />
              <CountdownBox value={timeLeft.seconds} label="Seconds" />
            </div>

            {/* CTA */}
            <Link to={`/events/${featured._id}`}
              className="btn-primary whitespace-nowrap text-sm px-5 py-2">
              Check More Details
            </Link>
          </div>
        )}
      </div>

      {/* Scroll indicator dots */}
      <div className="relative z-10 flex justify-center gap-2 pb-6">
        {[0,1,2].map((i) => (
          <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary" : "bg-white bg-opacity-40"}`} />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;