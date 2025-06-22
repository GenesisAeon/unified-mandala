import React from 'react';

interface CustomRegionGalleryProps {
  regions?: string[];
}

const CustomRegionGallery: React.FC<CustomRegionGalleryProps> = ({ regions = [] }) => (
  <div aria-label="Region Gallery">
    {regions.map((r) => (
      <div key={r}>{r}</div>
    ))}
  </div>
);

export default CustomRegionGallery;
