import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="newsletter-card"
        >
          <div className="newsletter-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <Mail size={13} style={{ color: "#c4a87a" }} />
              <span className="font-mono newsletter-tag">Newsletter</span>
            </div>
            <h3 className="font-display newsletter-title">
              Get fitness tips weekly.
            </h3>
            <p className="newsletter-desc">
              No spam. Just real, actionable fitness insights from our AI coach.
            </p>
          </div>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="your@email.com"
              className="newsletter-input"
            />
            <button className="newsletter-btn">
              Subscribe
              <ArrowUpRight size={13} />
            </button>
          </div>
        </motion.div>

        <div className="footer-links-grid">
          <div className="footer-brand">
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span className="font-display footer-brand-name">TALISHFITS</span>
              <span className="font-mono footer-brand-tag">
                AI FITNESS COACH
              </span>
            </Link>
            <p className="footer-brand-desc">
              AI-powered fitness platform that builds the body you want. Train
              smarter. Live better.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Workouts", "Nutrition", "Pricing"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Blog", "Contact"],
            },
            { title: "Legal", links: ["Terms", "Privacy", "Cookies"] },
          ].map((col) => (
            <div key={col.title} className="footer-col">
              <h4 className="font-mono footer-col-title">{col.title}</h4>
              <ul className="footer-col-list">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="font-mono footer-copy">
            TalishFits 2024 · All Rights Reserved
          </p>
          <div className="footer-socials">
            {["Twitter", "Instagram", "YouTube", "LinkedIn"].map((s) => (
              <a key={s} href="#" className="footer-social-link font-mono">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: #0d3d35;
          color: #f5f3ee;
          padding: 4rem 0 1.5rem 0;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .newsletter-card {
          padding: 1.5rem;
          background: #1a5d52;
          border-radius: 16px;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .newsletter-content {
          flex: 1;
          min-width: 0;
        }

        .newsletter-tag {
          font-size: 10px;
          color: #c4a87a;
          letter-spacing: 0.25em;
          font-weight: 700;
          text-transform: uppercase;
        }

        .newsletter-title {
          font-size: 1.5rem;
          color: #f5f3ee;
          margin-bottom: 8px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .newsletter-desc {
          font-size: 12px;
          color: rgba(245, 243, 238, 0.6);
          font-family: Inter;
          line-height: 1.6;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .newsletter-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: rgba(245, 243, 238, 0.06);
          border: 1px solid rgba(245, 243, 238, 0.15);
          color: #f5f3ee;
          border-radius: 9999px;
          font-family: Inter;
          font-size: 14px;
          outline: none;
          min-height: 44px;
          -webkit-appearance: none;
        }

        .newsletter-input::placeholder {
          color: rgba(245, 243, 238, 0.4);
        }

        .newsletter-input:focus {
          border-color: #c4a87a;
          background: rgba(245, 243, 238, 0.1);
        }

        .newsletter-btn {
          padding: 0.875rem 1.5rem;
          background: #c4a87a;
          color: #0d3d35;
          border: none;
          border-radius: 9999px;
          font-family: Inter;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          min-height: 44px;
          transition: all 0.3s;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(196, 168, 122, 0.3);
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem 1.5rem;
          margin-bottom: 3rem;
        }

        .footer-brand {
          grid-column: 1 / -1;
          margin-bottom: 1rem;
        }

        .footer-brand-name {
          font-size: 1.25rem;
          color: #f5f3ee;
          letter-spacing: 0.05em;
          line-height: 1;
        }

        .footer-brand-tag {
          font-size: 8px;
          color: rgba(245, 243, 238, 0.4);
          letter-spacing: 0.3em;
          margin-top: 4px;
          font-weight: 600;
        }

        .footer-brand-desc {
          font-size: 12px;
          color: rgba(245, 243, 238, 0.5);
          font-family: Inter;
          line-height: 1.7;
          margin-top: 1rem;
          max-width: 280px;
        }

        .footer-col-title {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c4a87a;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .footer-col-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link {
          font-size: 13px;
          color: rgba(245, 243, 238, 0.55);
          font-family: Inter;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-link:hover {
          color: #f5f3ee;
        }

        .footer-bottom {
          border-top: 1px solid rgba(245, 243, 238, 0.08);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .footer-copy {
          font-size: 9px;
          color: rgba(245, 243, 238, 0.3);
          letter-spacing: 0.2em;
          font-weight: 600;
          text-transform: uppercase;
        }

        .footer-socials {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .footer-social-link {
          font-size: 9px;
          color: rgba(245, 243, 238, 0.4);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 600;
          transition: color 0.3s;
        }

        .footer-social-link:hover {
          color: #c4a87a;
        }

        @media (min-width: 480px) {
          .footer-container {
            padding: 0 1.5rem;
          }

          .newsletter-card {
            padding: 2rem;
          }

          .newsletter-title {
            font-size: 1.75rem;
          }

          .newsletter-desc {
            font-size: 13px;
          }

          .footer-brand-name {
            font-size: 1.5rem;
          }

          .footer-bottom {
            flex-direction: row;
            align-items: center;
          }
        }

        @media (min-width: 640px) {
          .newsletter-form {
            flex-direction: row;
          }

          .newsletter-btn {
            width: auto;
            flex-shrink: 0;
          }

          .footer-links-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 2.5rem;
          }

          .footer-brand {
            grid-column: auto;
            margin-bottom: 0;
          }
        }

        @media (min-width: 768px) {
          .footer-section {
            padding: 5rem 0 2rem 0;
          }

          .footer-container {
            padding: 0 2rem;
          }

          .newsletter-card {
            flex-direction: row;
            align-items: center;
            padding: 2.5rem;
          }

          .newsletter-form {
            flex: 0 0 360px;
          }
        }

        @media (min-width: 1024px) {
          .footer-section {
            padding: 6rem 0 2rem 0;
          }

          .footer-container {
            padding: 0 3rem;
          }

          .newsletter-card {
            padding: 3rem;
            margin-bottom: 5rem;
          }

          .footer-links-grid {
            margin-bottom: 4rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
