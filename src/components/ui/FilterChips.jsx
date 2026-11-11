export default function FilterChips({ label, options, selected, onSelect }) {
  return (
    <div className="filter-group">
      <span className="filter-label">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt}
          className={`chip ${selected === opt ? 'chip-active' : ''}`}
          onClick={() => onSelect(selected === opt ? null : opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}