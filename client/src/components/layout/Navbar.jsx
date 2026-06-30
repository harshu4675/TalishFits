import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "About Us", href: "#features" },
  { label: "Workouts", href: "#workouts" },
  { label: "How It Works", href: "#ai-features" },
  { label: "Contact Us", href: "#faq" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">
          <div className="navbar-inner">
            <Link to="/" className="navbar-logo">
              <span className="font-display navbar-logo-name">TALISHFITS</span>
              <span className="font-mono navbar-logo-tag">
                AI FITNESS COACH
              </span>
            </Link>

            <nav className="navbar-nav hidden lg:flex">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="navbar-link"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="navbar-actions hidden lg:flex">
              <button
                onClick={() => navigate("/login")}
                className="navbar-signin"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="btn-primary navbar-cta"
              >
                Get Started
                <ArrowRight size={13} />
              </button>
            </div>

            <button
              className="navbar-toggle lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-content">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="font-display mobile-menu-link"
                >
                  {link.label}
                </motion.button>
              ))}

              <div className="mobile-menu-actions">
                <button
                  className="btn-primary"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/signup");
                  }}
                  style={{ width: "100%" }}
                >
                  Get Started
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                  style={{ width: "100%" }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(232, 235, 229, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(13, 61, 53, 0.08);
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 1rem;
        }

        .navbar-logo {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .navbar-logo-name {
          font-size: 1.125rem;
          color: #0d3d35;
          letter-spacing: 0.05em;
          line-height: 1;
        }

        .navbar-logo-tag {
          font-size: 7px;
          color: #6b7068;
          letter-spacing: 0.3em;
          margin-top: 2px;
          font-weight: 600;
        }

        .navbar-nav {
          display: none;
          align-items: center;
          gap: 2.5rem;
        }

        .navbar-link {
          font-size: 11px;
          font-family: Inter;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0d3d35;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.3s;
          padding: 0;
        }

        .navbar-link:hover {
          color: #c4a87a;
        }

        .navbar-actions {
          display: none;
          align-items: center;
          gap: 1rem;
        }

        .navbar-signin {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #0d3d35;
          font-family: Inter;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.5rem 1rem;
          transition: color 0.3s;
        }

        .navbar-signin:hover {
          color: #c4a87a;
        }

        .navbar-cta {
          padding: 0.5rem 1.25rem !important;
          font-size: 11px !important;
          white-space: nowrap;
        }

        .navbar-toggle {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: #0d3d35;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-right: -6px;
        }

        .mobile-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #e8ebe5;
          z-index: 40;
          overflow-y: auto;
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          min-height: 100%;
        }

        .mobile-menu-link {
          font-size: 1.75rem;
          color: #0d3d35;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0.75rem 0;
          letter-spacing: -0.02em;
          border-bottom: 1px solid rgba(13, 61, 53, 0.06);
        }

        .mobile-menu-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 2rem;
          padding-bottom: 2rem;
        }

        @media (min-width: 480px) {
          .navbar-container {
            padding: 0 1.5rem;
          }

          .navbar-logo-name {
            font-size: 1.25rem;
          }

          .navbar-logo-tag {
            font-size: 8px;
          }

          .mobile-menu-link {
            font-size: 2rem;
          }
        }

        @media (min-width: 768px) {
          .navbar-container {
            padding: 0 2rem;
          }

          .navbar-inner {
         
            height: 72px;
          }
        }

        @media (min-width: 1024px) {
          .navbar-container {
            padding: 0 3rem;
          }

          .navbar-inner {
            height: 80px;
          }

          .navbar-logo-name {
            font-size: 1.5rem;
          }

          .navbar-nav {
            display: flex;
          }

          .navbar-actions {
            display: flex;
          }

          .navbar-toggle {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
