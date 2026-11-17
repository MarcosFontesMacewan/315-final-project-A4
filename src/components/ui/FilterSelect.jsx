import '../../styles/filter-select.css';

// A dropdown filter
export default function FilterSelect({ label, options, selected, onSelect }) {
  return (
    <label className="filter-select">
      <span className="filter-label">{label}:</span>
      <select
        value={selected ?? ''}
        onChange={(e) => onSelect(e.target.value || null)}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}