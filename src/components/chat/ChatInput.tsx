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
        <div className="w-full max-w-[850px] mx-auto px-6 pb-12">
            <div className="relative bg-surface-2 border border-border rounded-[24px] shadow-2xl overflow-hidden focus-within:border-qblue/40 focus-within:ring-4 focus-within:ring-qblue/10 transition-all">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question... (Shift+Entrée pour nouvelle ligne)"
                    className="w-full bg-transparent border-none focus:ring-0 text-text p-6 pr-16 resize-none min-h-[70px] max-h-[220px] scrollbar-none text-[15px] placeholder:text-text-muted transition-all font-sans"
                    rows={1}
                    disabled={isStreaming || disabled}
                />

                <div className="flex items-center justify-between px-6 pb-4">
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-text-dim hover:text-text hover:bg-surface-3 rounded-xl transition-all" title="Joindre un fichier">
                            <Paperclip size={18} />
                        </button>
                        <button className="p-2.5 text-text-dim hover:text-text hover:bg-surface-3 rounded-xl transition-all" title="Saisie vocale">
                            <Mic size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {isStreaming ? (
                            <button
                                onClick={onStop}
                                className="w-12 h-12 bg-danger hover:bg-danger/80 text-white rounded-2xl flex items-center justify-center transition-all animate-pulse shadow-lg"
                            >
                                <Square size={20} fill="white" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isStreaming || disabled}
                                className="w-12 h-12 bg-qblue hover:bg-qblue-bright text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 shadow-lg active:scale-95 group"
                            >
                                <Send size={20} className="text-white group-hover:rotate-12 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-[0.15em] text-text-dim/40 italic">
                <span>IA Souveraine du Québec</span>
                <span className="w-1 h-1 bg-text-dim/20 rounded-full" />
                <span>Hébergé à Montréal</span>
                <span className="w-1 h-1 bg-text-dim/20 rounded-full" />
                <span>Conforme Loi 25</span>
            </div>
        </div>
    );
};
