'use client';

import { Phone, MessageSquare } from 'lucide-react';

export default function StickyActions() {
  const whatsappUrl = "https://wa.me/919876543210?text=" + encodeURIComponent("Hello CertiR, I need assistance booking a document service.");
  const callUrl = "tel:+919876543210";

  return (
    <>
      {/* Floating Desktop & Mobile WhatsApp Icon Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-5 sm:bottom-6 sm:right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
        title="Chat with CertiR Executive on WhatsApp"
      >
        <MessageSquare className="w-7 h-7 fill-current" />
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hidden sm:block pointer-events-none">
          Need Help? Chat on WhatsApp
        </span>
      </a>

      {/* Sticky Mobile Bottom Call & WhatsApp Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 p-2.5 sm:hidden flex items-center gap-2 shadow-2xl">
        <a
          href={callUrl}
          className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800"
        >
          <Phone className="w-4 h-4 text-indigo-500" />
          <span>Call Executive</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Book via WhatsApp</span>
        </a>
      </div>
    </>
  );
}
