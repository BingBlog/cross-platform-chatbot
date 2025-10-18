import React from 'react';
import { Input } from '../atoms';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  return (
    <div className="search-bar">
      <Input value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
};
