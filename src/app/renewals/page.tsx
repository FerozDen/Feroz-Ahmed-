'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';
import { INITIAL_DOCUMENTS, StoredDocument } from '@/db/seed-data';

export default function RenewalsPage() {
  const [documents] = useState<StoredDocument[]>(INITIAL_DOCUMENTS);
  const [fastApiRecommendations, setFastApiRecommendations] = useState<any[]>([]);
  const [processingRenewId, setProcessingRenewId] = useState<string | null>(null);
  const [renewedDocIds, setRenewedDocIds] = useState<string[]>([]);

  useEffect(() => {
    // Fetch renewal recommendations from FastAPI backend
    fetch('/api/python/recommend-renewals')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFastApiRecommendations(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleTriggerRenewal = async (doc: StoredDocument) => {
    setProcessingRenewId(doc.id);
    try {
      const res = await fetch('/api/renewals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: doc.id,
          documentTitle: doc.title,
          category: doc.category
        })
      });

      const data = await res.json();
      if (data.success) {
        setRenewedDocIds(prev => [...prev, doc.id]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingRenewId(null);
    }
  };

  const expiringDocs = documents.filter(d => d.status === 'Expiring Soon' || d.status === 'Expired');
  const activeDocs = documents.filter(d => d.status === 'Active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 gradient-glow space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Automated Document Expiry Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Renewal Management Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Never miss a certificate expiry. Monitor validities for Driving Licences, Passports, Income, and Domicile certificates with 1-click renewal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-center md:text-right shrink-0">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase block">Action Needed</span>
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{expiringDocs.length} Certificates</span>
          </div>
        </div>
      </div>

      {/* FastAPI Intelligence AI Alert Banner */}
      {fastApiRecommendations.length > 0 && (
        <div className="p-6 rounded-2xl bg-indigo-950 text-white border border-indigo-800 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>FastAPI Intelligence Recommendation Engine</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fastApiRecommendations.map((rec, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">{rec.urgency} Priority</span>
                <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                <p className="text-[11px] text-slate-400">{rec.action_required}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URGENT RENEWAL LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Documents Expiring or Expired</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expiringDocs.map((doc) => {
            const isRenewed = renewedDocIds.includes(doc.id);
            const isProcessing = processingRenewId === doc.id;

            return (
              <div
                key={doc.id}
                className="glass-card rounded-2xl p-6 border border-amber-200/80 dark:border-amber-900/60 space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {doc.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    doc.status === 'Expired' 
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{doc.title}</h3>
                    <span className="text-xs font-mono font-semibold text-slate-500">{doc.documentNumber}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Expiry Date:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{doc.expiryDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Issuing Body:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.metadata.issuingAuthority}</span>
                  </div>
                </div>

                {isRenewed ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Renewal Request Submitted! Processing in pipeline.</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTriggerRenewal(doc)}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl gradient-bg text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Renewal Request...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>1-Click Fast Track Renewal</span>
                      </>
                    )}
                  </button>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE & HEALTHY DOCUMENTS */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Active & Valid Certificates</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeDocs.map((doc) => (
            <div key={doc.id} className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{doc.title}</h4>
                  <span className="text-xs text-slate-500">Expires: {doc.expiryDate}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase">
                Valid
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
