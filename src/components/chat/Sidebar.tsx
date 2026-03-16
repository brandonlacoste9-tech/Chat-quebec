'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/lib/store';
import { Plus, Menu } from 'lucide-react';
import { AgentType } from '@/types/chat';
import { getDailyCount } from '@/lib/usage';

interface SidebarProps {
    user: {
        id: string;
        email: string;
        plan: string;
        stripeCustomerId?: string;
    };
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
    const { conversations, activeConvId, setActiveConvId, addConversation } = useChatStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleNewChat = () => {
        const id = Math.random().toString(36).substr(2, 9);
        addConversation({
            id,
            title: "New chat",
            messages: [],
            agent: 'general',
            createdAt: new Date(),
        });
        setActiveConvId(id);
        setIsOpen(false);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-3 left-4 z-[60] p-2 bg-bark-l border border-gold/20 rounded-lg text-gold shadow-lg shadow-black/20"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar Desktop/Mobile */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-[260px] bg-bark-l border-r border-border-parlons flex flex-col transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Overlay for mobile */}
                {isOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 lg:hidden z-[-1]"
                        onClick={() => setIsOpen(false)}
                    />
                )}

                <div className="sb-head p-[21px_15px_13px] shrink-0">
                    <div className="flex items-center gap-[11px] mb-[26px] px-[6px]">
                        <div className="w-[34px] h-[34px] bg-gold rounded-[9px] flex items-center justify-center font-playfair text-[18px] font-black text-bark shadow-[0_4px_12px_rgba(201,168,76,.15)] relative overflow-hidden group">
                            P
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </div>
                        <div>
                            <div className="font-playfair text-[15.5px] font-bold text-gold leading-tight tracking-tight">Parlons</div>
                            <div className="font-barlow-cond text-[10px] tracking-[3.5px] text-text-muted uppercase font-semibold">Quebec AI</div>
                        </div>
                    </div>

                    <button 
                        onClick={handleNewChat}
                        className="new-btn w-full flex items-center gap-3 p-[11px_15px] bg-[rgba(201,168,76,.07)] hover:bg-[rgba(201,168,76,.12)] border border-[rgba(201,168,76,.15)] hover:border-gold-d rounded-[11px] transition-all text-gold group"
                    >
                        <Plus size={16} className="transition-transform group-hover:rotate-90 duration-300" />
                        <span className="font-barlow-cond text-[12.5px] font-bold tracking-[2px] uppercase">New thread</span>
                    </button>
                </div>

                <div className="sb-body flex-1 overflow-y-auto p-[0_13px] scrollbar-thin">
                    <div className="st-label font-barlow-cond text-[10px] tracking-[2.5px] text-text-dim uppercase mb-[11px] px-[8px] mt-[6px]">Recent</div>
                    {conversations.length === 0 ? (
                        <div className="px-3 py-6 text-center italic text-text-dim text-[11px]">No discussions yet</div>
                    ) : (
                        conversations.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).map((chat) => (
                            <div 
                                key={chat.id}
                                onClick={() => { setActiveConvId(chat.id); setIsOpen(false); }}
                                className={cn(
                                    "ci p-[9px_11px] rounded-[8px] cursor-pointer border border-transparent mb-[2px] transition-all hover:bg-[rgba(201,168,76,.05)] hover:border-border-parlons",
                                    activeConvId === chat.id && "active bg-[rgba(201,168,76,.1)] border-border-hot"
                                )}
                            >
                                <div className={cn(
                                    "ci-t text-[12.5px] font-medium text-text-main whitespace-nowrap overflow-hidden text-ellipsis mb-[2px]",
                                    activeConvId === chat.id && "text-gold-l"
                                )}>
                                    {chat.title}
                                </div>
                                <div className="ci-m text-[10px] text-text-dim font-barlow-cond">
                                    {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''} • {formatDate(chat.createdAt)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="sb-foot p-[13px_15px] border-t border-border-parlons relative z-10">
                    <div className="absolute top-0 left-[15px] right-[15px] h-px bg-[repeating-linear-gradient(90deg,var(--gold-d)_0,var(--gold-d)_5px,transparent_5px,transparent_9px)] opacity-[.27]" />
                    <div 
                        onClick={async () => {
                            const endpoint = user.plan === 'free' ? '/api/checkout' : '/api/portal';
                            const body = user.plan === 'free' ? {} : { customerId: user.stripeCustomerId };
                            
                            try {
                                const res = await fetch(endpoint, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(body),
                                });
                                const data = await res.json();
                                if (data.url) window.location.href = data.url;
                            } catch (e) {
                                console.error("Stripe error:", e);
                            }
                        }}
                        className="urow flex items-center gap-[9px] p-[7px_9px] rounded-[7px] border border-border-parlons cursor-pointer transition-all hover:bg-[rgba(201,168,76,.06)] hover:border-border-hot group"
                    >
                        <div className="u-av w-[33px] h-[33px] bg-bark border border-border-parlons rounded-full flex items-center justify-center text-[15px] shadow-inner group-hover:border-gold-d transition-colors">👤</div>
                        <div className="un-c flex flex-col">
                            <div className="un-name text-[12.5px] font-bold text-text-main line-clamp-1">{user.email || 'Visitor'}</div>
                            {user.plan === 'free' && (
                                <div className="un-plan text-[10px] text-text-dim font-barlow-cond uppercase tracking-[1px]">
                                    {getDailyCount()}/20 free messages
                                </div>
                            )}
                            {user.plan !== 'free' && (
                                <div className="un-plan text-[10px] text-gold font-barlow-cond uppercase tracking-[1px]">
                                    {user.plan} account
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
