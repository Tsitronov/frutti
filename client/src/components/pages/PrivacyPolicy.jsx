import Navbar from '../UI/navbar/Navbar';

const PrivacyPolicy = () => (
  <div className="main-container-sito">
    <Navbar />
    <div className="sito-inner" style={{ paddingTop: '7rem' }}>
      <h1 className="section-title-sito">Privacy Policy</h1>
      <p className="intro-text-sito" style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #888)' }}>
        Ultimo aggiornamento: {new Date().getFullYear()}
      </p>

      <h2 className="section-title-sito">1. Titolare del trattamento</h2>
      <p className="intro-text-sito">
        Il titolare del trattamento dei dati è il gestore del sistema CRM. Per informazioni:&nbsp;
        <a href="mailto:tsitronov2017@gmail.com">tsitronov2017@gmail.com</a>
      </p>

      <h2 className="section-title-sito">2. Dati raccolti</h2>
      <ul className="description-list-sito">
        <li>Credenziali di accesso (username, password cifrata) — necessarie per l'autenticazione.</li>
        <li>Dati degli utenti assistiti (nome, reparto, stanza, informazioni sanitarie) — inseriti dagli operatori autorizzati.</li>
        <li>Preferenza tema (chiaro/scuro) — salvata localmente nel browser, non trasmessa al server.</li>
      </ul>

      <h2 className="section-title-sito">3. Cookie e archiviazione locale</h2>
      <ul className="description-list-sito">
        <li><strong>Cookie di sessione (HttpOnly)</strong>: usati esclusivamente per l'autenticazione sicura. Non accessibili via JavaScript.</li>
        <li><strong>localStorage</strong>: salva preferenze UI (tema, ultimo reparto visualizzato). Nessun dato personale.</li>
        <li><strong>Nessun cookie di tracciamento</strong>, profilazione o marketing.</li>
      </ul>

      <h2 className="section-title-sito">4. Base giuridica (GDPR Art. 6)</h2>
      <ul className="description-list-sito">
        <li>Esecuzione di un contratto o misure precontrattuali (Art. 6.1.b) — per i dati di accesso.</li>
        <li>Legittimo interesse del titolare (Art. 6.1.f) — per log tecnici anonimi.</li>
        <li>Obbligo legale o tutela degli interessi vitali (Art. 6.1.c/d) — per i dati sanitari degli assistiti.</li>
      </ul>

      <h2 className="section-title-sito">5. Diritti degli interessati</h2>
      <p className="intro-text-sito">
        In conformità al GDPR (Artt. 15–22) hai diritto a: accesso, rettifica, cancellazione («diritto all'oblio»),
        limitazione del trattamento, portabilità, opposizione. Per esercitare i tuoi diritti scrivi a:&nbsp;
        <a href="mailto:tsitronov2017@gmail.com">tsitronov2017@gmail.com</a>
      </p>

      <h2 className="section-title-sito">6. Conservazione dei dati</h2>
      <p className="intro-text-sito">
        I dati vengono conservati per il tempo strettamente necessario alle finalità descritte, e comunque non oltre
        la cessazione del rapporto di assistenza o la richiesta di cancellazione da parte dell'interessato.
      </p>

      <h2 className="section-title-sito">7. Sicurezza</h2>
      <ul className="description-list-sito">
        <li>Comunicazioni cifrate via HTTPS/TLS.</li>
        <li>Token di accesso conservati esclusivamente in memoria (non in localStorage).</li>
        <li>Accesso ai dati protetto da autenticazione e controllo dei ruoli.</li>
      </ul>

      <div className="contact-block-sito" style={{ marginTop: '2rem' }}>
        <p>Domande sulla privacy?</p>
        <a href="mailto:tsitronov2017@gmail.com" className="cta-button-sito">Contattaci 📬</a>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
