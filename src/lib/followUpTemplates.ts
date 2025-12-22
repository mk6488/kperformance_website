type TemplateId = 'requestMoreInfo' | 'notSuitable' | 'readyToBook';

export const followUpTemplates: Record<
  TemplateId,
  {
    label: string;
    subject: string;
    body: string;
    setStatus?: 'needs_followup' | 'archived' | 'reviewed';
  }
> = {
  requestMoreInfo: {
    label: 'Request more info',
    subject: 'Quick follow-up on your intake',
    setStatus: 'needs_followup',
    body: `Hi {{name}},

Thanks for sharing your intake details. I just need a bit more information to help you properly:
- When did this issue first start?
- What activities make it feel worse or better?
- Have you had any recent imaging or diagnoses?

Feel free to reply here with answers, or call/WhatsApp me if that’s easier.

Thanks,
Mike
K Performance`,
  },
  notSuitable: {
    label: 'Not suitable / refer out',
    subject: 'About your recent enquiry',
    setStatus: 'archived',
    body: `Hi {{name}},

Thanks for your intake. Based on what you’ve shared, I think you’d benefit most from seeing a specialist service. To make sure you get the right care quickly, I recommend:
- Consulting your GP to discuss further investigation, or
- Booking with a specialist (e.g., sports physician or physiotherapist) for a detailed assessment.

If you need local recommendations or want to clarify anything, reply here and I’ll gladly point you in the right direction.

Wishing you the best,
Mike
K Performance`,
  },
  readyToBook: {
    label: 'Ready to book',
    subject: 'Let’s book your session',
    setStatus: 'reviewed',
    body: `Hi {{name}},

Thanks for the details—this looks like a good fit. I can book you in for an assessment and treatment.

Please share:
- Your availability over the next week
- Preference for weekdays/weekends

Alternatively, call or WhatsApp me and we’ll lock a slot in right away.

Thanks,
Mike
K Performance`,
  },
};

export function fillTemplate(template: string, replacements: Record<string, string | undefined>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] || '');
}

