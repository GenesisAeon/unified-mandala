import { useEffect } from 'react';

interface ReviewerHotkeysProps {
  currentId: string | null;
}

/**
 * ReviewerHotkeys listens for A/R/H keys and submits review decisions.
 * Derived from guidance in `newadvancedconversations.json`.
 */
export default function ReviewerHotkeys({ currentId }: ReviewerHotkeysProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!currentId) return;
      const key = e.key.toLowerCase();
      if (!['a', 'r', 'h'].includes(key)) return;
      const decision = key === 'a' ? 'approve' : key === 'r' ? 'reject' : 'hold';
      fetch('/review/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentId, decision })
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentId]);

  return null;
}
