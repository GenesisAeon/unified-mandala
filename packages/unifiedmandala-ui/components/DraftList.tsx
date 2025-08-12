import React from 'react';

interface Draft {
  id: string;
  title: string;
}

interface DraftListProps {
  drafts: Draft[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

/**
 * DraftList renders a list of drafts with approve and reject controls.
 */
const DraftList: React.FC<DraftListProps> = ({ drafts, onApprove, onReject }) => {
  return (
    <div className="my-4">
      <h3>Entwurfsübersicht</h3>
      <ul>
        {drafts.map((draft) => (
          <li key={draft.id} className="mb-2 flex items-center space-x-2">
            <span className="flex-1">{draft.title}</span>
            <button onClick={() => onApprove(draft.id)}>Approve</button>
            <button onClick={() => onReject(draft.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DraftList;
