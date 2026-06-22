import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProviders } from "@/app/components/theme/ThemeProviders";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sacred 5",
  description:
    "Track your five sacred daily practices: walks, cold showers, journaling, and meditation. Build the discipline that compounds.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProviders>
          {children}
          <Toaster richColors closeButton />
        </ThemeProviders>
      </body>
    </html>
  );
}
