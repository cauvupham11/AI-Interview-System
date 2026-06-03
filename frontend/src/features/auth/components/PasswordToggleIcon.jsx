function PasswordToggleIcon({ onToggle, visible }) {
  return (
    <button
      className="auth-password-toggle"
      type="button"
      aria-label={visible ? "Hide password" : "Show password"}
      onClick={onToggle}
    >
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {visible ? (
          <>
            <path d="m3 3 18 18" />
            <path d="M10.7 5.08A9.3 9.3 0 0 1 12 5c6 0 9.5 7 9.5 7a17.2 17.2 0 0 1-3.22 4.05" />
            <path d="M6.62 6.62C3.8 8.54 2.5 12 2.5 12s3.5 7 9.5 7a9.5 9.5 0 0 0 4.38-1.05" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
          </>
        ) : (
          <>
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  );
}

export default PasswordToggleIcon;
