import React from 'react';
import { ChatSession } from '../../types';

interface SessionListProps {
  sessions: ChatSession[];
  onSessionSelect: (session: ChatSession) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onSessionSelect,
}) => {
  return (
    <div className="session-list">
      {sessions.map(session => (
        <div
          key={session.id}
          className="session-item"
          onClick={() => onSessionSelect(session)}
        >
          <div className="session-title">{session.title}</div>
          <div className="session-meta">
            {session.messageCount} messages •{' '}
            {session.updatedAt.toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};
