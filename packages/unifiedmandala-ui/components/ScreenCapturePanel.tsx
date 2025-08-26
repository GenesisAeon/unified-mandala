import React, { useState } from 'react';

/**
 * ScreenCapturePanel requests a screenshot from the OS bridge
 * and renders it. It relies on an HTTP endpoint `/api/os/screencap`
 * which returns an image blob.
 */
export default function ScreenCapturePanel() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCapture() {
    setLoading(true);
    try {
      const res = await fetch('/api/os/screencap');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImage(url);
    } catch (err) {
      console.error('failed to capture screen', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleCapture} disabled={loading}>
        {loading ? 'Capturing...' : 'Capture Screen'}
      </button>
      {image && <img src={image} alt="Screen capture" />}
    </div>
  );
}
