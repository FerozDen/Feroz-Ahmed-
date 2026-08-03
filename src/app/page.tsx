'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  FolderCheck, 
  FileText, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Lock, 
  Clock, 
  Zap, 
  TrendingUp, 
  HelpCircle,
  UploadCloud,
  ChevronRight,
  Shield,
  Star
} from 'lucide-react';
import { INITIAL_SERVICES } from '@/db/seed-data';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingAppNo, setTrackingAppNo] = useState('');

  const filteredServices = INITIAL_SERVICES.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Glowing Ambient Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/20 dark:bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider animate-pulse-slow">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Unified Document Ecosystem • certiR</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              One Platform For <br className="hidden sm:block" />
              All Your <span className="gradient-text">Documents & Services</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Store, apply, track, and renew your Aadhaar, PAN, Income, Residence, Driving Licence, and government certificates in one encrypted digital platform.
            </p>

            {/* Main Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative flex items-center glass-card rounded-2xl p-2 shadow-xl border border-slate-200/80 dark:border-slate-800">
                <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search document service (e.g. Aadhaar, PAN, Income Cert, DL)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
                <Link
                  href={`/marketplace${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="gradient-bg text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-95 transition-all shadow-md shrink-0 flex items-center gap-2"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Popular:</span>
                {['Aadhaar Enrolment', 'PAN Card', 'Income Cert', 'Driving Licence', 'Domicile'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-md bg-slate-200/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Government Standard Standard Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>256-Bit Encrypted Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Automated Expiry Alerts</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 CORE PLATFORM PILLARS (Apply, Store, Track, Renew) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Everything You Need For Your Documents
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Engineered with modern Next.js frontends and Python FastAPI intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Apply */}
          <div className="glass-card p-6 rounded-2xl hover:border-indigo-500/50 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Document Marketplace</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Apply for Aadhaar, PAN, Income, Residence, Caste, and Business certificates with transparent fees & processing times.
            </p>
            <Link href="/marketplace" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              <span>Browse Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2: Store (Vault) */}
          <div className="glass-card p-6 rounded-2xl hover:border-emerald-500/50 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Digital Vault (Store)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload and store all your personal identity, tax, and educational certificates safely with FastAPI OCR verification.
            </p>
            <Link href="/vault" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              <span>Open Vault</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 3: Track */}
          <div className="glass-card p-6 rounded-2xl hover:border-amber-500/50 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Status Tracker</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track active application progress stage-by-stage with real-time state authority server status updates.
            </p>
            <Link href="/tracking" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
              <span>Track Application</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 4: Renew */}
          <div className="glass-card p-6 rounded-2xl hover:border-cyan-500/50 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Renewal Management</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated reminders before document expiration (DL, Passport, Income Cert) and 1-click renewal workflows.
            </p>
            <Link href="/renewals" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
              <span>Check Expirations</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* POPULAR SERVICES CATALOG PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Top Document Services
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Featured Application Services
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-slate-200/80 dark:border-slate-800 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Govt & Service Fee</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    ₹{service.feeAmount}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Processing Time</span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    {service.estimatedDays} Days
                  </span>
                </div>
              </div>

              <Link
                href={`/marketplace/${service.id}/apply`}
                className="w-full py-2.5 rounded-xl gradient-bg text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-sm"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK TRACKING SEARCH WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 gradient-glow relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>Live Status Sync</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Track Any Application Instantly
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Have an existing application reference number? Enter it below to fetch real-time state authority tracking updates via our FastAPI backend pipeline.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Enter Reference No (e.g. CR-2026-849201)"
                  value={trackingAppNo}
                  onChange={(e) => setTrackingAppNo(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <Link
                  href={`/tracking${trackingAppNo ? `?appNo=${encodeURIComponent(trackingAppNo)}` : '?appNo=CR-2026-849201'}`}
                  className="px-6 py-3 rounded-xl gradient-bg text-white font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Status</span>
                </Link>
              </div>
            </div>

            {/* Right Graphic Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">Ref: CR-2026-849201</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                    Step 3/4 • Active
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Application Submitted</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Document Verification</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Clock className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                    <span className="font-bold text-amber-600 dark:text-amber-400">RTO Authority Processing</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Got questions about how certiR works? Here are answers.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'What document services are provided on certiR?',
              a: 'certiR provides end-to-end assistance and direct issue/renewal applications for Aadhaar Card, PAN Card, State Income Certificates, Domicile/Residence, Caste Certificates, Driving Licence renewals, Passport filing, and GST Registration.'
            },
            {
              q: 'How does the Document Vault store my certificates securely?',
              a: 'All files stored in the Vault are encrypted using 256-bit AES encryption. They are accessible only by you, with automated metadata extraction powered by our FastAPI AI microservice.'
            },
            {
              q: 'How do document expiry reminders work?',
              a: 'When you upload documents into your Vault, our system tracks expiration dates (e.g. DL, Passport, Income Cert). You receive automated notifications 30 days prior to expiry with a 1-click renewal option.'
            },
            {
              q: 'Which database and tech stack does certiR use?',
              a: 'certiR is built using Next.js App Router for frontend, Drizzle ORM connected to Supabase Postgres database, NextAuth Google Authentication, and Python FastAPI microservice for AI processing.'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{item.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
