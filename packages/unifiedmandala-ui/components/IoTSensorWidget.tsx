import React from 'react';

interface IoTSensorWidgetProps {
  /** Display label for the sensor */
  label: string;
  /** Current value from the sensor */
  value: number | string;
  /** Optional unit for the value, e.g. °C */
  unit?: string;
}

/**
 * Simple widget for displaying realtime IoT sensor data.
 * The parent component is responsible for updating the value prop.
 */
const IoTSensorWidget: React.FC<IoTSensorWidgetProps> = ({ label, value, unit }) => {
  return (
    <div
      data-testid="iot-sensor-widget"
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '0.5rem',
        minWidth: '4rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>{label}</div>
      <div>
        {value}
        {unit ? ` ${unit}` : ''}
      </div>
    </div>
  );
};

export default IoTSensorWidget;
