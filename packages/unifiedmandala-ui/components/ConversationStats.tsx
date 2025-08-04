import React from 'react';

export interface ConversationStatsProps {
  conversationCount: number;
  messageCount: number;
}

const ConversationStats: React.FC<ConversationStatsProps> = ({ conversationCount, messageCount }) => (
  <div aria-label="Conversation Stats">
    <p>Total Conversations: <span>{conversationCount}</span></p>
    <p>Total Messages: <span>{messageCount}</span></p>
  </div>
);

export default ConversationStats;
