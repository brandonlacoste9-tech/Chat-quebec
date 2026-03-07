'use client';

import React, { useRef, useEffect } from 'react';
import { Send, Square, Mic, Paperclip } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (text: string) => void;
    onStop: () => void;
    disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop, disabled }) => {
    const [input, setInput] = React.useState('');
    const { isStreaming } = useChatStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
        }
    }, [input]);

    const handleSend = () => {
        if (input.trim() && !isStreaming && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full max-w-[850px] mx-auto px-6 pb-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="relative glass border-border-bright rounded-[32px] shadow-2xl overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-qblue/15 bg-black/40">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question... (Shift+Entrée pour nouvelle ligne)"
                    className="w-full bg-transparent border-none focus:ring-0 text-text p-6 pr-16 resize-none min-h-[70px] max-h-[220px] scrollbar-none text-[16px] placeholder:text-text-muted transition-all font-body"
                    rows={1}
                    disabled={isStreaming || disabled}
                />

                <div className="flex items-center justify-between px-6 pb-4">
                    <div className="flex items-center gap-2">
                        <button className="p-3 text-text-dim hover:text-text hover:bg-surface-3 rounded-2xl transition-all" title="Joindre un fichier">
                            <Paperclip size={20} />
                        </button>
                        <button className="p-3 text-text-dim hover:text-text hover:bg-surface-3 rounded-2xl transition-all" title="Saisie vocale">
                            <Mic size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        {isStreaming ? (
                            <button
                                onClick={onStop}
                                className="w-12 h-12 bg-danger shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-danger/80 text-white rounded-2xl flex items-center justify-center transition-all animate-pulse"
                            >
                                <Square size={20} fill="white" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isStreaming || disabled}
                                className="w-14 h-14 leather-pro stitched-gold hover:scale-110 active:scale-95 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 shadow-2xl group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Send size={24} className="text-white drop-shadow-lg group-hover:rotate-12 transition-transform" strokeWidth={3} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-text-dim/40">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-qblue animate-pulse" />
                    IA SOUVERAINE DU QUÉBEC
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success opacity-50" />
                    DATA HOSTED IN MONTREAL
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold opacity-50" />
                    CONFORME LOI 25
                </div>
            </div>
        </div>
    );
};
