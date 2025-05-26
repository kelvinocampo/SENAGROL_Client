import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="">
      <input
        type="text"
        placeholder="🔎 Buscar por nombre"
        className="w-full p-2 rounded border border-gray-300 bg-[#E4FBDD]"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};
