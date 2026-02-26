import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="키워드를 직접 입력하세요..."
        className="flex-grow px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      />
      <button 
        onClick={handleSearch}
        className="px-5 py-2 text-base font-semibold text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        검색
      </button>
    </div>
  );
}