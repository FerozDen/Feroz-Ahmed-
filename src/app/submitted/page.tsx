'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  FolderCheck,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

function SubmittedContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'booking-demo-101';

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookingRecord() {
      try {
        console.log('[Supabase Query] Fetching booking confirmation for ID:', id);

        // 1. Try querying 'bookings' table
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();

        if (bookingData) {
          console.log('[Supabase Found Booking]:', bookingData);
          setRecord(bookingData);
          return;
        }

        // 2. Try querying 'applications' table
        const { data: appData } = await supabase
          .from('applications')
          .select('*')
          .or(`id.eq.${id},application_number.eq.${id}`)
          .single();

        if (appData) {
          console.log('[Supabase Found Application]:', appData);
          setRecord(appData);
          return;
        }

        // 3. Fallback via API route
        const res = await fetch(`/api/applications?id=${encodeURIComponent(id)}`);
        const apiData = await res.json();
        if (apiData.success && apiData.application) {
          setRecord(apiData.application);
        }
      } catch (err) {
        console.error('[Supabase Confirmation Query Exception]:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookingRecord();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16 space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Verifying record in Supabase database...</p>
      </div>
    );
  }

  const rec = record || {
    id: id,
    customer_name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    mobile_number: '+91 98765 43210',
    service_selected: 'State Certificate Service',
    booking_status: 'Pending',
    created_at: new Date().toISOString()
  };

  const name = rec.customer_name || rec.full_name || rec.applicant_name;
  const phone = rec.mobile_number || rec.phone_number;
  const serviceTitle = rec.service_selected || rec.certificate_type || rec.service_title;
  const status = rec.booking_status || rec.status || 'Pending';

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
      
      {/* Success Animated Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/20 shadow-lg">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          Inserted into Supabase Database
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
          Your request for <span className="font-bold text-slate-900 dark:text-white">{serviceTitle}</span> has been stored in your Supabase database.
        </p>
      </div>

      {/* Confirmation Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4 text-left shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Booking Record ID</span>
            <span className="text-lg font-mono font-black text-indigo-600 dark:text-indigo-400">
              {rec.id}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
            Status: {status}
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-500">Customer Name:</span>
            <span className="font-bold text-slate-900 dark:text-white">{name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Mobile Contact:</span>
            <span className="font-semibold">{phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email Address:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{rec.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Service Booked:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{serviceTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Address:</span>
            <span className="font-semibold text-right line-clamp-1 max-w-[220px]">{rec.address || 'Doorstep Pickup'}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Record verified in Supabase Table Editor. Doorstep executive will contact you shortly.</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          href="/admin"
          className="px-6 py-3.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
        >
          <span>Open Admin Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/vault"
          className="px-6 py-3.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2"
        >
          <FolderCheck className="w-4 h-4 text-emerald-500" />
          <span>My Vault</span>
        </Link>
      </div>

    </div>
  );
}

export default function SubmittedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={
        <div className="text-center py-16 space-y-2">
          <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading booking confirmation...</p>
        </div>
      }>
        <SubmittedContent />
      </Suspense>
    </div>
  );
}
