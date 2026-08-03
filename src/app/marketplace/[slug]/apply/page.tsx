'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
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
  ExternalLink,
  MessageSquare,
  Building2,
  Upload
} from 'lucide-react';
import { INITIAL_SERVICES } from '@/db/seed-data';
import { supabase, uploadDocumentFile } from '@/lib/supabase';

export default function ServiceApplyPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const service = INITIAL_SERVICES.find(s => s.id === slug) || INITIAL_SERVICES[0];

  const [step, setStep] = useState<'form' | 'success'>('form');

  // Form State as specified in PRD
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [sameWhatsApp, setSameWhatsApp] = useState(true);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');

  // Optional File Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success Result
  const [bookingResult, setBookingResult] = useState<{
    id: string;
    serviceTitle: string;
    customerName: string;
    mobile: string;
    whatsappUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim()) {
      setErrorMessage('Please enter your Full Name and Mobile Number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const generatedId = `CR-${Date.now().toString().slice(-6)}`;
      const finalWhatsApp = sameWhatsApp ? mobileNumber : whatsAppNumber;
      const fullLocation = `${address ? `${address}, ` : ''}${area ? `${area}, ` : ''}${city}`;

      let uploadedDocUrl = '';
      if (selectedFile) {
        uploadedDocUrl = await uploadDocumentFile(selectedFile, generatedId);
      }

      const documentList = uploadedDocUrl ? [uploadedDocUrl] : [];

      console.log('[Supabase Saving Booking]:', { generatedId, service: service.title });

      // Save to 'bookings' table
      const { error: bookingError } = await supabase.from('bookings').insert([
        {
          id: generatedId,
          customer_name: fullName,
          mobile_number: mobileNumber,
          email: email || `${mobileNumber}@certir.in`,
          address: fullLocation,
          service_selected: service.title,
          documents_required: documentList,
          booking_status: 'Pending'
        }
      ]);

      if (bookingError) console.warn('Bookings insert note:', bookingError.message);

      // Save to 'applications' table
      const { error: appError } = await supabase.from('applications').insert([
        {
          id: generatedId,
          full_name: fullName,
          phone_number: mobileNumber,
          email: email || `${mobileNumber}@certir.in`,
          certificate_type: service.title,
          address: fullLocation,
          pickup_address: fullLocation,
          uploaded_documents: documentList,
          additional_notes: `WhatsApp: ${finalWhatsApp} | City: ${city} | Area: ${area}`,
          status: 'Pending'
        }
      ]);

      if (appError) console.warn('Applications insert note:', appError.message);

      // Format WhatsApp Message as per PRD
      const waText = `Hello CertiR,\n\nI have booked the following service:\n\nService: ${service.title}\nBooking ID: ${generatedId}\nName: ${fullName}\nPhone Number: ${mobileNumber}\n\nPlease contact me.`;
      const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(waText)}`;

      setBookingResult({
        id: generatedId,
        serviceTitle: service.title,
        customerName: fullName,
        mobile: mobileNumber,
        whatsappUrl: waUrl
      });

      setStep('success');

    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMessage(err.message || 'Failed to submit booking. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services Catalog</span>
      </Link>

      {step === 'form' ? (
        <div className="space-y-6">
          
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

          {/* Quick Info Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Doorstep Service Guarantee:</strong> No complex forms to fill! Simply enter your contact details. Our executive will call you within 30 minutes to collect document proofs directly from your doorstep.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PRD Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
            
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <User className="w-5 h-5 text-indigo-500" />
              <span>Customer Contact & Doorstep Details</span>
            </h2>

            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Mobile & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile Number (Mandatory) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* City & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Other">Other City</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Doorstep Address / Area</label>
                <input
                  type="text"
                  placeholder="Flat No, Street, Landmark for executive visit"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Optional Document Upload */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                <span>Upload Documents <span className="text-slate-400 font-normal">(Optional)</span></span>
                <span className="text-[10px] text-emerald-600 font-bold">Physical collection available</span>
              </label>

              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/50">
                <input
                  type="file"
                  id="apply-page-file"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="apply-page-file" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  <Upload className="w-4 h-4" />
                  <span>{selectedFile ? selectedFile.name : 'Attach Document Photo / PDF (Optional)'}</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl gradient-bg text-white font-black text-sm shadow-xl hover:opacity-95 transition-opacity"
            >
              {submitting ? 'Saving Booking to Supabase...' : `BOOK NOW • ₹${service.feeAmount}`}
            </button>

          </form>

        </div>
      ) : (
        /* PRD SUCCESS SCREEN */
        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg ring-4 ring-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase">
              Booking Successful!
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Booking ID: <span className="text-indigo-600">{bookingResult?.id}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
              Our executive will contact you within <strong>30 minutes</strong> for doorstep document collection.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-900 dark:text-white">{bookingResult?.serviceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">{bookingResult?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone Number:</span>
              <span className="font-bold text-emerald-600">{bookingResult?.mobile}</span>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-3 pt-2">
            <a
              href={bookingResult?.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Continue to WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="block w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
