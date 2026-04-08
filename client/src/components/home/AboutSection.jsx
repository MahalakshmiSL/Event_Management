import { Link } from "react-router-dom";

const AboutSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* Text */}
        <div>
          <h2 className="section-title">About<br />EventSphere</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            EventSphere (Continued Medical Education Awareness) is the largest network of medical
            communities that share about their events. From dental to medicine, doctor to nurse,
            workshops or more, we help people to find and participate in these international events.
          </p>
          <Link to="/about" className="btn-primary">Read More</Link>
        </div>

        {/* Images collage */}
        <div className="grid grid-cols-2 gap-3">
          <img
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400"
            alt="conference"
            className="rounded-xl w-full h-48 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400"
            alt="workshop"
            className="rounded-xl w-full h-48 object-cover mt-6"
          />
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
            alt="medical"
            className="rounded-xl w-full h-48 object-cover -mt-6"
          />
          <img
            src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400"
            alt="event"
            className="rounded-xl w-full h-48 object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;