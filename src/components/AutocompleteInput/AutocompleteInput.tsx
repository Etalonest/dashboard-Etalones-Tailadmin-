// AutocompleteInput.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface AutocompleteInputProps {
  label: string;
  suggestions: string[];
  placeholder: string;
  onChange: (value: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  suggestions,
  placeholder,
  onChange
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    onChange(value); 
    setFilteredSuggestions(
      suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
  };

  return (
    <div className="relative">
      <Label>{label}</Label>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
      />
      {isFocused && filteredSuggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-y-auto z-[9999]">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
