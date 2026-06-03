const icons = {
  user: (
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />
  ),
  mail: (
    <>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  lock: (
    <>
      <path d="M6 10h12v10H6z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </>
  ),
};

function AuthInput({ error, icon = "user", label, rightElement, ...props }) {
  const inputId = props.id || props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="auth-input-label">
      <span className="auth-input-label-text">{label}</span>
      <span className={`auth-input-shell ${error ? "auth-input-shell-error" : ""}`}>
        <svg
          className="auth-input-icon"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {icons[icon]}
        </svg>
        <input
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className="auth-input"
          id={inputId}
          {...props}
        />
        {rightElement}
      </span>
      {error ? (
        <span className="auth-field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

export default AuthInput;
