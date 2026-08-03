'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';
import { INITIAL_APPLICATIONS, ApplicationTrackItem } from '@/db/seed-data';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialAppNo = searchParams.get('appNo') || 'CR-2026-849201';

  const [inputAppNo, setInputAppNo] = useState(initialAppNo);
  const [activeApp, setActiveApp] = useState<ApplicationTrackItem | null>(INITIAL_APPLICATIONS[0]);
  const [fastApiTelemetry, setFastApiTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchApplicationDetails = async (appNo: string) => {
    setLoading(true);
    try {
      // 1. Fetch Next.js application record
      const res = await fetch(`/api/applications?appNo=${encodeURIComponent(appNo)}`);
      const data = await res.json();
      
      if (data.success && data.application) {
        setActiveApp(data.application);
      } else {
        // Fallback matching
        const match = INITIAL_APPLICATIONS.find(a => a.applicationNumber.toLowerCase() === appNo.toLowerCase());
        if (match) setActiveApp(match);
        else setActiveApp(INITIAL_APPLICATIONS[0]);
      }

      // 2. Fetch FastAPI state server telemetry status
      const telemetryRes = await fetch(`/api/python/tracking/${appNo}`);
      if (telemetryRes.ok) {
        const telemetryData = await telemetryRes.json();
        setFastApiTelemetry(telemetryData);
      } else {
        setFastApiTelemetry({
          completion_percentage: 75,
          estimated_hours_remaining: 48,
          current_stage: 3
        });
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialAppNo) {
      fetchApplicationDetails(initialAppNo);
    }
  }, [initialAppNo]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAppNo) {
      fetchApplicationDetails(inputAppNo);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
        <div className="relative flex items-center glass-card rounded-2xl p-2 shadow-lg border border-slate-200/80 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Enter Application Ref No (e.g. CR-2026-849201)"
            value={inputAppNo}
            onChange={(e) => setInputAppNo(e.target.value)}
            className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-semibold"
          />
          <button
            type="submit"
            disabled={loading}
            className="gradient-bg text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-95 transition-opacity shadow-md shrink-0 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Fetch Telemetry'}
          </button>
        </div>
      </form>

      {/* Main Tracking Details Box */}
      {activeApp && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8 gradient-glow">
          
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
                {activeApp.category} • Application
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {activeApp.serviceTitle}
              </h2>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                Ref No: {activeApp.applicationNumber}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-center">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold block">Est. Completion</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{activeApp.estimatedCompletion}</span>
              </div>
            </div>
          </div>

          {/* FastAPI Telemetry Percentage Meter */}
          {fastApiTelemetry && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-2 text-indigo-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>FastAPI Telemetry Stream • Authority Pipeline</span>
                </span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  {fastApiTelemetry.completion_percentage}% Completed
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full gradient-bg transition-all duration-500 rounded-full"
                  style={{ width: `${fastApiTelemetry.completion_percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* 4-Stage Timeline Stepper */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Verification & Scrutiny Timeline
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activeApp.stepsHistory.map((step, idx) => {
                const stepNum = idx + 1;
                const isCurrent = stepNum === activeApp.currentStep;
                const isPassed = stepNum < activeApp.currentStep || step.completed;

                return (
                  <div key={idx} className="relative flex items-start gap-4 group">
                    
                    {/* Circle Bullet */}
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                        : isCurrent
                        ? 'gradient-bg text-white ring-4 ring-indigo-500/30 animate-pulse'
                        : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold ${
                          isPassed || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                        }`}>
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                      {step.timestamp && (
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Log Time: {step.timestamp}
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-4 justify-between items-center text-xs">
            <span className="text-slate-500">Need changes or support regarding this application?</span>
            <Link href="/vault" className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-300 transition-colors">
              Check Vault Files
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-time Application Progression</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Track Your Application Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Enter your unique Application Reference Number (CR-2026-XXXXXX) to monitor department scrutiny and delivery timelines.
        </p>
      </div>

      <Suspense fallback={
        <div className="text-center py-10 text-xs text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
          <span>Loading tracking details...</span>
        </div>
      }>
        <TrackingContent />
      </Suspense>
    </div>
  );
}
