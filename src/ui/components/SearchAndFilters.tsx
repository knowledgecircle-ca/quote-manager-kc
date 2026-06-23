interface FilterOption {
  label: string;
  options: string[];
}

interface SearchAndFiltersProps {
  searchLabel: string;
  filters: FilterOption[];
}

export function SearchAndFilters({ filters, searchLabel }: SearchAndFiltersProps) {
  return (
    <form className="filter-bar" aria-label={`${searchLabel} filters`}>
      <label>
        {searchLabel}
        <input type="search" />
      </label>
      {filters.map((filter) => (
        <label key={filter.label}>
          {filter.label}
          <select defaultValue="All">
            <option>All</option>
            {filter.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      ))}
    </form>
  );
}
