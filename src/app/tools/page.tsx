'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FleurDeLis } from '@/components/ui/FleurDeLis';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Dynamically import components that use window/UMD modules
const MapPanel = dynamic(() => import('@/components/tools/MapPanel'), { ssr: false });
const ScannerPanel = dynamic(() => import('@/components/tools/ScannerPanel'), { ssr: false });
const TelegramPanel = dynamic(() => import('@/components/tools/TelegramPanel'), { ssr: false });

type TabId = 'map' | 'scan' | 'tg';

export default function ToolsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('map');

    return (
        <div className="flex h-screen bg-bg overflow-hidden font-body">
            <div className="flex-1 flex flex-col min-w-0">
                {/* Flag Strip */}
                <div className="h-0.5 w-full bg-gradient-to-r from-[#002395] via-white to-[#002395] shrink-0 z-50" />

                {/* TOP NAV */}
                <nav className="h-[52px] bg-surface border-b border-border flex items-center shrink-0 z-40">
                    <div className="flex items-center gap-2.5 px-4 h-full border-r border-border min-w-[160px]">
                        <div className="w-7 h-7 bg-gradient-to-br from-qblue to-blue-900 rounded-lg flex items-center justify-center shadow-lg shadow-qblue/15">
                            <FleurDeLis size={14} color="white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-extrabold text-[13px] text-text tracking-tight">Québec OS</span>
                            <span className="text-[9px] text-text-dim tracking-widest uppercase font-bold">Super App</span>
                        </div>
                    </div>

                    <div className="flex h-full flex-1">
                        <button
                            onClick={() => setActiveTab('map')}
                            className={cn(
                                "flex items-center gap-2 px-4.5 text-[12.5px] border-r border-border transition-all relative font-medium",
                                activeTab === 'map' ? "text-qblue-bright bg-surface-2" : "text-text-dim hover:text-text hover:bg-surface-2"
                            )}
                        >
                            <span>🗺️</span> Carte
                            <span className="bg-success text-white text-[9px] px-1.25 rounded-md font-bold font-display ml-1">LIVE</span>
                            {activeTab === 'map' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-qblue-bright" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('scan')}
                            className={cn(
                                "flex items-center gap-2 px-4.5 text-[12.5px] border-r border-border transition-all relative font-medium",
                                activeTab === 'scan' ? "text-qblue-bright bg-surface-2" : "text-text-dim hover:text-text hover:bg-surface-2"
                            )}
                        >
                            <span>📦</span> Épicerie
                            <span className="bg-gold text-black text-[9px] px-1.25 rounded-md font-bold font-display ml-1">FREE</span>
                            {activeTab === 'scan' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-qblue-bright" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('tg')}
                            className={cn(
                                "flex items-center gap-2 px-4.5 text-[12.5px] border-r border-border transition-all relative font-medium",
                                activeTab === 'tg' ? "text-qblue-bright bg-surface-2" : "text-text-dim hover:text-text hover:bg-surface-2"
                            )}
                        >
                            <span>✈️</span> Telegram
                            <span className="bg-qblue text-white text-[9px] px-1.25 rounded-md font-bold font-display ml-1">BOT</span>
                            {activeTab === 'tg' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-qblue-bright" />}
                        </button>
                    </div>

                    <div className="ml-auto px-4 flex items-center gap-4">
                        <div className="text-[10px] text-text-dim leading-none">Loi 25 ✓ · Canada 🍁</div>
                    </div>
                </nav>

                {/* CONTENT */}
                <div className="flex-1 relative overflow-hidden">
                    {activeTab === 'map' && <MapPanel />}
                    {activeTab === 'scan' && <ScannerPanel />}
                    {activeTab === 'tg' && <TelegramPanel />}
                </div>
            </div>
        </div>
    );
}
