import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-2xl text-white font-bold mb-3">EventSphere</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex gap-3 mt-5">
  {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
    <a key={i} href="#"
      className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center
                 text-gray-400 hover:text-white hover:border-primary transition-all duration-200">
      <Icon size={14} />
    </a>
  ))}
</div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">About Us</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "About Us"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-gray-400 hover:text-primary-light transition-colors">
                    › {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Our Service</h3>
            <ul className="space-y-2 text-sm">
              {["Event", "Contact US"].map((item) => (
                <li key={item}>
                  <Link to="/events" className="text-gray-400 hover:text-primary-light transition-colors">
                    › {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <Phone size={14} className="mt-0.5 text-primary shrink-0" />
                +223 654 345 1274
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Mail size={14} className="mt-0.5 text-primary shrink-0" />
                info@eventsphere.com
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={14} className="mt-0.5 text-primary shrink-0" />
                5664 Smithfield Avenue, Bengaluru, Karnataka 78989
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-3">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} EventSphere. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;