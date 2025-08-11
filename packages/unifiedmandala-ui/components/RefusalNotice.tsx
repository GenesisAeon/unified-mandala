import React from 'react';

export interface RefusalNoticeProps {
  message: string;
}

const RefusalNotice: React.FC<RefusalNoticeProps> = ({ message }) => (
  <div role="alert" aria-label="refusal notice">
    <p>{message}</p>
  </div>
);

export default RefusalNotice;
