import React from 'react';

interface ErrorEmergenceProps {
  errors: string[];
}

const ErrorEmergence: React.FC<ErrorEmergenceProps> = ({ errors }) => {
  if (errors.length === 0) return null;
  return (
    <div className="error-emergence">
      <h2>Fehler</h2>
      <ul>
        {errors.map((err, idx) => (
          <li key={idx} role="alert">
            {err}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorEmergence;
