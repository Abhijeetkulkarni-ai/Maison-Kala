import "./globals.css";

export const metadata = {
  title: "Maison Kala — Thoughtfully Made Home Décor",
  description:
    "Discover artisan-inspired wall décor, table accessories and thoughtful gifts from Maison Kala. Thoughtful objects for considered living.",
  applicationName: "Maison Kala",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
