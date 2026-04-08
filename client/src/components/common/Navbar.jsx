import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import useAuthStore from "../../store/authStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowDropdown(false);
  };

  // Navigation Links
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/events", label: "Events" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/#contact", label: "Contact Us" },
  ];

  // Contact Scroll Handler
  const handleContactClick = (e) => {
    e.preventDefault();
    navigate("/#contact");

    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);

    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-scrolled" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="font-serif text-2xl font-bold text-white">
            EventSphere
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.to.includes("#") ? (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={handleContactClick}
                  className="text-sm text-gray-200 hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm ${
                      isActive
                        ? "text-primary-light font-medium"
                        : "text-gray-200 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">

            {/* 🔥 ADMIN DASHBOARD BUTTON */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="btn-outline text-sm px-4 py-2 text-white border-white hover:bg-white hover:text-dark"
              >
                Dashboard
              </Link>
            )}

            {/* USER / LOGIN */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-white text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name?.split(" ")[0]}
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl z-50">

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
                      >
                        <LayoutDashboard size={14} />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-200 text-sm">
                Login
              </Link>
            )}

            {/* Premium */}
            <Link to="/premium" className="btn-primary text-sm px-5 py-2">
              Premium
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-2 border-t border-dark-3 px-4 py-4 space-y-3">
          {navLinks.map((link) =>
            link.to.includes("#") ? (
              <a
                key={link.to}
                href={link.to}
                onClick={handleContactClick}
                className="block text-gray-200"
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block text-gray-200"
              >
                {link.label}
              </NavLink>
            )
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-white"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="text-red-400">
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;