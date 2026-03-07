'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full py-4 px-6 border-t border-border bg-surface text-[10px] text-text-dim flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <div className="font-bold text-text uppercase tracking-widest flex items-center gap-2">
                    Québec AI OS
                </div>
                <div className="flex items-center gap-3">
                    <span>Montréal, QC, Canada</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span>(514) 555-0123</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span>support@chat-quebec.ca</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <ShieldCheck size={12} className="text-success" />
                    Loi 25 - Souveraineté Totale
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                    <Info size={12} />
                    Mis à jour : Mars 2026
                </div>
            </div>
        </footer>
    );
}
