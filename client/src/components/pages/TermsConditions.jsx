import { NavLink } from 'react-router-dom';

const TermsConditions = () => {
  const updated = 'April 8, 2026';
  const contact = 'tsitronov2017@gmail.com';

  return (
    <div className="privacy-container">
      <header className="privacy-header">
        <NavLink to="/" className="privacy-back">← Back</NavLink>
        <h1>Terms &amp; Conditions</h1>
        <p className="privacy-updated">Last updated: {updated}</p>
      </header>

      <div className="privacy-body">

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using CareTrack ("the Service"), you agree to be bound by these
            Terms &amp; Conditions and our{' '}
            <NavLink to="/privacy">Privacy Policy</NavLink>. If you do not agree, you must
            not use the Service. These Terms apply to all users including employees, contractors,
            and agents of institutions that have subscribed to the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            CareTrack is a web-based care-management platform designed for nursing homes,
            rehabilitation centres, social-service organisations, and private caregivers. It
            provides resident tracking, note management, care-plan documentation, and
            role-based access control for authorised staff.
          </p>
        </section>

        <section>
          <h2>3. Eligibility</h2>
          <p>
            You must be at least 18 years old and have the legal capacity to enter a binding
            agreement. Institutional users must have obtained all necessary authorisations
            from their organisation to use the Service on its behalf.
          </p>
        </section>

        <section>
          <h2>4. Account Responsibilities</h2>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You must notify us immediately of any unauthorised access to your account.</li>
            <li>You may not share credentials with unauthorised persons.</li>
            <li>You are responsible for all activities that occur under your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </ul>
        </section>

        <section>
          <h2>5. Permitted Use</h2>
          <p>You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul>
            <li>Use the Service in any way that violates applicable local, national, or international law.</li>
            <li>Enter false, misleading, or third-party data without proper authorisation.</li>
            <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure.</li>
            <li>Transmit malicious code, viruses, or any disruptive material.</li>
            <li>Scrape, crawl, or systematically extract data from the Service.</li>
            <li>Use the Service for commercial resale or sublicensing without written consent.</li>
          </ul>
        </section>

        <section>
          <h2>6. Health Data &amp; Regulatory Compliance</h2>
          <p>
            The Service may be used to store health-related data concerning care residents.
            Institutional users are responsible for ensuring their use of the Service complies
            with all applicable healthcare data regulations, including but not limited to:
          </p>
          <ul>
            <li><strong>GDPR</strong> (EU) — including executing a Data Processing Agreement (DPA) where required.</li>
            <li><strong>HIPAA</strong> (USA) — where the user qualifies as a Covered Entity or Business Associate. Users requiring a HIPAA Business Associate Agreement (BAA) must contact us before use.</li>
            <li>National and regional healthcare privacy laws applicable in their jurisdiction.</li>
          </ul>
          <p>
            We do not guarantee HIPAA compliance out-of-the-box. If you require a BAA, please
            contact <a href={`mailto:${contact}`}>{contact}</a> before storing any protected
            health information (PHI).
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            The Service, including its code, design, trademarks, and content (excluding
            user-submitted data), is the exclusive property of Evgenii Tsitronov and is
            protected by applicable intellectual property laws. You are granted a limited,
            non-exclusive, non-transferable licence to use the Service for its intended purpose.
          </p>
          <p>
            User-submitted data remains the property of the submitting user or institution.
            By submitting data, you grant us a limited licence to store and process it solely
            to provide the Service.
          </p>
        </section>

        <section>
          <h2>8. Availability &amp; Service Levels</h2>
          <p>
            We aim for high availability but do not guarantee uninterrupted access. The Service
            is provided "as is" and "as available". We may perform maintenance with or without
            prior notice. We are not liable for any losses resulting from downtime or
            unavailability.
          </p>
        </section>

        <section>
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            To the maximum extent permitted by applicable law, the Service is provided without
            warranties of any kind, express or implied, including but not limited to warranties
            of merchantability, fitness for a particular purpose, and non-infringement. We do
            not warrant that the Service will be error-free or that defects will be corrected.
          </p>
        </section>

        <section>
          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall Evgenii
            Tsitronov be liable for any indirect, incidental, special, consequential, or
            punitive damages, including but not limited to loss of profits, data, or goodwill,
            arising out of or in connection with the use of the Service.
          </p>
          <p>
            Our total aggregate liability for any claim arising from these Terms or the Service
            shall not exceed the greater of (a) the amount you paid for the Service in the
            12 months preceding the claim, or (b) EUR 100 / USD 100.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of certain warranties
            or liabilities. In such jurisdictions, these limitations apply to the fullest
            extent permitted by law.
          </p>
        </section>

        <section>
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Evgenii Tsitronov from and
            against any claims, liabilities, damages, losses, costs, and expenses (including
            reasonable legal fees) arising from (a) your use of the Service in violation of
            these Terms, (b) your violation of any applicable law, or (c) any data you submit
            to the Service.
          </p>
        </section>

        <section>
          <h2>12. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time for violations
            of these Terms, or for any other reason, with or without notice. Upon termination,
            your right to use the Service ceases immediately. Sections 7, 9, 10, 11, and 13
            survive termination.
          </p>
        </section>

        <section>
          <h2>13. Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of the European Union and the Republic of
            Italy, without regard to conflict-of-law principles. For users in the United
            States, disputes that cannot be resolved informally shall be submitted to binding
            arbitration under the rules of the American Arbitration Association (AAA), with
            proceedings conducted in English.
          </p>
          <p>
            EEA consumers may also submit disputes to their local courts and to the EU Online
            Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr ↗</a>.
          </p>
        </section>

        <section>
          <h2>14. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be
            communicated via a notice within the application at least 14 days before taking
            effect. Continued use of the Service after the effective date constitutes acceptance
            of the revised Terms.
          </p>
        </section>

        <section>
          <h2>15. Contact</h2>
          <p>
            For any questions regarding these Terms:<br />
            Email: <a href={`mailto:${contact}`}>{contact}</a>
          </p>
        </section>

      </div>

      <footer className="privacy-footer">
        <NavLink to="/">Home</NavLink>
        <span>·</span>
        <NavLink to="/privacy">Privacy Policy</NavLink>
        <span>·</span>
        <span>© {new Date().getFullYear()} CareTrack</span>
      </footer>
    </div>
  );
};

export default TermsConditions;
