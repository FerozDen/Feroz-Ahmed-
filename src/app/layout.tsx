import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import StickyActions from '@/components/StickyActions';

export const metadata: Metadata = {
  title: 'CertiR - Doorstep Government Certificate & Document Services',
  description: 'Book Birth, Income, Caste, EWS, Residence, Marriage, Passport, PAN, Aadhaar, and Government Certificates with doorstep document collection and 100% government compliance.',
  keywords: ['CertiR', 'birth certificate', 'income certificate', 'caste certificate', 'ews certificate', 'marriage certificate', 'doorstep document service', 'pan card', 'aadhaar service', 'passport assistance'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white pb-16 sm:pb-0">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <StickyActions />
        </Providers>
      </body>
    </html>
  );
}
