import Navbar from "../UI/navbar/Navbar";
import { NavLink } from "react-router-dom";

const SulSito = () => {
  return (
    <div className="main-container-sito">
      <Navbar />
      <div className="sito-inner">

        <section className="hero-sito">
          <img
            src="./avatar.png"
            alt="CareTrack team"
            loading="lazy"
            width="80"
            crossOrigin="anonymous"
            className="hero-avatar"
          />
          <div className="hero-content">
            <h1 className="hero-title">CRM for Care Management</h1>
            <p className="hero-subtitle">Personalized tracking for vulnerable individuals</p>
            <NavLink to="/login" className="cta-hero-btn">Sign In →</NavLink>
          </div>
        </section>

        <div className="features-grid">
          <a className="feature-card" href="#institutions">
            <span>🏥</span>
            <p>Institutions</p>
          </a>
          <a className="feature-card" href="#individuals">
            <span>🏠</span>
            <p>Families</p>
          </a>
          <a className="feature-card" href="#individuals">
            <span>👩‍⚕️</span>
            <p>Caregivers</p>
          </a>
        </div>

        <p className="intro-text-sito">
          A specialized platform for managing care of vulnerable individuals —
          nutrition, hygiene, mobility. Ideal for facilities that need daily monitoring
          without the complexity of full EHR systems.
        </p>

        <h2 id="institutions" className="section-title-sito">Institutions</h2>
        <ul className="description-list-sito">
          <li><strong>Nursing homes &amp; care facilities</strong> — ward-based organization, daily needs tracking.</li>
          <li><strong>Rehabilitation centers</strong> — patient mobility and rehabilitation progress monitoring.</li>
          <li><strong>Social services / NGOs</strong> — coordination for community care programs.</li>
        </ul>

        <h2 id="individuals" className="section-title-sito">Individuals</h2>
        <ul className="description-list-sito">
          <li><strong>Families with elderly relatives</strong> — simple home care management.</li>
          <li><strong>Private caregivers</strong> — real-time data updates with role-based access.</li>
        </ul>

        <div className="stat-block-sito">
          <p>
            According to Eurostat, by 2050 the number of people aged 65+ will reach
            <strong> 134.5 million</strong> — approximately 30% of the EU population.
            Simple, effective care-tracking solutions are increasingly essential.
          </p>
        </div>

        <div className="video-block-sito">
          <iframe
            width="100%"
            height="460"
            src="https://www.youtube-nocookie.com/embed/Mb68k4-_tLU"
            title="Demo video"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            loading="lazy"
            style={{ border: 0, borderRadius: '12px' }}
          />
        </div>

        <div className="contact-block-sito">
          <p>Need a custom solution?</p>
          <a href="mailto:tsitronov2017@gmail.com" className="cta-button-sito">
            Contact Us 📬
          </a>
        </div>

        <footer className="footer-sito">
          <NavLink to="/privacy">Privacy Policy</NavLink>
          <span>·</span>
          <NavLink to="/terms">Terms &amp; Conditions</NavLink>
          <span>·</span>
          <a href="mailto:tsitronov2017@gmail.com">tsitronov2017@gmail.com</a>
          <span>·</span>
          <span>© {new Date().getFullYear()} CareTrack</span>
        </footer>

      </div>
    </div>
  );
};

export default SulSito;
