import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        setError('Something went wrong. Please try again or email me at mike@kperformance.uk.');
      });
  };

  return (
    <Section id="contact" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch"
          subtitle="Get in touch, and we'll find a time that works."
          align="left"
        />

        <div className="mx-auto w-full max-w-2xl">
          <Card className="w-full">
            {!submitted ? (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input type="hidden" name="form-name" value="contact" />
                <input name="bot-field" className="hidden" />

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                    Name
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                    Email
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                  Phone <span className="font-normal text-slate-400">(optional)</span>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                  Message <span className="font-normal text-slate-400">(optional)</span>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    placeholder="How can I help?"
                  />
                </label>

                <label className="flex items-start gap-2 text-sm text-brand-charcoal">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
                    name="consent"
                  />
                  <span>
                    I consent to being contacted about my enquiry and understand my details will be handled
                    in line with good privacy practice.
                  </span>
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full sm:w-auto">
                  Send enquiry
                </Button>
              </form>
            ) : (
              <div className="rounded-xl border border-brand-navy/20 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-brand-navy">Thanks — your message has been sent</h3>
                <p className="mt-2 text-slate-700">
                  I'll be in touch shortly with availability and next steps.
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="text-sm text-slate-700">
          <p>
            Email:{' '}
            <a href="mailto:mike@kperformance.uk" className="text-brand-blue underline">
              mike@kperformance.uk
            </a>
          </p>
        </div>
      </div>
    </Section>
  );
}

export default ContactSection;
