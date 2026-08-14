import { Section } from '../components/ui/Section';

export default function PrivacyPolicy() {
  return (
    <Section className="bg-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-brand-navy">Privacy Policy</h1>

        <p className="text-slate-700">
          This privacy policy explains how personal information is collected and used by K Performance. I
          am committed to protecting your privacy and handling your data responsibly.
        </p>

        <h2 className="text-xl font-semibold text-brand-navy">What information I collect</h2>
        <p className="text-slate-700">
          When you contact me via the website form or email, I may collect your name, email address, and any
          information you choose to include about your enquiry.
        </p>

        <h2 className="text-xl font-semibold text-brand-navy">How your information is used</h2>
        <p className="text-slate-700">
          Your information is used only to respond to enquiries, arrange appointments, and provide relevant
          information about services. I do not use your data for marketing without consent.
        </p>

        <h2 className="text-xl font-semibold text-brand-navy">Children and young athletes</h2>
        <p className="text-slate-700">
          When services involve individuals under the age of 18, communication and data handling is carried
          out with parents or guardians wherever appropriate, in line with safeguarding best practice.
        </p>

        <h2 className="text-xl font-semibold text-brand-navy">Data storage</h2>
        <p className="text-slate-700">
          Website enquiries are processed via Netlify Forms. I take reasonable steps to ensure data is stored
          securely and only for as long as necessary.
        </p>

        <h2 className="text-xl font-semibold text-brand-navy">Your rights</h2>
        <p className="text-slate-700">
          You have the right to request access to, correction of, or deletion of your personal data. To do
          so, please contact me directly.
        </p>

        <h2 className="text-xl font-semibold text-brand-navy">Contact</h2>
        <p className="text-slate-700">
          If you have any questions about this privacy policy or how your data is handled, please get in
          touch via the website contact form.
        </p>

        <p className="text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>
      </div>
    </Section>
  );
}

