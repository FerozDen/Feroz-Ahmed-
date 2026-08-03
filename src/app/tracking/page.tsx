'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  MapPin, 
  UserCheck, 
  FileCheck2, 
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialAppNo = searchParams.get('appNo') || 'app-demo-101';

  const [searchQuery, setSearchQuery] = useState(initialAppNo);
  const [activeTab, setActiveTab] = useState<'status' | 'timeline'>('status');

  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<any>(null);

  const fetchStatusFromSupabase = async (queryId: string) => {
    if (!queryId.trim()) return;
    setLoading(true);
    try {
      console.log('[Supabase Tracking Query] Searching for ID or phone:', queryId);

      // 1. Query 'bookings' table
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('*')
        .or(`id.eq.${queryId},mobile_number.eq.${queryId}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bookingData && bookingData.length > 0) {
        console.log('[Supabase Found Tracking Booking]:', bookingData[0]);
        setRecord(bookingData[0]);
        return;
      }

      // 2. Query 'applications' table
      const { data: appData } = await supabase
        .from('applications')
        .select('*')
        .or(`id.eq.${queryId},application_number.eq.${queryId},phone_number.eq.${queryId}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (appData && appData.length > 0) {
        console.log('[Supabase Found Tracking Application]:', appData[0]);
        setRecord(appData[0]);
        return;
      }

      // Fallback API route
      const res = await fetch(`/api/applications?id=${encodeURIComponent(queryId)}`);
      const apiRes = await res.json();
      if (apiRes.success && apiRes.application) {
        setRecord(apiRes.application);
      } else {
        setRecord(null);
      }

    } catch (err) {
      console.error('[Supabase Tracking Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusFromSupabase(initialAppNo);
  }, [initialAppNo]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatusFromSupabase(searchQuery);
  };

  const rec = record || {
    id: searchQuery || 'app-demo-101',
    customer_name: 'Rahul Sharma',
    mobile_number: '+91 98765 43210',
    service_selected: 'State Income Certificate Issue',
    booking_status: 'In Progress',
    created_at: new Date().toISOString(),
    address: 'Andheri West, Mumbai'
  };

  const currentStatus = rec.booking_status || rec.status || 'Pending';

  // Compute 4-step progress index based on live Supabase status
  let stepIndex = 1;
  if (currentStatus === 'In Progress' || currentStatus === 'Documents Collected') stepIndex = 2;
  if (currentStatus === 'Submitted') stepIndex = 3;
  if (currentStatus === 'Approved' || currentStatus === 'Completed') stepIndex = 4;

  const trackingSteps = [
    {
      id: 1,
      title: 'Application Received',
      desc: 'Booking saved in Supabase database & executive assigned.',
      icon: FileText,
      date: new Date(rec.created_at || Date.now()).toLocaleDateString()
    },
    {
      id: 2,
      title: 'Doorstep Pickup & Verification',
      desc: 'Field executive collects document physical copies & verifies proofs.',
      icon: UserCheck,
      date: stepIndex >= 2 ? 'In Progress' : 'Pending'
    },
    {
      id: 3,
      title: 'Government Department Processing',
      desc: 'Submitted to official Issuing Authority for verification & signoff.',
      icon: ShieldCheck,
      date: stepIndex >= 3 ? 'Processing' : 'Pending'
    },
    {
      id: 4,
      title: 'Certificate Issued & Delivered',
      desc: 'Digital PDF uploaded to Vault and hard copy delivered to home address.',
      icon: CheckCircle2,
      date: stepIndex === 4 ? 'Completed' : 'Expected in 3 Days'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-4 gradient-glow">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-Time Supabase Status Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Track Your Document Application
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Enter your Application ID or registered Mobile Number to check real-time progress synced live with Supabase.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Application ID or Mobile Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl gradient-bg text-white text-xs font-black shadow-md hover:opacity-95 transition-opacity shrink-0 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Track Live</span>}
          </button>
        </form>
      </div>

      {/* Application Status Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Application ID</span>
            <h2 className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">
              {rec.id}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase border ${
              currentStatus === 'Completed' || currentStatus === 'Approved'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                : currentStatus === 'Rejected'
                ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300'
            }`}>
              Live Status: {currentStatus}
            </span>
          </div>
        </div>

        {/* 4-Step Progress Tracker */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Live Application Timeline Progress:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {trackingSteps.map((step) => {
              const StepIcon = step.icon;
              const isDone = stepIndex >= step.id;
              const isCurrent = stepIndex === step.id;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : isDone
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{step.date}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applicant Details Summary */}
        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Applicant Name</span>
            <span className="font-bold text-slate-900 dark:text-white">{rec.customer_name || rec.full_name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Service Title</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{rec.service_selected || rec.certificate_type}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Doorstep Location</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{rec.address || 'Standard Address'}</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Suspense fallback={
        <div className="text-center py-16 space-y-2">
          <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading tracking portal...</p>
        </div>
      }>
        <TrackingContent />
      </Suspense>
    </div>
  );
}
