
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Maison Kala application error:", error);
  }, [error]);

  return (
    <main className="mk-error mk-error--compact">
      <div className="mk-error__content">
        <span className="mk-error__eyebrow">
          MAISON KALA
        </span>

        <div className="mk-error__symbol" aria-hidden="true">
          !
        </div>

        <h1>Something went wrong.</h1>

        <p className="mk-error__description">
          An unexpected moment interrupted your experience.
          Your style journey doesn&apos;t have to end here.
        </p>

        <div className="mk-error__actions">
          <button
            type="button"
            className="mk-error__button"
            onClick={() => reset()}
          >
            Try again <span aria-hidden="true">↻</span>
          </button>

          <Link href="/" className="mk-error__back">
            Return home
          </Link>
        </div>

        <p className="mk-error__footnote">
          WE&apos;LL HELP YOU FIND YOUR WAY.
        </p>
      </div>
    </main>
  );
}
