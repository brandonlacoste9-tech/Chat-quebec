'use client';

import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full py-6 px-6 border-t border-white/5 bg-[#0a0a0a] text-[10px] text-white/10 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-3">
                <span className="font-bold opacity-30 uppercase tracking-[0.3em] leading-none shrink-0">Québec AI OS</span>
                <span className="w-0.5 h-0.5 bg-white/10 rounded-full" />
                <span className="opacity-30">Montréal, QC, Canada</span>
            </div>

            <div className="flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
                <div className="uppercase tracking-[2px] font-bold">Conforme Loi 25</div>
                <div className="uppercase tracking-[2px] font-bold">Mis à jour : Mars 2026</div>
            </div>
        </footer>
    );
}
