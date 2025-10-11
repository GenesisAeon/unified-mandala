import React, { useEffect, useState } from 'react';

interface ReviewItem {
  id: string;
  text: string;
}

/**
 * ReviewerPanel fetches review items and allows approving or rejecting them
 * via simple API calls. Derived from guidance in `newadvancedconversations.json`.
 */
export default function ReviewerPanel() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/review/items')
      .then((r) => r.json())
      .then((json) => {
        setItems(json.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const decide = (id: string, decision: 'approve' | 'reject') => {
    fetch('/review/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, decision }),
    }).then(() => setItems((prev) => prev.filter((i) => i.id !== id)));
  };

  if (loading) {
    return <div aria-label="ReviewerPanel">Loading...</div>;
  }
  if (items.length === 0) {
    return <div aria-label="ReviewerPanel">No review items</div>;
  }

  return (
    <div aria-label="ReviewerPanel">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.text}
            <button onClick={() => decide(item.id, 'approve')}>Approve</button>
            <button onClick={() => decide(item.id, 'reject')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
