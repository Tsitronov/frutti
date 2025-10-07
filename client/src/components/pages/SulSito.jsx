import Navbar from "../UI/navbar/Navbar";

const SulSito = () => {

  return (
    <div className="container">
      <Navbar />
      <div className="main-content">
        <div className="content">
          <div className="main-container-sito">

            <h1 className="page-title-sito">Descrizione del Sistema CRM: Sistema specializzato di gestione dell'assistenza</h1>


            <p className="intro-text-sito">Si tratta di un sistema specializzato di gestione dell'assistenza per gruppi vulnerabili, con un focus sulle esigenze personalizzate (alimentazione, igiene, autonomia). È ideale per luoghi in cui è necessario monitorare i dati quotidiani su salute/assistenza senza complessi sistemi EHR (cartelle cliniche elettroniche).</p>

            <p className="intro-text-sito">Ecco le varianti di applicazione:</p>


            <h2 className="section-title-sito">Istituzioni</h2>
            <ul className="description-list-sito">
                <li><strong>Case di riposo e ospizi</strong>: Scenario principale. Distribuzione per reparti, monitoraggio delle esigenze — questo risparmia tempo sulla carta.</li>
                <li><strong>Centri di riabilitazione e cliniche per anziani/disabili</strong>: Per tracciare la riabilitazione (ad esempio, "autonomia: S" per l'autosufficienza). È possibile aggiungere moduli per fisioterapia o farmaci.</li>
                <li><strong>Casa-famiglia o centri per bambini con disabilità</strong>: Adattare "alimentazione" come dieta, "bagno" come igiene, "altro" per esigenze speciali (giocattoli, terapia).</li>
                <li><strong>Servizi sociali/ONG</strong>: Per programmi di volontariato di assistenza ai senzatetto o migranti — informazioni generali in "Generale" per la coordinazione.</li>
                <li><strong>Scuole/asili nido per bambini con bisogni speciali</strong>: Filtri per "reparti" come classi, schede per piani individuali (IEP nell'educazione).</li>
            </ul>

            <h2 className="section-title-sito">Privati</h2>
            <ul className="description-list-sito">
                <li><strong>Famiglie con parenti anziani</strong>: Versione semplificata per assistenza domiciliare — un solo "admin" (figlio/figlia) gestisce i dati sul genitore (orario assunzione farmaci, menu). Possibile SaaS con abbonamento (5-10€/mese).</li>
                <li><strong>Badanti/babysitter private</strong>: App per freelance di assistenza — il cliente carica i dati, la badante li modifica in tempo reale (con permessi).</li>
                <li><strong>Personal trainer o nutrizionisti</strong>: Adattare per clienti — "alimentazione" come dieta, "autonomia" come livello di fitness, per piani personalizzati.</li>
            </ul>


            <div className="stat-block-sito">
                <p>Dovunque sia necessario un semplice tracciamento "chi, cosa, quando" senza grandi budget per software (tipo Cerner o Epic). In Europa/Italia è richiesto a causa dell'invecchiamento della popolazione — secondo Eurostat, entro il 2050 il numero di persone di età superiore ai 65 anni raggiungerà 134,5 milioni, pari a circa il 30% della popolazione UE.</p>
            </div>


            <p className="contact-text-sito">Contattatemi per personalizzazioni: tsitronov2017@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SulSito;