'use client';

import React from 'react';
import { X, Trophy, Zap, ShieldCheck } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Stripe Checkout Error:", err);
      // This is a client-side component, so NextResponse.json is not applicable here.
      // The original client-side error handling will be kept, but with the new error variable name.
      // If the intention was to add a client-side error display, that would require more changes.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-bark/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-[440px] bg-bark-l border border-gold-d/30 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 pattern-bg">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 text-text-dim hover:text-gold transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pb-10 flex flex-col items-center text-center">
          <div className="w-[70px] h-[70px] bg-gold/10 border-2 border-gold rounded-[22px] flex items-center justify-center text-[32px] mb-6 shadow-[0_0_30px_rgba(201,168,76,0.15)]">
            ⚜️
          </div>

          <h2 className="font-playfair text-[26px] font-black text-gold mb-3 leading-tight">
            You&apos;ve chatted quite a bit today!
          </h2>
          
          <p className="font-barlow text-[14.5px] text-text-muted mb-8 leading-relaxed max-w-[320px]">
            The free version is limited to 20 messages per day. Upgrade to keep the conversation going without limits.
          </p>

          <div className="w-full space-y-4 mb-10 text-left">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Zap size={10} className="text-gold" strokeWidth={3} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-text-main">Unlimited Messages</div>
                <div className="text-[11px] text-text-dim font-barlow-cond uppercase tracking-wider">Chat non-stop, 24/7</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Trophy size={10} className="text-gold" strokeWidth={3} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-text-main">DeepSeek-V3 Model</div>
                <div className="text-[11px] text-text-dim font-barlow-cond uppercase tracking-wider">The most powerful brain</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <ShieldCheck size={10} className="text-gold" strokeWidth={3} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-text-main">Support Quebec AI</div>
                <div className="text-[11px] text-text-dim font-barlow-cond uppercase tracking-wider">Help a local AI grow</div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubscribe}
            className="w-full h-14 bg-gold hover:bg-gold-l text-bark font-barlow-cond text-[14px] font-bold tracking-[2px] uppercase rounded-[12px] shadow-[0_4px_15px_rgba(201,168,76,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            Go Premium — $9.99/mo
          </button>
          
          <button 
            onClick={onClose}
            className="mt-4 text-[11px] font-barlow-cond tracking-[1.5px] text-text-dim uppercase hover:text-text-muted transition-colors"
          >
            Peut-être plus tard
          </button>
        </div>

        {/* Bottom Accent */}
        <div className="h-1 bg-gold animate-respiration origin-left" />
      </div>
    </div>
  );
};
