'use client';

import React from 'react';
import { Plus, Trash2, LayoutGrid, Settings, ShieldAlert, Users } from 'lucide-react';
import { FleurDeLis } from '@/components/ui/FleurDeLis';
import { useChatStore } from '@/lib/store';
import { AgentType } from '@/types/chat';
import { cn } from '@/lib/utils';

const AGENTS: { id: AgentType; name: string; emoji: string; color: string }[] = [
    { id: "general", name: "Québec AI", emoji: "⚜️", color: "#2563eb" },
    { id: "immigration", name: "Immigration QC", emoji: "🏛️", color: "#7c3aed" },
    { id: "fiscalite", name: "Fiscalité QC", emoji: "💰", color: "#059669" },
    { id: "cegep", name: "Prof Cégep", emoji: "📚", color: "#dc2626" },
    { id: "randonnee", name: "Guide SEPAQ", emoji: "🌲", color: "#65a30d" },
];

export const Sidebar = () => {
    const {
        conversations,
        activeConvId,
        setActiveConvId,
        sidebarOpen,
        activeAgent,
        setActiveAgent,
        addConversation,
        deleteConversation
    } = useChatStore();

    const handleNewChat = () => {
        const id = Math.random().toString(36).substr(2, 9);
        addConversation({
            id,
            title: "Nouvelle conversation",
            messages: [],
            agent: activeAgent,
            createdAt: new Date(),
        });
    };

    if (!sidebarOpen) return null;

    return (
        <aside className={cn(
            "w-[260px] md:w-[280px] leather-dark border-r border-border flex flex-col transition-all duration-300 z-30 shadow-2xl overflow-hidden",
            !sidebarOpen && "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:pointer-events-none"
        )}>
            {/* Logo Section - TOP */}
            <div className="p-5 border-b border-white/5 flex items-center gap-3 bg-black/20">
                <div className="w-[340px] absolute -top-10 -left-10 opacity-10 pointer-events-none">
                    <FleurDeLis size={200} color="white" />
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-qblue to-blue-900 rounded-xl flex items-center justify-center shadow-lg relative z-10 border border-white/10">
                    <FleurDeLis size={20} color="white" />
                </div>
                <div className="flex flex-col min-w-0 relative z-10">
                    <span className="font-display font-extrabold text-[15px] text-text tracking-tight uppercase leading-none mb-1">
                        Québec AI OS
                    </span>
                    <span className="text-[9px] text-qblue-bright tracking-[0.2em] font-black uppercase opacity-80">
                        Digital Sovereignty
                    </span>
                </div>
            </div>

            {/* Action Bar */}
            <div className="p-4">
                <button
                    onClick={handleNewChat}
                    className="w-full leather-pro stitched-gold hover:brightness-110 active:scale-[0.98] py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-2xl group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Plus size={18} className="text-white drop-shadow-md" strokeWidth={3} />
                    <span className="font-display font-black text-[12px] text-white uppercase tracking-wider drop-shadow-md">New Discussion</span>
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2 scrollbar-thin">
                <div className="px-2 mb-2 text-[10px] uppercase font-black tracking-widest text-white/30">Recent Sessions</div>
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => setActiveConvId(conv.id)}
                        className={cn(
                            "group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border border-transparent hover:bg-white/5",
                            activeConvId === conv.id ? "bg-white/10 border-white/10 shadow-lg" : ""
                        )}
                    >
                        <span className="text-base shrink-0 opacity-80">
                            {AGENTS.find(a => a.id === conv.agent)?.emoji || "⚜️"}
                        </span>
                        <span className={cn(
                            "flex-1 text-[13px] truncate",
                            activeConvId === conv.id ? "text-white font-bold" : "text-text-dim"
                        )}>
                            {conv.title}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-dim hover:text-danger hover:bg-danger/10 transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Bottom Navigation */}
            <div className="mt-auto p-4 border-t border-white/5 bg-black/10 space-y-2">
                <a
                    href="/tools"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border border-white/5 hover:bg-white/5 hover:border-white/10 group bg-surface-2"
                >
                    <LayoutGrid size={18} className="text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-black uppercase tracking-widest text-text">Souverain Tools</span>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                </a>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    {AGENTS.slice(0, 4).map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => setActiveAgent(agent.id)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-xl transition-all border gap-1",
                                activeAgent === agent.id
                                    ? "bg-qblue/20 border-qblue/40 text-white"
                                    : "bg-white/5 border-transparent text-text-dim hover:bg-white/10"
                            )}
                        >
                            <span className="text-lg">{agent.emoji}</span>
                            <span className="text-[9px] font-bold uppercase truncate w-full text-center">{agent.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};
