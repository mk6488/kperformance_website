import { IntakeValues } from '../types';

type Props = {
  values: IntakeValues;
};

export default function StepReview({ values }: Props) {
  const painText = values.problem.painNow === null ? 'Not set' : `${values.problem.painNow}/10`;
  const redFlags = values.medical.redFlags;
  const medicalTicks = Object.values(values.medical.checkboxes || {}).filter(Boolean).length;
  const markerCount = values.bodyMap.markers.length;

  return (
    <div className="space-y-6 text-sm text-slate-800">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-brand-navy">Client details</h3>
        <p>{values.client.fullName || 'Not provided'}</p>
        <p>Date of birth: {values.client.dob || 'Not provided'}</p>
        <p>Email: {values.client.email || 'Not provided'}</p>
        <p>Phone: {values.client.phone || 'Not provided'}</p>
        <p>Under 18: {values.client.under18 ? 'Yes' : 'No'}</p>
        {values.client.under18 ? (
          <div className="space-y-1">
            <p className="font-medium text-brand-charcoal">Parent/guardian</p>
            <p>{values.client.guardian.fullName || 'Not provided'}</p>
            <p>Email: {values.client.guardian.email || 'Not provided'}</p>
            <p>Phone: {values.client.guardian.phone || 'Not provided'}</p>
            <p>Relationship: {values.client.guardian.relationship || 'Not provided'}</p>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-brand-navy">Main concern</h3>
        <p>{values.problem.mainConcern || 'Not provided'}</p>
        <p>Pain now: {painText}</p>
        <p>Onset: {values.problem.onset || 'Not provided'}</p>
        <p>Location: {values.problem.locationText || 'Not provided'}</p>
        <p>Aggravators: {values.problem.aggravators || 'Not provided'}</p>
        <p>Helps: {values.problem.easers || 'Not provided'}</p>
        <p>Goals: {values.problem.goals || 'Not provided'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-brand-navy">Medical</h3>
        <p>Existing conditions: {values.medical.conditions || 'Not provided'}</p>
        <p>Previous injuries/surgery: {values.medical.surgeries || 'Not provided'}</p>
        <p>Medication: {values.medical.medications || 'Not provided'}</p>
        <p>Allergies: {values.medical.allergies || 'Not provided'}</p>
        <p>Key medical tick boxes: {medicalTicks} selected</p>
        {redFlags.length > 0 ? (
          <div>
            <p className="font-medium text-brand-charcoal">Red flags:</p>
            <ul className="list-disc list-inside text-slate-700">
              {redFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Red flags: None selected</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-brand-navy">Lifestyle</h3>
        <p>Sport / activity: {values.lifestyle.activity || 'Not provided'}</p>
        <p>Weekly training load: {values.lifestyle.weeklyLoad || 'Not provided'}</p>
        <p>Sleep hours: {values.lifestyle.sleepHours || 'Not provided'}</p>
        <p>
          Stress level:{' '}
          {values.lifestyle.stressScore === null ? 'Not set' : `${values.lifestyle.stressScore}/10`}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-brand-navy">Consent</h3>
        <p>
          Health data consent: {values.consent.healthDataConsent ? 'Given' : 'Not given'}
        </p>
        <p>
          Confirmed truthful: {values.consent.confirmTruthful ? 'Yes' : 'No'}
        </p>
        <p>
          Contact preferences:{' '}
          {['email', 'sms', 'phone']
            .filter((k) => (values.consent.contactPrefs as any)[k])
            .join(', ') || 'None selected'}
        </p>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-brand-navy">Body map</h3>
        <p>Markers: {markerCount}</p>
        <p className="text-slate-600">Use Back to make changes.</p>
      </div>
    </div>
  );
}
