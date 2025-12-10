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
                    name="forWhom"
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

              <label className="flex items-start gap-2 text-sm text-brand-charcoal">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
                  name="consent"
                />
                <span>
                  I consent to being contacted about my enquiry and understand my details will be handled
                  in line with privacy best practice.
                </span>
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
            <Button
              variant="whatsapp"
              onClick={() => {
                // TODO: replace 447000000000 with the real WhatsApp number
                window.open(
                  'https://wa.me/447000000000?text=Hi%20Mike,%20I%20found%20your%20website%20and%20would%20like%20to%20ask%20about%20soft%20tissue%20therapy.',
                  '_blank',
                );
              }}
            >
              Open WhatsApp
            </Button>
            <p className="text-sm text-white/75">
              This button opens WhatsApp with a pre-filled message. Update the number when you’re ready.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}

export default ContactSection;

