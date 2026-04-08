import { NavLink } from 'react-router-dom';

const PrivacyPolicy = () => {
  const updated = 'April 8, 2026';
  const contact = 'tsitronov2017@gmail.com';

  return (
    <div className="privacy-container">
      <header className="privacy-header">
        <NavLink to="/" className="privacy-back">← Back</NavLink>
        <h1>Privacy Policy</h1>
        <p className="privacy-updated">Last updated: {updated}</p>
      </header>

      <div className="privacy-body">

        <section>
          <h2>1. Controller / Data Controller</h2>
          <p>
            The data controller responsible for this application is:<br />
            <strong>Evgenii Tsitronov</strong> (individual operator)<br />
            Email: <a href={`mailto:${contact}`}>{contact}</a><br />
            For GDPR enquiries, use the same email with subject "GDPR Request".
          </p>
        </section>

        <section>
          <h2>2. What Data We Collect</h2>
          <p>We collect and process only the data strictly necessary to operate the service:</p>
          <ul>
            <li><strong>Account credentials</strong> — username and hashed password, used for authentication.</li>
            <li><strong>Session tokens</strong> — short-lived JWT access tokens stored in memory only (never in localStorage or cookies). A refresh token is stored in an <code>HttpOnly</code> cookie.</li>
            <li><strong>Resident care data</strong> — names, room numbers, ward, and care-plan fields entered by authorised staff.</li>
            <li><strong>Cookies</strong> — one functional cookie (<code>refreshToken</code>, HttpOnly, Secure) and one localStorage key (<code>cookie_consent</code>) to remember your consent choice.</li>
            <li><strong>Logs</strong> — standard server access logs (IP address, timestamp, HTTP method) retained for up to 30 days for security purposes.</li>
          </ul>
          <p>We do <strong>not</strong> collect advertising identifiers, sell data to third parties, or use third-party analytics or tracking scripts.</p>
        </section>

        <section>
          <h2>3. Legal Basis for Processing (GDPR Art. 6)</h2>
          <ul>
            <li><strong>Art. 6(1)(b) — Contract performance:</strong> processing necessary to provide the care-management service to authorised users.</li>
            <li><strong>Art. 6(1)(c) — Legal obligation:</strong> server logs retained for security incident investigation.</li>
            <li><strong>Art. 6(1)(f) — Legitimate interest:</strong> security monitoring and fraud prevention.</li>
          </ul>
          <p>
            Where special-category data (Art. 9 GDPR — health data) relating to care residents
            is stored, the legal basis is <strong>Art. 9(2)(h)</strong> (provision of health or
            social care) combined with a data-processing agreement with the operating institution.
          </p>
        </section>

        <section>
          <h2>4. Cookies &amp; Similar Technologies</h2>
          <table className="privacy-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>refreshToken</code></td>
                <td>HttpOnly, Secure cookie</td>
                <td>Maintains authenticated session</td>
                <td>7 days</td>
              </tr>
              <tr>
                <td><code>cookie_consent</code></td>
                <td>localStorage</td>
                <td>Remembers your consent choice</td>
                <td>Persistent</td>
              </tr>
            </tbody>
          </table>
          <p>No third-party cookies, tracking pixels, or advertising scripts are used.</p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <ul>
            <li>Account data: retained for the duration of the service agreement, then deleted within 30 days of termination.</li>
            <li>Resident care data: retained per the schedule agreed with the institution; default is 5 years unless superseded by local law.</li>
            <li>Server logs: 30 days.</li>
            <li>Consent records: 3 years.</li>
          </ul>
        </section>

        <section>
          <h2>6. International Data Transfers</h2>
          <p>
            The application is hosted on Render.com (United States). Transfers from the
            European Economic Area (EEA) to the United States are covered by Render's Standard
            Contractual Clauses (SCCs) under EU Commission Decision 2021/914. No other
            international transfers take place.
          </p>
        </section>

        <section>
          <h2>7. Your Rights Under GDPR (EEA / UK Residents)</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> — obtain a copy of your personal data.</li>
            <li><strong>Rectification</strong> — correct inaccurate or incomplete data.</li>
            <li><strong>Erasure ("right to be forgotten")</strong> — request deletion of your data.</li>
            <li><strong>Restriction</strong> — limit how we process your data.</li>
            <li><strong>Portability</strong> — receive your data in a structured, machine-readable format.</li>
            <li><strong>Object</strong> — object to processing based on legitimate interest.</li>
            <li><strong>Withdraw consent</strong> — where processing is based on consent.</li>
            <li><strong>Lodge a complaint</strong> — with your national Data Protection Authority (DPA).</li>
          </ul>
          <p>
            To exercise any right, email <a href={`mailto:${contact}`}>{contact}</a> with
            subject "GDPR Request". We respond within <strong>30 days</strong>.
          </p>
        </section>

        <section>
          <h2>8. Your Rights Under CCPA / CalOPPA (California Residents)</h2>
          <p>
            California residents have the following rights under the California Consumer Privacy
            Act (CCPA) as amended by the CPRA, and CalOPPA:
          </p>
          <ul>
            <li><strong>Know</strong> — know what personal information is collected, used, shared, or sold.</li>
            <li><strong>Delete</strong> — request deletion of your personal information.</li>
            <li><strong>Opt-Out</strong> — opt out of the sale or sharing of personal information. <em>We do not sell or share personal information.</em></li>
            <li><strong>Non-discrimination</strong> — not be discriminated against for exercising your privacy rights.</li>
            <li><strong>Correct</strong> — correct inaccurate personal information.</li>
            <li><strong>Limit</strong> — limit the use of sensitive personal information.</li>
          </ul>
          <p>
            To exercise your rights, email <a href={`mailto:${contact}`}>{contact}</a> with
            subject "CCPA Request". We will respond within <strong>45 days</strong> (extendable
            by a further 45 days with notice).
          </p>
          <p>
            <strong>Do Not Track:</strong> We honour browser Do Not Track (DNT) signals.
            No tracking takes place regardless of DNT status.
          </p>
          <p>
            <strong>CalOPPA disclosure:</strong> This privacy policy is accessible from the
            home page. Users may request any personal information we hold about them by
            contacting us at the email above.
          </p>
        </section>

        <section>
          <h2>9. Children's Privacy (COPPA)</h2>
          <p>
            This service is not directed to children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you believe we have
            inadvertently collected such information, please contact us at{' '}
            <a href={`mailto:${contact}`}>{contact}</a> and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2>10. Security</h2>
          <p>
            We implement industry-standard technical and organisational measures including:
            HTTPS/TLS encryption in transit, bcrypt-hashed passwords, JWT tokens stored in
            memory only, HttpOnly refresh-token cookies, security HTTP headers (X-Frame-Options,
            Referrer-Policy, Permissions-Policy), rate limiting on authentication endpoints,
            and role-based access control.
          </p>
          <p>
            In the event of a personal data breach likely to result in high risk to individuals,
            we will notify affected parties and the relevant supervisory authority within{' '}
            <strong>72 hours</strong> as required by GDPR Art. 33–34.
          </p>
        </section>

        <section>
          <h2>11. Third-Party Services</h2>
          <ul>
            <li>
              <strong>Render.com</strong> — hosting and infrastructure (United States).{' '}
              <a href="https://render.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy ↗</a>
            </li>
            <li>
              <strong>YouTube (Privacy-Enhanced Mode)</strong> — embedded demo video via{' '}
              <code>youtube-nocookie.com</code>. No cookies are set unless you play the video.
            </li>
          </ul>
        </section>

        <section>
          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be
            communicated via a notice within the application. The date of the most recent
            revision appears at the top of this page.
          </p>
        </section>

        <section>
          <h2>13. Contact</h2>
          <p>
            For any privacy-related questions, requests, or complaints:<br />
            Email: <a href={`mailto:${contact}`}>{contact}</a><br />
            Response time: within 30 days (GDPR) / 45 days (CCPA).
          </p>
        </section>

      </div>

      <footer className="privacy-footer">
        <NavLink to="/">Home</NavLink>
        <span>·</span>
        <NavLink to="/terms">Terms &amp; Conditions</NavLink>
        <span>·</span>
        <span>© {new Date().getFullYear()} CareTrack</span>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
