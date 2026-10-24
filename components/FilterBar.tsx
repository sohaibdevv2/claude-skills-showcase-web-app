interface FilterBarProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

const tags = [
  "productivity",
  "automation",
  "creative",
  "tool",
  "data analysis",
  "game",
];

const tagStyles: Record<string, string> = {
  productivity: "bg-warm-blue text-white shadow-sm hover:bg-warm-blue active:bg-warm-blue",
  automation: "bg-warm-coral text-white shadow-sm hover:bg-warm-coral active:bg-warm-coral",
  creative: "bg-warm-lavender text-white shadow-sm hover:bg-warm-lavender active:bg-warm-lavender",
  tool: "bg-warm-pink text-white shadow-sm hover:bg-warm-pink active:bg-warm-pink",
  "data analysis": "bg-warm-blue text-white shadow-sm hover:bg-warm-blue active:bg-warm-blue",
  game: "bg-warm-pink text-white shadow-sm hover:bg-warm-pink active:bg-warm-pink",
};

const tagHoverStyles: Record<string, string> = {
  productivity: "hover:bg-warm-blue/20 hover:text-warm-blue",
  automation: "hover:bg-warm-coral/20 hover:text-warm-coral",
  creative: "hover:bg-warm-lavender/20 hover:text-warm-lavender",
  tool: "hover:bg-warm-pink/20 hover:text-warm-pink",
  "data analysis": "hover:bg-warm-blue/20 hover:text-warm-blue",
  game: "hover:bg-warm-pink/20 hover:text-warm-pink",
};

export default function FilterBar({
  selectedTags,
  onTagToggle,
  searchQuery,
  onSearchChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = selectedTags.length > 0 || searchQuery !== "";

  return (
    <div className="bg-[#EBE8E1] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:gap-8">
        {/* Tag Filters */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-warm-text/70 mb-2 sm:mb-3 font-sans">
            Categories
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {tags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              const activeStyle = tagStyles[tag] || "bg-warm-coral text-white shadow-sm";
              const hoverStyle = tagHoverStyles[tag] || "hover:bg-warm-coral/20 hover:text-warm-coral";
              return (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`px-3 sm:px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200 min-h-[44px] ${
                    isActive
                      ? activeStyle
                      : `bg-white/70 text-warm-text ${hoverStyle} active:bg-white/90`
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full lg:w-72">
          <label className="block text-sm font-medium text-warm-text/70 mb-2 sm:mb-3 font-sans">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-4 py-3 min-h-[44px] text-base sm:text-sm text-warm-text bg-white/80 border-0 rounded-xl placeholder:text-warm-text/40 focus:outline-none focus:ring-2 focus:ring-warm-coral/30 focus:bg-white transition-all duration-200 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-warm-text/40 hover:text-warm-text active:text-warm-text/60 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-warm-text/10">
          <button
            onClick={onClearFilters}
            className="min-h-[44px] px-3 py-2 -ml-3 text-sm font-medium text-warm-coral hover:text-warm-coral/80 active:text-warm-coral/60 transition-colors font-sans flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
