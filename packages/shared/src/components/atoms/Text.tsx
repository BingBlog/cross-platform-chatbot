import React from 'react';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  className = '',
}) => {
  const Component = variant.startsWith('h') ? variant : 'p';
  return React.createElement(
    Component,
    { className: `text-${variant} ${className}` },
    children
  );
};
