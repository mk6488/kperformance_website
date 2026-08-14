import BodyMap from '../BodyMap';
import { IntakeValues } from '../types';

type Props = {
  values: IntakeValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (path: string, value: any) => void;
};

export default function StepBodyMap({ values, onChange }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700">
        Tap on the areas that feel painful, tight, or injured. You can mark more than one area and switch views if
        needed.
      </p>
      <BodyMap
        markers={values.bodyMap.markers}
        onChange={(next) => onChange('bodyMap.markers', next)}
      />
    </div>
  );
}

