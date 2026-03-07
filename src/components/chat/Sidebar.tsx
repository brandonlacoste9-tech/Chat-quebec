'use client';

import React from 'react';
import { Plus, Trash2, MessageSquare, LayoutGrid } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { AgentType } from '@/types/chat';
import { cn } from '@/lib/utils';

const AGENTS: { id: AgentType; name: string; emoji: string }[] = [
    { id: "general", name: "Québec AI", emoji: "⚜️" },
    { id: "immigration", name: "Immigration QC", emoji: "🏛️" },
    { id: "fiscalite", name: "Fiscalité QC", emoji: "💰" },
    { id: "cegep", name: "Prof Cégep", emoji: "📚" },
    { id: "randonnee", name: "Guide SEPAQ", emoji: "🌲" },
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
            title: "Nouvelle discussion",
            messages: [],
            agent: activeAgent,
            createdAt: new Date(),
        });
    };

    if (!sidebarOpen) return null;

    return (
        <aside className={cn(
            "w-[280px] bg-[#050505] border-r border-white/5 flex flex-col transition-all duration-300 z-30 shadow-2xl",
            !sidebarOpen && "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:pointer-events-none"
        )}>
            {/* Brand Section */}
            <div className="p-4 pt-6">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-8 h-8 bg-qblue rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-white text-sm">⚜️</span>
                    </div>
                    <span className="font-bold text-lg text-white tracking-tight">Québec AI OS</span>
                </div>

                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5 group"
                >
                    <span className="text-sm font-medium">Nouvelle discussion</span>
                    <Plus size={18} className="text-white/40 group-hover:text-white" />
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-0.5 mt-2 scrollbar-thin">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => setActiveConvId(conv.id)}
                        className={cn(
                            "group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all",
                            activeConvId === conv.id
                                ? "bg-white/10"
                                : "hover:bg-white/5"
                        )}
                    >
                        <MessageSquare size={16} className={cn(
                            "shrink-0",
                            activeConvId === conv.id ? "text-white" : "text-white/40"
                        )} />
                        <span className={cn(
                            "flex-1 text-sm truncate",
                            activeConvId === conv.id ? "text-white" : "text-white/60"
                        )}>
                            {conv.title}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-danger rounded transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Agents Selection List */}
            <div className="p-4 border-t border-white/5">
                <p className="px-2 mb-3 text-[11px] font-bold text-white/30 uppercase tracking-widest">Assistant spécialisé</p>
                <div className="space-y-1">
                    {AGENTS.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => setActiveAgent(agent.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                activeAgent === agent.id
                                    ? "bg-qblue/20 text-white"
                                    : "text-white/50 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <span className="text-base shrink-0">{agent.emoji}</span>
                            <span className="text-sm font-medium truncate">{agent.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};
