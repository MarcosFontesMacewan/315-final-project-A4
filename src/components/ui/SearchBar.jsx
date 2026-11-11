export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <input
      className="search-bar"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}