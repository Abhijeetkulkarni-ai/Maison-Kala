
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mk-error">
      <div className="mk-error__content">
        <span className="mk-error__eyebrow">
          MAISON KALA — THE ART OF EVERYDAY
        </span>

        <p className="mk-error__code">404</p>

        <h1>A little detour.</h1>

        <p className="mk-error__description">
          The page you are looking for seems to have wandered
          somewhere else. Let&apos;s find something beautiful instead.
        </p>

        <div className="mk-error__actions">
          <Link href="/" className="mk-error__button">
            Return to shop <span aria-hidden="true">↗</span>
          </Link>

          <button
            type="button"
            className="mk-error__back"
            onClick={() => window.history.back()}
          >
            Go back
          </button>
        </div>

        <div className="mk-error__editorial">
          <div className="mk-error__image">
            <div className="mk-error__image-label">
              <span>01 / 04</span>
              <span>THE ART OF LESS</span>
            </div>
          </div>
        </div>

        <p className="mk-error__footnote">
          LOST IN THE DETAILS. FOUND IN THE JOURNEY.
        </p>
      </div>
    </main>
  );
}
