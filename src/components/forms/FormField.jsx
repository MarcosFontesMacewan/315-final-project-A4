// Label, input, and error message
export default function FormField({ label, error, children }) {
    return (
      <div className="form-field">
        <label>
          <span className="form-label">{label}</span>
          {children}
        </label>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }