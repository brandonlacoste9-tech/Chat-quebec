'use client';

import React from 'react';
import { Plus, Trash2, LayoutGrid, MessageSquare } from 'lucide-react';
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
            "w-[260px] md:w-[280px] bg-surface border-r border-border flex flex-col transition-all duration-300 z-30 shadow-2xl",
            !sidebarOpen && "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:pointer-events-none"
        )}>
            {/* Brand Section */}
            <div className="p-6 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 bg-qblue rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    <span className="text-xl">⚜️</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-sans font-bold text-lg text-text leading-none mb-1">
                        Québec AI
                    </span>
                    <span className="text-[10px] text-qblue-bright tracking-widest font-bold uppercase opacity-60">
                        SOUVERAINETÉ
                    </span>
                </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
                <button
                    onClick={handleNewChat}
                    className="w-full bg-qblue hover:bg-qblue-bright text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>Nouvelle discussion</span>
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2 scrollbar-thin">
                <div className="px-2 mb-2 text-[10px] uppercase font-bold tracking-widest text-text-dim/50">Sessions récentes</div>
                {conversations.length === 0 ? (
                    <div className="px-3 py-8 text-center">
                        <p className="text-[11px] text-text-dim italic">Aucun historique</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all",
                                activeConvId === conv.id
                                    ? "bg-surface-3 border border-border"
                                    : "hover:bg-surface-2"
                            )}
                        >
                            <MessageSquare size={16} className={cn(
                                "shrink-0",
                                activeConvId === conv.id ? "text-qblue-bright" : "text-text-dim"
                            )} />
                            <span className={cn(
                                "flex-1 text-[13px] truncate",
                                activeConvId === conv.id ? "text-white font-medium" : "text-text-dim"
                            )}>
                                {conv.title}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteConversation(conv.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger/10 hover:text-danger transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Agents Selection List */}
            <div className="p-4 border-t border-border bg-black/5">
                <div className="px-1 mb-3 text-[10px] uppercase font-bold tracking-widest text-text-dim/50 italic">Agents spécialisés</div>
                <div className="space-y-1">
                    {AGENTS.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => setActiveAgent(agent.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border",
                                activeAgent === agent.id
                                    ? "bg-qblue/10 border-qblue/40 text-white"
                                    : "bg-surface-2 border-transparent text-text-dim hover:bg-surface-3"
                            )}
                        >
                            <span className="text-base">{agent.emoji}</span>
                            <span className="text-[12px] font-medium">{agent.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};
