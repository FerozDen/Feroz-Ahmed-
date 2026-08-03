'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Clock, 
  Building2, 
  PhoneCall, 
  MessageSquare, 
  Star, 
  ChevronDown, 
  UserCheck, 
  FileText, 
  CheckCircle, 
  Award,
  Users,
  Baby,
  TrendingUp,
  Home,
  Heart,
  Key,
  Building,
  Car,
  Globe,
  CreditCard,
  Fingerprint,
  Briefcase
} from 'lucide-react';
import { INITIAL_SERVICES, ServiceItem } from '@/db/seed-data';
import QuickBookingModal from '@/components/QuickBookingModal';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = ['All', 'Identity', 'Income & Tax', 'Residence & Caste', 'Property & Certificates', 'Vehicle & Driving'];

  const filteredServices = INITIAL_SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleOpenBookingModal = (service: ServiceItem) => {
    setSelectedServiceForModal(service);
    setIsModalOpen(true);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby': return Baby;
      case 'TrendingUp': return TrendingUp;
      case 'ShieldCheck': return ShieldCheck;
      case 'Award': return Award;
      case 'Home': return Home;
      case 'Heart': return Heart;
      case 'Key': return Key;
      case 'Building': return Building;
      case 'Car': return Car;
      case 'Globe': return Globe;
      case 'CreditCard': return CreditCard;
      case 'Fingerprint': return Fingerprint;
      default: return FileText;
    }
  };

  const faqs = [
    {
      q: 'Do I need to visit government offices or fill complex forms?',
      a: 'No! With CertiR, you never have to stand in long queues or fill government forms. You simply book online, and our trained executive visits your home to collect physical documents.'
    },
    {
      q: 'How fast will a CertiR executive contact me after booking?',
      a: 'Our team contacts you on phone and WhatsApp within 30 minutes of booking to confirm your address and schedule doorstep pickup.'
    },
    {
      q: 'Is document uploading mandatory on the website?',
      a: 'No, uploading documents is completely optional! If you don’t have scanned copies, our executive will inspect and collect physical copies directly from your doorstep.'
    },
    {
      q: 'Are CertiR certificates 100% official and valid?',
      a: 'Yes, 100%! All applications are submitted directly to official Government Issuing Authorities (Tehsildar offices, RTOs, Municipal Corporations, UIDAI, Income Tax Dept). You receive official QR-verified certificates.'
    },
    {
      q: 'How can I track my application status?',
      a: 'You can track your live application status anytime on our website using your Application ID or Mobile Number. We also send real-time SMS and WhatsApp progress alerts.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-600/15 dark:bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/15 dark:bg-emerald-500/15 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/90 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Doorstep Government Certificate Platform • CertiR</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Government Certificates & Documents <br className="hidden sm:block" />
              <span className="gradient-text">Delivered To Your Doorstep</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Never fill complex government forms again. Simply book a service — our team contacts you within 30 mins, collects documents at your doorstep, files the application, and delivers your certificate.
            </p>

            {/* Hero Search Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex items-center glass-card rounded-2xl p-2 shadow-2xl border border-slate-200/80 dark:border-slate-800">
                <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search service (Birth, Income, Caste, EWS, Marriage, Passport, PAN)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
                <button
                  onClick={() => {
                    const matched = filteredServices[0];
                    if (matched) handleOpenBookingModal(matched);
                  }}
                  className="gradient-bg text-white px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm hover:opacity-95 transition-all shadow-md shrink-0 flex items-center gap-2"
                >
                  <span>Book Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Service Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-300">Popular:</span>
                {['Birth Cert', 'Income Cert', 'Caste Cert', 'EWS', 'Marriage Cert', 'Passport', 'PAN Card'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 font-semibold transition-all shadow-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Trust Highlights */}
            <div className="pt-8 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs font-extrabold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Doorstep Executive Visit</span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>30-Min Executive Contact</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2 rounded-xl border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>100% Government Compliant</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICES CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Service Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Select & Book Your Document Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Choose your required certificate below. Click <strong>Book Now</strong> to schedule doorstep collection.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-200/60 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedCategory === cat
                    ? 'gradient-bg text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const IconComp = getServiceIcon(service.icon);

            return (
              <div
                key={service.id}
                className="glass-card rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl hover:border-indigo-500/50 transition-all border border-slate-200/80 dark:border-slate-800 space-y-6 group relative"
              >
                <div className="space-y-4">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {service.category}
                    </span>
                    {service.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {service.title}
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> Delivery in {service.estimatedDays} Days
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  {/* Document Proofs Tag */}
                  <div className="p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Proofs (Doorstep Collection):</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                      {service.requiredDocs.join(' • ')}
                    </p>
                  </div>

                </div>

                {/* Card Footer & Instant Booking Trigger */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Service Fee</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      ₹{service.feeAmount}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenBookingModal(service)}
                    className="gradient-bg text-white px-5 py-2.5 rounded-xl font-black text-xs hover:opacity-95 transition-opacity shadow-md flex items-center gap-1.5"
                  >
                    <span>BOOK NOW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* 3. HOW IT WORKS (4-STEP DOORSTEP JOURNEY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 gradient-glow space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
              Effortless Customer Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              How CertiR Doorstep Service Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We handle everything end-to-end so you never have to deal with bureaucracy or long lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="space-y-4 text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl gradient-bg text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Book Online (2 Mins)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Select your service, enter your name & mobile number. No complex government forms!
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Doorstep Collection</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our agent calls you within 30 mins and visits your doorstep to collect document proofs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Filing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                CertiR legal experts file your application with official government issuing departments.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Certificate Delivered</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Official certificate delivered to your doorstep & digital copy saved in your Vault.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. STATISTICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-3xl sm:text-4xl font-black gradient-text">50,000+</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Certificates Issued</span>
          </div>

          <div className="glass-card p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">99.4%</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Approval Rate</span>
          </div>

          <div className="glass-card p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">&lt; 30 Mins</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Executive Call Time</span>
          </div>

          <div className="glass-card p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">15+ Cities</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Doorstep Coverage</span>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            Verified Reviews
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Trusted By 50,000+ Happy Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "Getting an Income Certificate used to take 3 visits to the Tehsildar office. With CertiR, the executive came to my home, verified my salary slips, and delivered the certificate in 6 days!"
            </p>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Priya Deshmukh</span>
              <span className="text-slate-400 font-mono text-[10px]">Income Certificate</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "Booked Birth Certificate copy online for my daughter. Got a call from CertiR in 15 mins. Highly professional service with WhatsApp status updates throughout!"
            </p>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Vikram Reddy</span>
              <span className="text-slate-400 font-mono text-[10px]">Birth Certificate</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "Needed Tatkal Passport assistance for an urgent international trip. CertiR team handled appointment filing and guided police verification smoothly."
            </p>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Ananya Sen</span>
              <span className="text-slate-400 font-mono text-[10px]">Passport Assistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">Everything you need to know about CertiR doorstep certificate services.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTANT BOOKING MODAL */}
      <QuickBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedServiceForModal}
      />

    </div>
  );
}
