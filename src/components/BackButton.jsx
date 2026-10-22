
"use client";

export default function BackButton() {
  return (
    <button
      type="button"
      className="mk-error__back"
      onClick={() => window.history.back()}
    >
      Go back
    </button>
  );
}
