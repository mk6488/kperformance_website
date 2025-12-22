import { useMemo, useState } from 'react';
import bodyMapFront from '../../assets/bodyMapFront.png';
import bodyMapBack from '../../assets/bodyMapBack.png';
import bodyMapLeft from '../../assets/bodyMapLeft.png';
import bodyMapRight from '../../assets/bodyMapRight.png';

type BodyView = 'front' | 'back' | 'left' | 'right';

type Marker = {
  view: BodyView;
  x: number;
  y: number;
};

type Props = {
  markers: Marker[];
  onChange: (markers: Marker[]) => void;
};

const viewOptions: { id: BodyView; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
];

const viewImage: Record<BodyView, string> = {
  front: bodyMapFront,
  back: bodyMapBack,
  left: bodyMapLeft,
  right: bodyMapRight,
};

export default function BodyMap({ markers, onChange }: Props) {
  const [view, setView] = useState<BodyView>('front');

  const viewMarkers = useMemo(() => markers.filter((m) => m.view === view), [markers, view]);

  const viewMarkersIndexToGlobal = (viewIndex: number, allMarkers: Marker[], currentView: BodyView) => {
    let count = -1;
    for (let i = 0; i < allMarkers.length; i += 1) {
      if (allMarkers[i].view === currentView) {
        count += 1;
        if (count === viewIndex) return i;
      }
    }
    return -1;
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const next = [...markers, { view, x, y }];
    onChange(next);
  };

  const handleRemoveMarker = (viewIndex: number) => {
    const globalIndex = viewMarkersIndexToGlobal(viewIndex, markers, view);
    if (globalIndex === -1) return;

    const next = [...markers];
    next.splice(globalIndex, 1);
    onChange(next);
  };

  const clearCurrentView = () => {
    onChange(markers.filter((m) => m.view !== view));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {viewOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setView(opt.id);
            }}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              opt.id === view
                ? 'border-brand-navy bg-brand-navy text-white'
                : 'border-slate-200 text-brand-charcoal hover:border-brand-blue'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto max-w-md">
        <img
          src={viewImage[view]}
          alt={`${view} body view`}
          className="w-full h-auto select-none"
          onClick={handleImageClick}
        />
        {viewMarkers.map((marker, idx) => (
          <button
            key={`${marker.view}-${idx}-${marker.x.toFixed(3)}-${marker.y.toFixed(3)}`}
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${marker.x * 100}%`, top: `${marker.y * 100}%` }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveMarker(idx);
            }}
          >
            <span className="block h-3 w-3 rounded-full bg-brand-navy shadow" />
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Tap to add markers. Tap a marker to remove it.</p>
        <button
          type="button"
          onClick={clearCurrentView}
          className="text-sm font-medium text-brand-navy hover:text-brand-blue underline underline-offset-4"
        >
          Clear this view
        </button>
      </div>
    </div>
  );
}

