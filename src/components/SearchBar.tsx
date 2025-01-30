import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Search tasks...", className = "" }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
        size={20}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full pl-12 pr-4 py-3 rounded-lg
          bg-enact-muted border border-transparent
          focus:border-enact-accent/30 focus:outline-none
          text-enact-text placeholder-gray-400
          transition-all duration-200
          ${className}
        `}
      />
    </div>
  );
};