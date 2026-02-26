import { DEFAULT_KEYWORDS } from "../utils/keywords";

export default function KeywordChips({ onSelect, selectedKeywords }) {
  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULT_KEYWORDS.map((kw) => {
        const isSelected = selectedKeywords.includes(kw);
        return (
          <button 
            key={kw} 
            onClick={() => onSelect(kw)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSelected 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`
            }
          >
            {kw}
          </button>
        )}
      )}
    </div>
  );
}