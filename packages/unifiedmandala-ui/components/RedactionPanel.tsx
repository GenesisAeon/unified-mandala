import React, { useRef, useState, useEffect } from 'react';
import { RedactionRegion } from '../../redaction/ImageRedactor';

/**
 * RedactionPanel lets users upload an image and manually draw redaction boxes.
 * The redacted result is rendered directly on a canvas.
 */
export default function RedactionPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [regions, setRegions] = useState<RedactionRegion[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  const handleFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(image, 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    for (const r of regions) {
      ctx.fillRect(r.x, r.y, r.width, r.height);
    }
  }, [image, regions]);

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    setDrawing(true);
    setStart({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!drawing || !start || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.drawImage(image, 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    for (const r of regions) {
      ctx.fillRect(r.x, r.y, r.width, r.height);
    }
    ctx.strokeStyle = 'red';
    ctx.strokeRect(start.x, start.y, offsetX - start.x, offsetY - start.y);
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!drawing || !start) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const rect: RedactionRegion = {
      x: Math.min(start.x, offsetX),
      y: Math.min(start.y, offsetY),
      width: Math.abs(offsetX - start.x),
      height: Math.abs(offsetY - start.y),
    };
    setRegions((prev) => [...prev, rect]);
    setDrawing(false);
    setStart(null);
  };

  const clearRegions = () => setRegions([]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      <button onClick={clearRegions} disabled={!regions.length}>
        Clear
      </button>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid #ccc', marginTop: '1rem' }}
      />
    </div>
  );
}
