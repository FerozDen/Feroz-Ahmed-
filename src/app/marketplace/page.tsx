'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Calculator,
  ChevronRight
} from 'lucide-react';
import { INITIAL_SERVICES, ServiceItem } from '@/db/seed-data';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxFee, setMaxFee] = useState<number>(2000);

  const categories = ['All', 'Identity', 'Income & Tax', 'Residence & Caste', 'Vehicle & Driving', 'Business & Legal'];

  const filteredServices = useMemo(() => {
    return INITIAL_SERVICES.filter(service => {
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFee = service.feeAmount <= maxFee;
      return matchesCategory && matchesSearch && matchesFee;
    });
  }, [searchQuery, selectedCategory, maxFee]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 gradient-glow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              Document Services Marketplace
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Apply For Government & Personal Certificates
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Transparent fees, official processing timelines, required document checklists, and direct online filing for all essential certificates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-center md:text-right shrink-0">
            <span className="text-xs text-slate-500 uppercase font-semibold block">Available Services</span>
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">10+ Active</span>
          </div>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Search Input */}
        <div className="lg:col-span-6 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service name, document type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Max Fee Slider */}
        <div className="lg:col-span-6 glass-card p-3 rounded-xl flex items-center gap-4">
          <Calculator className="w-5 h-5 text-indigo-500 shrink-0 ml-2" />
          <div className="w-full flex flex-col">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Max Fee Filter:</span>
              <span className="text-indigo-600 dark:text-indigo-400">₹{maxFee}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'gradient-bg text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200/80 dark:border-slate-800 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {service.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>

                {/* Required Docs checklist preview */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Required Documents:</span>
                  <div className="space-y-1">
                    {service.requiredDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Turnaround Footer */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Total Fee</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      ₹{service.feeAmount}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Estimated Days</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.estimatedDays} Business Days
                    </span>
                  </div>
                </div>

                <Link
                  href={`/marketplace/${service.id}/apply`}
                  className="w-full py-3 rounded-xl gradient-bg text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-md"
                >
                  <span>Start Application</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 space-y-3">
            <Search className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Services Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or fee filter slider.</p>
          </div>
        )}
      </div>

    </div>
  );
}
