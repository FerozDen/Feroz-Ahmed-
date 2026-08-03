'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  Upload, 
  FileText, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Loader2,
  Building2
} from 'lucide-react';
import { supabase, uploadDocumentFile } from '@/lib/supabase';
import { ServiceItem } from '@/db/seed-data';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
}

export default function QuickBookingModal({ isOpen, onClose, service }: QuickBookingModalProps) {
  const [step, setStep] = useState<'details' | 'success'>('details');

  // Form State - Short & Essential as per PRD
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [sameWhatsApp, setSameWhatsApp] = useState(true);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');

  // File Upload State (Optional)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generated Booking Data
  const [bookingResult, setBookingResult] = useState<{
    id: string;
    serviceTitle: string;
    customerName: string;
    mobile: string;
    whatsappUrl: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setErrorMsg('');
      setSelectedFile(null);
    }
  }, [isOpen, service]);

  if (!isOpen || !service) return null;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim()) {
      setErrorMsg('Please enter your Full Name and Mobile Number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const generatedId = `CR-${Date.now().toString().slice(-6)}`;
      const finalWhatsApp = sameWhatsApp ? mobileNumber : whatsAppNumber;
      const fullLocation = `${address ? `${address}, ` : ''}${area ? `${area}, ` : ''}${city}`;

      let uploadedDocUrl = '';
      if (selectedFile) {
        setIsUploading(true);
        uploadedDocUrl = await uploadDocumentFile(selectedFile, generatedId);
        setIsUploading(false);
      }

      const documentList = uploadedDocUrl ? [uploadedDocUrl] : [];

      console.log('[Supabase Saving Booking]:', { generatedId, service: service.title });

      // 1. Save to 'bookings' table in Supabase
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

      if (bookingError) {
        console.warn('Direct bookings insert notice:', bookingError.message);
      }

      // 2. Save to 'applications' table in Supabase
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

      if (appError) {
        console.warn('Direct applications insert notice:', appError.message);
      }

      // Format WhatsApp Pre-filled message as per PRD
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
      console.error('Booking submission exception:', err);
      setErrorMsg(err.message || 'Failed to save booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'details' ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Doorstep Service Booking • 2-Min Flow</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Book {service.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-500" /> {service.estimatedDays} Days Delivery</span>
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-emerald-500" /> Doorstep Collection</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{service.feeAmount}</span>
              </div>
            </div>

            {/* Quick Info Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>No Complex Forms!</strong> Simply enter your name and phone number. Our executive will visit your doorstep to collect documents and process the application.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
              
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile Number (Mandatory) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* WhatsApp Number Option */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameWhatsApp}
                    onChange={(e) => setSameWhatsApp(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>WhatsApp number is same as mobile number</span>
                </label>

                {!sameWhatsApp && (
                  <div className="relative pt-1">
                    <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="Enter WhatsApp Number"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Email (Optional) & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">City / Region</label>
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
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Other City">Other City</option>
                  </select>
                </div>
              </div>

              {/* Area & Doorstep Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Doorstep Address / Area</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    placeholder="House/Flat No., Street, Area, Landmark for executive document collection"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Optional Document Upload */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                  <span>Upload Documents <span className="text-slate-400 font-normal">(Optional)</span></span>
                  <span className="text-[10px] text-emerald-600 font-bold">Physical collection available</span>
                </label>

                <div className="p-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/50">
                  <input
                    type="file"
                    id="modal-doc-upload"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="modal-doc-upload" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                    <Upload className="w-4 h-4" />
                    <span>{selectedFile ? selectedFile.name : 'Attach Document Photo / PDF (Optional)'}</span>
                  </label>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-rose-500">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl gradient-bg text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Booking to Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>BOOK NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          /* SUCCESS SCREEN AS PER PRD */
          <div className="text-center space-y-6 py-4">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg ring-4 ring-emerald-500/20 animate-bounce-short">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                Booking Successful!
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Booking ID: <span className="text-indigo-600 dark:text-indigo-400">{bookingResult?.id}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto font-medium">
                Our CertiR executive will contact you within <strong>30 minutes</strong> for doorstep document collection.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Service Booked:</span>
                <span className="font-bold text-slate-900 dark:text-white">{bookingResult?.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{bookingResult?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-bold text-emerald-600">{bookingResult?.mobile}</span>
              </div>
            </div>

            {/* WhatsApp Trigger Button as specified in PRD */}
            <div className="space-y-3 pt-2">
              <a
                href={bookingResult?.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Continue to WhatsApp</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition-colors"
              >
                Done / Close Window
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
