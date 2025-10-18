import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <div className="chat-layout">
      <div className="chat-sidebar">{/* Sidebar content */}</div>
      <div className="chat-main">{children}</div>
    </div>
  );
};
