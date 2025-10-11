import React, { useState } from 'react';
import yaml from 'js-yaml';

export default function UploadYamlForm() {
  const [yamlOut, setYamlOut] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const data = { source: file.name, content: text };
      setYamlOut(yaml.dump(data));
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFile} data-testid="file-input" />
      {yamlOut && <textarea value={yamlOut} readOnly data-testid="yaml-output" />}
    </div>
  );
}
