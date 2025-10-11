import React, { useState } from 'react';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

interface ServiceOption {
  id: string;
  name: string;
  type?: string;
  default_enabled?: boolean;
}

const servicesFile = path.resolve(__dirname, '../../../config/onboarding/services.yaml');
let defaultServices: ServiceOption[] = [];
try {
  const raw = fs.readFileSync(servicesFile, 'utf8');
  defaultServices = (yaml.parse(raw).services as ServiceOption[]) || [];
} catch {
  defaultServices = [];
}

interface OnboardingModalProps {
  open: boolean;
  steps: string[];
  onComplete: (selected: string[]) => void;
  services?: ServiceOption[];
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  steps,
  onComplete,
  services = defaultServices,
}) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>(
    services.filter((s) => s.default_enabled).map((s) => s.id),
  );
  if (!open) return null;
  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const next = () => {
    if (index < steps.length) {
      setIndex(index + 1);
    } else {
      onComplete(selected);
    }
  };
  const isStepPhase = index < steps.length;
  return (
    <div role="dialog" aria-modal="true" className="onboarding-modal">
      {isStepPhase ? (
        <p>{steps[index]}</p>
      ) : (
        <div>
          <p>Dienste auswählen:</p>
          {services.map((s) => (
            <label key={s.id} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={selected.includes(s.id)}
                onChange={() => toggle(s.id)}
              />
              {s.name}
              {s.type === 'external' ? ' (extern)' : ''}
            </label>
          ))}
        </div>
      )}
      <button onClick={next}>{isStepPhase ? 'Weiter' : 'Fertig'}</button>
    </div>
  );
};

export default OnboardingModal;
