'use client';

import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full py-4 px-6 border-t border-white/5 bg-[#0a0a0a] text-[10px] text-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <span className="font-bold opacity-30 uppercase tracking-widest leading-none shrink-0">Québec AI</span>
                <div className="flex items-center gap-2 opacity-30">
                    <span>Montréal, QC, Canada</span>
                    <span className="w-0.5 h-0.5 bg-white/10 rounded-full" />
                    <span>(514) 555-0123</span>
                </div>
            </div>

            <div className="flex items-center gap-6 opacity-20 hover:opacity-100 transition-opacity">
                <div className="uppercase tracking-[2px] font-bold">Conforme Loi 25</div>
                <div className="uppercase tracking-[2px] font-bold">Mise à jour : Mars 2026</div>
            </div>
        </footer>
    );
}
