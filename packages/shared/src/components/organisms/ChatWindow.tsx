import React from 'react';
import { Message } from '../../types';
import { MessageBubble } from '../molecules';

interface ChatWindowProps {
  messages: Message[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
};
