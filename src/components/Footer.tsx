import Link from 'next/link';
import { ShieldCheck, Lock, CheckCircle2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                certi<span className="text-indigo-400">R</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India’s premier unified digital document marketplace & vault platform. Store, apply, track, and renew all government & personal certificates with ease.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Lock className="w-4 h-4" />
              <span>256-bit Encrypted Vault Storage</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Document Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/marketplace?cat=Identity" className="hover:text-indigo-400 transition-colors">Aadhaar Enrolment & Update</Link></li>
              <li><Link href="/marketplace?cat=Income" className="hover:text-indigo-400 transition-colors">PAN Card Allotment & Correction</Link></li>
              <li><Link href="/marketplace?cat=Income" className="hover:text-indigo-400 transition-colors">Tehsildar Income Certificate</Link></li>
              <li><Link href="/marketplace?cat=Residence" className="hover:text-indigo-400 transition-colors">State Domicile Certificate</Link></li>
              <li><Link href="/marketplace?cat=Vehicle" className="hover:text-indigo-400 transition-colors">Driving Licence Renewal</Link></li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/vault" className="hover:text-indigo-400 transition-colors">Digital Vault Storage</Link></li>
              <li><Link href="/tracking" className="hover:text-indigo-400 transition-colors">Real-time Application Tracker</Link></li>
              <li><Link href="/renewals" className="hover:text-indigo-400 transition-colors">Expiry Reminders & Renewals</Link></li>
              <li><a href="#fastapi-ocr" className="hover:text-indigo-400 transition-colors">FastAPI OCR Metadata Analysis</a></li>
              <li><a href="#supabase-drizzle" className="hover:text-indigo-400 transition-colors">Supabase Drizzle Layer</a></li>
            </ul>
          </div>

          {/* Government & Compliance Trust */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Compliance & Trust</h4>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>UIDAI & DigiLocker Standard Compatible</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Integrated with FastAPI microservice & Drizzle ORM layer connecting directly to Supabase Postgres.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 certiR Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with Next.js, FastAPI, Drizzle ORM & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
