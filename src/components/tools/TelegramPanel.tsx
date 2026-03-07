'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Shield, Save, Bot, User, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TG_AGENTS = [
    { id: 'general', name: 'Québec AI', emoji: '⚜️', color: '#2563eb' },
    { id: 'immigration', name: 'Immigration QC', emoji: '🏛️', color: '#7c3aed' },
    { id: 'fiscalite', name: 'Fiscalité QC', emoji: '💰', color: '#059669' },
    { id: 'cegep', name: 'Prof Cégep', emoji: '📚', color: '#dc2626' },
];

export default function TelegramPanel() {
    const [activeAgent, setActiveAgent] = useState('general');
    const [messages, setMessages] = useState<any[]>([
        { role: 'bot', text: '⚜️ Bonjour! Je suis **QuébecAI Bot**.\n\nTape /aide pour voir ce que je sais faire, ou pose-moi n\'importe quelle question sur le Québec! 🍁', time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (textOverride?: string) => {
        const text = (textOverride || input).trim();
        if (!text) return;

        const time = new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { role: 'user', text, time }]);
        if (!textOverride) setInput('');

        setIsTyping(true);

        setTimeout(() => {
            let reply = "";
            if (text.startsWith('/start')) {
                reply = "Bonjour! Je suis ton assistant souverain sur Telegram. Prêt à t'aider avec tes démarches au Québec.";
            } else if (text.startsWith('/aide')) {
                reply = "**Commandes disponibles**:\n/start - Démarrer\n/aide - Liste des commandes\n/immigration - Expert PEQ/CSQ\n/impots - Fiscalité\n/carte - Trouver un lieu";
            } else {
                reply = `En tant qu'agent **${activeAgent}**, je traite ta demande : "${text}". Ici au Québec, nous privilégions la précision et le service direct.`;
            }

            setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }) }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="absolute inset-0 flex overflow-hidden">
            {/* Configuration Sidebar */}
            <div className="w-[320px] min-w-[320px] bg-surface border-r border-border flex flex-col overflow-hidden text-text">
                <div className="p-4 border-b border-border">
                    <h1 className="font-display font-extrabold text-lg text-text tracking-tight flex items-center gap-2">
                        <div className="w-6 h-6 bg-qblue-bright rounded-full flex items-center justify-center text-[10px] text-white">✈️</div>
                        Bot Telegram
                    </h1>
                    <p className="text-[11px] text-text-dim mt-1">Configurez et testez votre agent Québec AI sur Telegram.</p>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-2/30">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-qblue to-blue-900 rounded-full flex items-center justify-center text-lg">⚜️</div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-text truncate">@QuebecAI_bot</div>
                        <div className="text-[10px] text-success font-bold uppercase tracking-widest">Connecté</div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-text-dim font-bold uppercase tracking-widest px-1">Token du bot (@BotFather)</label>
                            <input
                                type="password"
                                placeholder="1234567890:AAEhBOweik..."
                                className="w-full px-3 py-2 bg-surface-2 border border-border-bright rounded-lg text-xs font-mono outline-none focus:border-accent"
                            />
                            <p className="text-[9px] text-text-muted italic px-1">Ne partagez jamais votre token publiquement.</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] text-text-dim font-bold uppercase tracking-widest px-1">Agent Actif</label>
                            <div className="grid grid-cols-1 gap-1">
                                {TG_AGENTS.map(agent => (
                                    <button
                                        key={agent.id}
                                        onClick={() => setActiveAgent(agent.id)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all border border-transparent text-left",
                                            activeAgent === agent.id ? "bg-surface-3 border-border-bright text-text" : "text-text-dim hover:bg-surface-2"
                                        )}
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{ background: agent.color }} />
                                        <span className="text-sm">{agent.emoji}</span>
                                        <span className="text-xs font-medium">{agent.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setIsSaved(true);
                            setTimeout(() => setIsSaved(false), 2000);
                        }}
                        className={cn(
                            "w-full py-3 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95",
                            isSaved ? "bg-success text-white shadow-success/20" : "bg-qblue hover:bg-qblue-bright text-white shadow-qblue/20"
                        )}
                    >
                        {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                        {isSaved ? "Config Sauvegardée!" : "Sauvegarder la config"}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-bg/50 relative">
                <div className="h-[56px] border-b border-border bg-surface px-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-qblue to-blue-900 rounded-full flex items-center justify-center text-lg shadow-lg">⚜️</div>
                    <div className="flex-1">
                        <div className="text-[13px] font-bold text-text">Bot Québec AI</div>
                        <div className="flex items-center gap-1.5 leading-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-success" />
                            <span className="text-[10px] text-success font-bold uppercase tracking-wider">En ligne</span>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-2 border border-border rounded-full text-[10px] text-text-dim font-bold uppercase tracking-widest">
                        <Zap size={10} className="text-qblue-bright" />
                        Simulateur
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 scrollbar-thin">
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex flex-col group animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "items-end" : "items-start")}>
                            <div className={cn(
                                "p-3 rounded-2xl max-w-[85%] text-[13.5px] leading-relaxed shadow-sm",
                                msg.role === 'user'
                                    ? "bg-qblue text-white rounded-tr-none"
                                    : "bg-surface-2 border border-border rounded-tl-none text-text"
                            )}>
                                {msg.text.split('\n').map((line: string, li: number) => (
                                    <p key={li} className={cn("mb-1 last:mb-0", line.startsWith('**') && "font-bold text-accent")}>
                                        {line.replace(/\*\*/g, '')}
                                    </p>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 mt-1 px-1">
                                <span className="text-[9px] text-text-muted font-bold uppercase">{msg.time}</span>
                                {msg.role === 'user' && <span className="text-accent text-[9px] font-bold">✓✓</span>}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex flex-col items-start animate-in fade-in duration-200">
                            <div className="bg-surface-2 border border-border rounded-2xl rounded-tl-none p-3 px-4">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-text-dim rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-text-dim rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-text-dim rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="px-4 py-3 bg-surface border-t border-border border-b overflow-x-auto scrollbar-none flex gap-2">
                    {['/start', '/aide', '/immigration', '/impots', 'Bonjour!'].map(cmd => (
                        <button
                            key={cmd}
                            onClick={() => handleSend(cmd)}
                            className="px-3.5 py-1.5 bg-surface-2 border border-border-bright rounded-full text-[11px] text-qblue-bright font-bold hover:bg-surface-3 transition-all whitespace-nowrap"
                        >
                            {cmd}
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-surface flex gap-3">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Écrivez un message..."
                        className="flex-1 bg-surface-2 border border-border-bright rounded-2xl px-5 py-3 text-[14px] outline-none focus:border-accent"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className="w-12 h-12 bg-qblue hover:bg-qblue-bright text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 shadow-lg"
                    >
                        <Send size={20} />
                    </button>
                </div>

                <div className="px-4 pb-4 text-center">
                    <p className="flex items-center justify-center gap-4 text-[9px] text-text-dim font-bold uppercase tracking-widest opacity-50">
                        <span className="flex items-center gap-1"><Shield size={10} /> Chiffrement e2e</span>
                        <span className="flex items-center gap-1"><Bot size={10} /> IA Souveraine</span>
                        <span className="flex items-center gap-1"><User size={10} /> Profil Privé</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
