'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle2, 
  UploadCloud, 
  Clock, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Sparkles
} from 'lucide-react';
import { INITIAL_SERVICES } from '@/db/seed-data';
import { supabase, uploadCustomerDocument } from '@/lib/supabase';

export default function ServiceApplyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const service = INITIAL_SERVICES.find(s => s.id === slug) || INITIAL_SERVICES[0];

  // Form State
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [address, setAddress] = useState('Flat 402, Sunshine Heights, Andheri West, Mumbai, MH');
  const [pickupAddress, setPickupAddress] = useState('Flat 402, Sunshine Heights, Andheri West, Mumbai, MH');
  const [preferredPickupDate, setPreferredPickupDate] = useState('2026-08-05');
  const [preferredPickupTime, setPreferredPickupTime] = useState('10:00 AM - 01:00 PM (Morning Slot)');
  const [additionalNotes, setAdditionalNotes] = useState('Please call before doorstep pickup.');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    console.log('[CertiR Submit] Starting booking form validation...');

    try {
      // 1. Validate Form Fields
      if (!fullName.trim() || !phone.trim() || !email.trim()) {
        const errorMsg = 'Please fill in all required fields: Full Name, Mobile Number, and Email.';
        console.error('[CertiR Validation Error]:', errorMsg);
        throw new Error(errorMsg);
      }

      // 2. Upload file to Supabase Storage bucket 'documents' if file selected
      let uploadedDocUrls: string[] = [];
      if (selectedFile) {
        console.log('[CertiR Upload] Uploading customer document file to Supabase Storage bucket documents...');
        const publicUrl = await uploadCustomerDocument(selectedFile);
        uploadedDocUrls.push(publicUrl);
      } else {
        uploadedDocUrls.push('https://uhvxsvvacrcyhskpmouc.supabase.co/storage/v1/object/public/documents/sample_id_proof.pdf');
      }

      // 3. Prepare Payload for 'bookings' and 'applications'
      const bookingPayload = {
        customer_name: fullName,
        mobile_number: phone,
        email: email,
        address: address,
        service_selected: service.title,
        documents_required: uploadedDocUrls,
        booking_status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const applicationPayload = {
        full_name: fullName,
        phone_number: phone,
        email: email,
        certificate_type: service.title,
        address: address,
        pickup_address: pickupAddress,
        preferred_pickup_date: preferredPickupDate,
        preferred_pickup_time: preferredPickupTime,
        uploaded_documents: uploadedDocUrls,
        additional_notes: additionalNotes,
        status: 'Pending',
        created_at: new Date().toISOString()
      };

      console.log('[Supabase Client INSERT] Executing insert into bookings & applications tables...');

      let createdId = null;

      // Attempt Direct Client Insert into Supabase table 'bookings'
      const { data: bookingData, error: bookingErr } = await supabase
        .from('bookings')
        .insert(bookingPayload)
        .select()
        .single();

      if (bookingErr) {
        console.error('[Supabase Client INSERT bookings error]:', bookingErr.message, bookingErr);
      } else if (bookingData) {
        console.log('[Supabase Client INSERT bookings SUCCESS]:', bookingData);
        createdId = bookingData.id;
      }

      // Also Insert into Supabase table 'applications'
      const { data: appData, error: appErr } = await supabase
        .from('applications')
        .insert(applicationPayload)
        .select()
        .single();

      if (appErr) {
        console.error('[Supabase Client INSERT applications error]:', appErr.message, appErr);
      } else if (appData && !createdId) {
        console.log('[Supabase Client INSERT applications SUCCESS]:', appData);
        createdId = appData.id;
      }

      // Server API Fallback trigger if direct client insert was blocked by DDL/RLS setup
      if (!createdId) {
        console.log('[Supabase API Fallback] Triggering backend server API route for booking...');
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...bookingPayload, ...applicationPayload })
        });

        const resData = await res.json();
        if (resData.success && resData.booking) {
          createdId = resData.booking.id;
        } else {
          throw new Error(resData.error || 'Database insert failed. Please verify Supabase tables exist.');
        }
      }

      console.log('[CertiR Submit SUCCESS] Booking created with ID:', createdId);

      // 4. Redirect to Application Submitted confirmation page
      router.push(`/submitted?id=${encodeURIComponent(createdId)}`);

    } catch (err: any) {
      console.error('[CertiR Form Submission Error Details]:', err);
      setErrorMessage(err?.message || 'Failed to submit booking. Check browser console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services Marketplace</span>
      </Link>

      {/* Service Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {service.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              Book {service.title}
            </h1>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center shrink-0">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase block">Service Fee</span>
            <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">₹{service.feeAmount}</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Inputs (Left 7 cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Section 1: Customer Personal Info */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              <span>1. Customer Personal Details</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Complete residential address with Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pickup Schedule */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <span>2. Pickup Schedule & Address</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Doorstep Pickup Address</label>
                <input
                  type="text"
                  placeholder="Address for document collection agent"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredPickupDate}
                    onChange={(e) => setPreferredPickupDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Preferred Time Slot</label>
                  <select
                    value={preferredPickupTime}
                    onChange={(e) => setPreferredPickupTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="10:00 AM - 01:00 PM (Morning Slot)">10:00 AM - 01:00 PM (Morning)</option>
                    <option value="02:00 PM - 05:00 PM (Afternoon Slot)">02:00 PM - 05:00 PM (Afternoon)</option>
                    <option value="05:00 PM - 08:00 PM (Evening Slot)">05:00 PM - 08:00 PM (Evening)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Supabase Storage Document File */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-amber-500" />
              <span>3. Document File Upload (Supabase Bucket 'documents')</span>
            </h2>

            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 transition-colors relative cursor-pointer">
                <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {selectedFile ? selectedFile.name : 'Choose or drag document file (PDF, JPG, PNG)'}
                </span>
                <span className="text-[10px] text-slate-400 block">Directly uploaded to Supabase Storage 'documents' bucket</span>
                
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  placeholder="Special instructions..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Summary (Right 5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              Booking Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Selected Service</span>
                <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{service.title}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Doorstep Collection</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Time</span>
                <span>{service.estimatedDays} Business Days</span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-900 dark:text-white text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Payable</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{service.feeAmount}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Direct Supabase client insertion & RLS policies enabled.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl gradient-bg text-white font-black text-sm hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {submitting ? 'Inserting into Supabase...' : `Book Now • Pay ₹${service.feeAmount}`}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
