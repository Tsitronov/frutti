import Navbar from "../UI/navbar/Navbar";
import { NavLink } from "react-router-dom";

const SulSito = () => {
  return (
    <div className="main-container-sito">
      <Navbar />

      <section className="hero-sito">
        <img
          src="./avatar.png"
          alt="Avatar del team"
          loading="lazy"
          width="80"
          crossOrigin="anonymous"
          className="hero-avatar"
        />
        <div className="hero-content">
          <h1 className="hero-title">Sistema CRM per Assistenza</h1>
          <p className="hero-subtitle">Gestione personalizzata per gruppi vulnerabili</p>
          <NavLink to="/login" className="cta-hero-btn">Accedi al sistema →</NavLink>
        </div>
      </section>

      <div className="features-grid">
        <div className="feature-card">
          <span>🏥</span>
          <p>Istituzioni</p>
        </div>
        <div className="feature-card">
          <span>🏠</span>
          <p>Famiglie</p>
        </div>
        <div className="feature-card">
          <span>👩‍⚕️</span>
          <p>Badanti private</p>
        </div>
      </div>

      <p className="intro-text-sito">
        Sistema specializzato per la gestione dell'assistenza a gruppi vulnerabili —
        alimentazione, igiene, autonomia. Ideale per strutture che necessitano di monitoraggio
        quotidiano senza complessi software EHR.
      </p>

      <h2 className="section-title-sito">Istituzioni</h2>
      <ul className="description-list-sito">
        <li><strong>Case di riposo e ospizi</strong> — distribuzione per reparti, monitoraggio delle esigenze quotidiane.</li>
        <li><strong>Centri di riabilitazione</strong> — tracciamento riabilitazione e autonomia del paziente.</li>
        <li><strong>Servizi sociali / ONG</strong> — coordinazione per programmi di assistenza.</li>
      </ul>

      <h2 className="section-title-sito">Privati</h2>
      <ul className="description-list-sito">
        <li><strong>Famiglie con parenti anziani</strong> — gestione semplice per assistenza domiciliare.</li>
        <li><strong>Badanti e caregiver</strong> — aggiornamento dati in tempo reale con permessi.</li>
      </ul>

      <div className="stat-block-sito">
        <p>
          Secondo Eurostat, entro il 2050 il numero di persone over 65 raggiungerà
          <strong> 134,5 milioni</strong> — circa il 30% della popolazione UE.
          Soluzioni semplici di tracciamento sono sempre più necessarie.
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
        <p>Hai bisogno di personalizzazioni?</p>
        <a href="mailto:tsitronov2017@gmail.com" className="cta-button-sito">
          Scrivimi 📬
        </a>
      </div>

    </div>
  );
};

export default SulSito;
