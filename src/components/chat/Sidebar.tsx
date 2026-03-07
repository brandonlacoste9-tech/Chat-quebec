'use client';

import React from 'react';
import { Plus, Trash2, MessageSquare, Shield, Info, MoreVertical } from 'lucide-react';
import { FleurDeLis } from '@/components/ui/FleurDeLis';
import { useChatStore } from '@/lib/store';
import { AgentType } from '@/types/chat';

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
        <div className="w-[260px] min-w-[260px] bg-surface border-r border-border flex flex-col transition-all duration-300 overflow-hidden">
            <div className="p-4.5 border-b border-border flex items-center gap-2.5">
                <div className="w-[30px] h-[30px] bg-gradient-to-br from-qblue to-blue-900 rounded-lg flex items-center justify-center shadow-lg shadow-qblue/15">
                    <FleurDeLis size={16} color="white" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-display font-extrabold text-[13px] text-text tracking-tight truncate">
                        Québec AI OS
                    </span>
                    <span className="text-[10px] text-text-dim tracking-widest uppercase font-bold">
                        Souveraineté Numérique
                    </span>
                </div>
            </div>

            <button
                onClick={handleNewChat}
                className="mx-4 my-3 px-3.5 py-2.25 bg-surface-2 border border-border-bright rounded-lg text-text text-[13px] flex items-center gap-2 transition-all hover:bg-surface-3 hover:border-accent group"
            >
                <Plus size={16} className="text-text-dim group-hover:text-accent transition-colors" />
                <span>Nouvelle conversation</span>
            </button>

            <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => setActiveConvId(conv.id)}
                        className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all animate-in slide-in-from-left-2 duration-200 ${activeConvId === conv.id
                            ? "bg-surface-3 border border-border-bright"
                            : "hover:bg-surface-2"
                            }`}
                    >
                        <span className="text-sm shrink-0">
                            {AGENTS.find(a => a.id === conv.agent)?.emoji || "⚜️"}
                        </span>
                        <span className={`flex-1 text-[12.5px] truncate ${activeConvId === conv.id ? "text-accent font-medium" : "text-text"}`}>
                            {conv.title}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-text-dim hover:text-danger hover:bg-danger/10 transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-4 pt-3 border-t border-border space-y-3">
                <div className="text-[10px] text-text-dim tracking-wider uppercase font-bold px-1">
                    Outils & Super App
                </div>
                <div className="space-y-1">
                    <a
                        href="/tools"
                        className="flex items-center gap-2.5 px-2.5 py-1.75 rounded-lg cursor-pointer transition-all border border-transparent text-text-dim hover:bg-qblue-glow hover:text-accent hover:border-accent/20 group"
                    >
                        <div className="w-2 h-2 rounded-full bg-accent group-hover:animate-pulse" />
                        <span className="text-sm leading-none">🚀</span>
                        <span className="text-[12.5px] font-medium">Super App Québec</span>
                    </a>
                </div>
            </div>

            <div className="p-4 pt-3 border-t border-border space-y-3">
                <div className="text-[10px] text-text-dim tracking-wider uppercase font-bold px-1">
                    Agents spécialisés
                </div>
                <div className="space-y-1">
                    {AGENTS.map((agent) => (
                        <div
                            key={agent.id}
                            onClick={() => setActiveAgent(agent.id)}
                            className={`flex items-center gap-2.5 px-2.5 py-1.75 rounded-lg cursor-pointer transition-all border border-transparent ${activeAgent === agent.id
                                ? "bg-surface-2 border-border-bright text-text"
                                : "text-text-dim hover:bg-surface-2 hover:text-text"
                                }`}
                        >
                            <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: agent.color }}
                            />
                            <span className="text-sm leading-none">{agent.emoji}</span>
                            <span className="text-[12.5px] font-medium">{agent.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
