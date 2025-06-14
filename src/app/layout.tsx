import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hiring Insights Dashboard',
  description: 'Hiring Insights Dashboard with Analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
