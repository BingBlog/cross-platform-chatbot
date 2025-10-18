import React from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className={`message-bubble message-${message.role}`}>
      <div className="message-content">{message.content}</div>
      <div className="message-timestamp">
        {message.timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
};
