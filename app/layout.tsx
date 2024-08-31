import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import clsx from "clsx";
import { DM_Sans } from "next/font/google";
import "./styles/globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trajectory.AI",
  description: "AI generated Roadmaps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={clsx(dmSans.className, "antialiased")}>{children}</body>
    </html>
    </ClerkProvider>
  );
}