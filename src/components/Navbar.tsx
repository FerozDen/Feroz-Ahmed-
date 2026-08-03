'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  FileText, 
  FolderCheck, 
  Search, 
  RefreshCw, 
  Grid, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell
} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = [
    { href: '/', label: 'Home', icon: Grid },
    { href: '/marketplace', label: 'Services Marketplace', icon: Search },
    { href: '/vault', label: 'Document Vault', icon: FolderCheck, badge: 'Store' },
    { href: '/tracking', label: 'Track Application', icon: FileText, badge: 'Live' },
    { href: '/renewals', label: 'Renewals Hub', icon: RefreshCw, badge: 'Alerts' },
    { href: '/admin', label: 'Admin Dashboard', icon: ShieldCheck, badge: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                certi<span className="gradient-text">R</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 -mt-1">
                One Platform • All Documents
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {/* Notification Icon */}
            <div className="relative">
              <button 
                className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="2 Urgent Expiry Alerts"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>
            </div>

            {/* User Auth Section */}
            {session?.user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center ring-2 ring-indigo-300 dark:ring-indigo-800">
                    {session.user.name?.[0] || 'U'}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {session.user.name || 'Rahul Sharma'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Verified Vault
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold shadow-md hover:opacity-95 transition-opacity"
              >
                <User className="w-4 h-4" />
                <span>Google Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {session?.user ? (
              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out ({session.user.name})</span>
              </button>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg gradient-bg text-white font-semibold shadow-md"
              >
                <User className="w-5 h-5" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
