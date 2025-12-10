import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

export function ContactSection() {
  return (
    <Section id="contact" variant="muted">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Contact"
          title="Book a session or ask a question"
          subtitle="Fill in the form or drop a WhatsApp message. I’ll reply with availability and next steps."
          align="left"
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                  Name
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                  Phone
                  <input
                    name="phone"
                    type="tel"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                  Is this session for you or your child?
                  <select
                    name="for"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
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
                    className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    placeholder="e.g. 15"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm text-brand-charcoal">
                Message
                <textarea
                  name="message"
                  rows={4}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  placeholder="Tell me about your sport, goals, and any pain or injury."
                />
              </label>

              <Button type="submit">Send message</Button>
            </form>
          </Card>

          <Card className="h-full space-y-3 bg-brand-navy text-white">
            <h3 className="text-xl font-semibold">Prefer WhatsApp?</h3>
            <p className="text-white/85">
              I&apos;m happy to chat and answer quick questions. Share your sport, goals, and location
              and I&apos;ll reply with availability.
            </p>
            <Button variant="secondary" className="bg-white/95 text-brand-navy hover:bg-white">
              Open WhatsApp
            </Button>
            <p className="text-sm text-white/75">
              Placeholder link — update with your number when ready.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}

export default ContactSection;
