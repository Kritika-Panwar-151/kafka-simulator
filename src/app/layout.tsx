import "./globals.css";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=1200, user-scalable=no" />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}