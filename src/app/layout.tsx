import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'certiR - One Platform For All Documents | Marketplace, Store, Track & Renew',
  description: 'Manage all your documents in one place. Apply for Aadhaar, PAN, Income, Residence, Driving Licence, store in digital vault, track application status, and renew certificates.',
  keywords: ['certiR', 'document store', 'aadhaar', 'pan card', 'income certificate', 'residence certificate', 'document vault', 'document renewal', 'track application'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
