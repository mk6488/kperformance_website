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
          title="Book a session or ask a question"
          subtitle="Whether you&apos;re an athlete, a parent, or simply dealing with pain, I&apos;d be happy to help. Send an enquiry and I&apos;ll reply with availability and next steps."
          align="left"
        />

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <Card className="lg:col-span-2">
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
                  <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                    Is this session for you or your child?
                    <select
                      name="forWhom"
                      className="w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    >
                      <option value="self">For me</option>
                      <option value="child">For my child</option>
                      <option value="other">Other / team</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                    Child age (if under 18)
                    <input
                      name="child-age"
                      type="text"
                      className="w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      placeholder="e.g. 15"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                  I&apos;m interested in
                  <select
                    name="interest"
                    className="w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  >
                    <option value="Youth performance coaching">Youth performance coaching</option>
                    <option value="Soft tissue therapy">Soft tissue therapy</option>
                    <option value="Both">Both</option>
                  </select>
                  <span className="text-xs text-slate-600">
                    If you&apos;re enquiring for an under-18, a parent/guardian should submit the form.
                  </span>
                </label>

                <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full rounded-md border border-slate-200 px-3 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    placeholder="Tell me about your sport, goals, and any pain or niggles you’re dealing with."
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

                <div className="space-y-2">
                  <Button type="submit" className="w-full sm:w-auto">
                    Send enquiry
                  </Button>
                  <p className="text-sm text-slate-600">
                    If you&apos;re unsure, start the intake and I&apos;ll follow up with any questions.
                  </p>
                  <p className="text-sm text-slate-600">Under-18s must have consent from a parent or guardian.</p>
                </div>
              </form>
            ) : (
              <div className="rounded-xl border border-brand-navy/20 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-brand-navy">Thanks — your message has been sent</h3>
                <p className="mt-2 text-slate-700">
                  I’ll be in touch shortly with availability and next steps.
                </p>
              </div>
            )}
          </Card>

          <Card className="h-full space-y-3 bg-brand-navy text-white">
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="text-white/85">For anything urgent, email me and I’ll reply as soon as I can.</p>
            <Button
              variant="secondary"
              onClick={() => {
                window.open('mailto:mike@kperformance.uk', '_blank');
              }}
            >
              Email Mike
            </Button>
          </Card>
        </div>

        <div className="space-y-2 text-sm text-slate-700">
          <p>
            Email:{' '}
            <a href="mailto:mike@kperformance.uk" className="text-brand-blue underline">
              mike@kperformance.uk
            </a>
          </p>
          <p className="text-xs text-slate-600">
            If you prefer, email works too—enquiry form is the fastest way to get started.
          </p>
        </div>
      </div>
    </Section>
  );
}

export default ContactSection;



