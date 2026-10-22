
"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Maison Kala root error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="mk-error mk-error--global">
          <div className="mk-error__content">
            <span className="mk-error__eyebrow">
              MAISON KALA
            </span>

            <p className="mk-error__code">500</p>

            <h1>A moment to reset.</h1>

            <p className="mk-error__description">
              We&apos;re experiencing an unexpected issue.
              Please try again in a moment.
            </p>

            <div className="mk-error__actions">
              <button
                type="button"
                className="mk-error__button"
                onClick={() => reset()}
              >
                Try again <span aria-hidden="true">↻</span>
              </button>

              <a href="/" className="mk-error__back">
                Return home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
