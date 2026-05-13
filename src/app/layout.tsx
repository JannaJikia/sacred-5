import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProviders } from "@/app/components/theme/ThemeProviders";

export const metadata: Metadata = {
  title: "Sacred 5",
  description: "Track your five sacred daily practices — walks, cold showers, journaling, and meditation.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]"
        style={
          {
            "--font-geist-sans":
              'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            "--font-geist-mono":
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          } as React.CSSProperties
        }
      >
        <ThemeProviders>
          {children}
          <Toaster richColors closeButton />
        </ThemeProviders>
      </body>
    </html>
  );
}
