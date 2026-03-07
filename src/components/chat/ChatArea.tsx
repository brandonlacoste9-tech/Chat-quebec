'use client';

import React, { useRef, useEffect } from 'react';
import { Menu, Zap, Sparkles } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { FleurDeLis } from '@/components/ui/FleurDeLis';
import { AgentType } from '@/types/chat';
import { cn } from '@/lib/utils';

const AGENTS: Record<AgentType, { name: string; emoji: string; desc: string }> = {
    general: { name: "Assistant Québec AI", emoji: "⚜️", desc: "Assistant général fier d'être Québécois" },
    immigration: { name: "Expert Immigration", emoji: "🏛️", desc: "Conseiller spécialisé PEQ & CSQ" },
    fiscalite: { name: "Fiscaliste Québec", emoji: "💰", desc: "Expert Revenu Québec & Fiscalité locale" },
    cegep: { name: "Prof de Cégep", emoji: "📚", desc: "Pédagogie et aide à la réussite collégiale" },
    randonnee: { name: "Guide SEPAQ", emoji: "🌲", desc: "Expert plein air et sentiers du Québec" },
};

export const ChatArea = () => {
    const {
        conversations,
        activeConvId,
        activeAgent,
        sidebarOpen,
        toggleSidebar,
        updateMessage
    } = useChatStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeConv = React.useMemo(() => conversations.find(c => c.id === activeConvId), [conversations, activeConvId]);
    const messages = React.useMemo(() => activeConv?.messages || [], [activeConv]);
    const currentAgent = AGENTS[activeAgent];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFeedback = (messageId: string, type: 'up' | 'down') => {
        if (activeConvId) {
            updateMessage(activeConvId, messageId, { feedback: type });
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
            {/* Topbar */}
            <header className="h-[64px] border-b border-border px-6 flex items-center gap-4 bg-surface/80 backdrop-blur-xl z-20 shrink-0">
                {!sidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-text-dim hover:text-text hover:bg-surface-3 rounded-xl transition-all"
                    >
                        <Menu size={20} />
                    </button>
                )}

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-qblue/10 flex items-center justify-center border border-qblue/20">
                        <span className="text-sm">{currentAgent.emoji}</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-[13px] font-black text-text uppercase tracking-widest leading-none">
                            {currentAgent.name}
                        </h2>
                        <span className="text-[10px] text-success font-bold uppercase tracking-tight opacity-70">
                            En ligne • Souverain-1
                        </span>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-[10px] text-text-muted font-black tracking-[0.1em] uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-qblue animate-pulse" />
                        Souverain-1-Pro
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pt-4 pb-10 scrollbar-thin">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 max-w-[800px] mx-auto text-center animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="w-20 h-20 bg-gradient-to-br from-qblue to-white/10 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 mb-10 group transition-transform hover:scale-110">
                            <FleurDeLis size={40} color="white" />
                        </div>

                        <h1 className="font-display text-4xl font-black text-text mb-4 tracking-tight leading-tight">
                            Bonjour! Comment puis-je vous aider aujourd&apos;hui?
                        </h1>

                        <p className="text-text-dim text-base max-w-[480px] mb-12 font-medium opacity-80">
                            {currentAgent.desc}. Posez-moi vos questions sur le Québec, sa culture ou ses services publics.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
                            {[
                                { text: "C'est quoi le processus de CSQ?", icon: <Zap size={16} /> },
                                { text: "Explique-moi le CÉLIAPP en détail", icon: <Sparkles size={16} /> },
                                { text: "Meilleurs sentiers SEPAQ en hiver", icon: <Zap size={16} /> },
                                { text: "Comment fonctionne le R-Score?", icon: <Sparkles size={16} /> },
                            ].map((s, i) => (
                                <button
                                    key={i}
                                    className="p-5 text-left text-[14px] text-text-dim font-bold bg-surface-2 border border-border rounded-2xl hover:bg-surface-3 hover:border-qblue/40 hover:text-text transition-all group shadow-sm flex items-center justify-between"
                                >
                                    <span>{s.text}</span>
                                    <span className="text-qblue opacity-0 group-hover:opacity-100 transition-opacity">
                                        {s.icon}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-[850px] mx-auto px-4 sm:px-6 space-y-8 pb-12">
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                agentName={currentAgent.name}
                                onFeedback={(type) => handleFeedback(msg.id, type)}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
};
