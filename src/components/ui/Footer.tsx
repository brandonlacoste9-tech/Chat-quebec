'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full py-6 px-8 border-t border-border bg-surface text-[11px] text-text-dim flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
                <div className="font-bold text-text uppercase tracking-widest flex items-center gap-2">
                    Québec AI
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="opacity-70">Montréal, QC, Canada</span>
                    <span className="opacity-70">(514) 555-0123</span>
                    <span className="opacity-70">support@chat-quebec.ca</span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 justify-center">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-text/60">
                    <ShieldCheck size={14} className="text-success" />
                    Conforme Loi 25
                </div>
                <div className="flex items-center gap-2 opacity-50 font-bold uppercase tracking-wider">
                    <Info size={14} />
                    Mis à jour : Mars 2026
                </div>
            </div>
        </footer>
    );
}
