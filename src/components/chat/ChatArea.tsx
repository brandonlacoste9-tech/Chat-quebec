'use client';

import React, { useRef, useEffect } from 'react';
import { Menu, Zap } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { FleurDeLis } from '@/components/ui/FleurDeLis';
import { AgentType } from '@/types/chat';

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
            {/* Flag Strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[#003893] via-white to-[#003893] shrink-0" />

            {/* Topbar */}
            <div className="h-[56px] border-b border-border px-4 flex items-center gap-4 bg-surface/95 backdrop-blur-md z-10 shrink-0">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-1 text-text-dim hover:text-text hover:bg-surface-2 rounded-lg lg:hidden"
                >
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-surface-2 border border-border rounded-full shadow-sm">
                    <span className="text-sm">{currentAgent.emoji}</span>
                    <span className="text-[13px] font-semibold text-text tracking-tight uppercase">
                        {currentAgent.name}
                    </span>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-text-dim font-bold tracking-widest uppercase bg-surface-2/50 px-2.5 py-1 rounded-full border border-border">
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <span>Souverain-1-Pro</span>
                    </div>
                    <div className="text-[11px] font-bold text-text-dim px-2 py-0.5 border border-border rounded uppercase tracking-tighter bg-surface-2">
                        ⚖️ Loi 25
                    </div>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto pt-8 pb-4 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 max-w-[600px] mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 bg-gradient-to-br from-qblue to-blue-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-qblue/20 mb-8 animate-bounce transition-transform hover:scale-110">
                            <FleurDeLis size={32} color="white" />
                        </div>
                        <h1 className="font-display text-3xl font-extrabold text-text mb-3 tracking-tight">
                            Bonjour! Comment puis-je t&apos;aider?
                        </h1>
                        <p className="text-text-dim text-sm leading-relaxed mb-10 max-w-[420px]">
                            {currentAgent.desc}. Posez-moi vos questions sur le Québec, sa culture, sa fiscalité ou ses processus officiels.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {[
                                "C'est quoi le processus de CSQ?",
                                "Explique-moi le CÉLIAPP en détail",
                                "Meilleurs sentiers SEPAQ en hiver",
                                "Comment fonctionne le R-Score?",
                            ].map((s) => (
                                <button
                                    key={s}
                                    className="p-4 text-left text-[13px] text-text-dim font-medium bg-surface-2 border border-border-bright rounded-xl hover:bg-surface-3 hover:border-accent hover:text-accent transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{s}</span>
                                        <Zap size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 pb-12">
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
