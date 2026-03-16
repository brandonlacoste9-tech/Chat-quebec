'use client';

import React from 'react';
import { useChatStore } from '@/lib/store';
import { Plus, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    user: {
        id: string;
        email: string;
        plan: string;
        stripeCustomerId?: string;
    };
}

export const Sidebar = ({ user }: SidebarProps) => {
    const { 
        conversations, 
        activeConvId, 
        addConversation, 
        setActiveConvId 
    } = useChatStore();

    const [isOpen, setIsOpen] = React.useState(false);

    const handleNewChat = () => {
        const id = Math.random().toString(36).substr(2, 9);
        addConversation({
            id,
            title: "New Chat",
            messages: [],
            agent: 'general',
            createdAt: new Date(),
        });
        setActiveConvId(id);
        setIsOpen(false);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-3 left-4 z-110 w-9 h-9 flex items-center justify-center bg-bark-l border border-border-parlons rounded-lg text-gold"
            >
                <Menu size={18} />
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "sidebar h-full w-[268px] min-w-[268px] bg-bark-l border-r border-border-parlons flex flex-col overflow-hidden relative transition-transform duration-300 z-105 pattern-bg",
                "fixed lg:static inset-y-0 left-0",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-[22px_17px_17px] border-b border-border-parlons relative z-10">
                    <div className="brand flex items-center gap-[11px] mb-[15px]">
                        <div className="brand-icon w-[38px] h-[38px] bg-gold rounded-[8px] flex items-center justify-center font-playfair text-[19px] font-black text-bark relative shrink-0 overflow-hidden">
                            P
                            <div className="absolute inset-[2px] border border-black/18 rounded-[6px]" />
                        </div>
                        <div>
                            <div className="brand-name font-playfair text-[18px] font-bold text-gold leading-none">Parlons</div>
                            <div className="brand-sub font-barlow-cond text-[9px] tracking-[2.5px] color-[var(--text-dim)] uppercase mt-[2px]">Quebec AI</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleNewChat}
                        className="new-btn w-full p-[10px_14px] bg-transparent border border-border-hot rounded-[8px] color-[var(--gold)] font-barlow-cond text-[11px] font-semibold tracking-[2px] uppercase cursor-pointer flex items-center justify-center gap-[7px] transition-all hover:bg-[rgba(201,168,76,.09)]"
                    >
                        <Plus size={14} strokeWidth={3} />
                        New session
                    </button>
                </div>

                <div className="sec-lbl font-barlow-cond text-[9px] tracking-[2.5px] text-text-dim uppercase p-[13px_17px_5px] relative z-10">
                    Recent chats
                </div>

                <div className="chats flex-1 overflow-y-auto p-[0_7px_12px] scrollbar-thin relative z-10">
                    {conversations.length === 0 ? (
                        <div className="p-[13px_11px] text-text-dim text-[11px] font-barlow-cond tracking-[1px] uppercase">
                            No chats yet
                        </div>
                    ) : (
                        conversations.map((chat) => (
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
                        <div className="uav w-[29px] h-[29px] rounded-full bg-cognac border-[1.5px] border-gold-d flex items-center justify-center font-playfair text-[13px] font-bold text-gold-l shrink-0 uppercase">
                            {user.email[0]}
                        </div>
                        <div className="unm text-[12.5px] font-medium text-text-main flex-1 truncate">{user.email.split('@')[0]}</div>
                        <div className="upl font-barlow-cond text-[8px] tracking-[1.5px] text-gold bg-[rgba(201,168,76,.1)] p-[2px_6px] rounded-[3px] border border-[rgba(201,168,76,.18)] group-hover:bg-gold group-hover:text-bark transition-colors uppercase">
                            {user.plan === 'free' ? 'Upgrade' : user.plan}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
