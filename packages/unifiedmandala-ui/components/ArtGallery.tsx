import React from 'react';

interface ArtPiece {
  id: string;
  url: string;
  alt?: string;
}

interface ArtGalleryProps {
  pieces: ArtPiece[];
}

/**
 * Renders a simple gallery of generative art pieces.
 */
const ArtGallery: React.FC<ArtGalleryProps> = ({ pieces }) => (
  <div
    data-testid="art-gallery"
    style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
  >
    {pieces.map((piece) => (
      <img
        key={piece.id}
        src={piece.url}
        alt={piece.alt ?? `art-${piece.id}`}
        style={{ maxWidth: '200px' }}
      />
    ))}
  </div>
);

export default ArtGallery;
