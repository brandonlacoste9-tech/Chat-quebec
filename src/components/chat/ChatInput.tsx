'use client';

import React, { useRef, useEffect } from 'react';
import { Send, Square, Mic, Paperclip } from 'lucide-react';
import { useChatStore } from '@/lib/store';

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
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
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
        <div className="w-full max-w-[800px] mx-auto px-4 pb-6">
            <div className="relative bg-[#1a1a1a] border border-white/[0.08] rounded-[28px] shadow-2xl transition-all duration-300 focus-within:border-white/20">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question... (Maj+Entrée pour un saut de ligne)"
                    className="w-full bg-transparent border-none focus:ring-0 text-white/90 px-6 pt-6 pb-2 resize-none min-h-[60px] max-h-[220px] scrollbar-none text-[16px] placeholder:text-white/20 font-medium leading-relaxed"
                    rows={1}
                    disabled={isStreaming || disabled}
                />

                <div className="flex items-center justify-between px-4 pb-3">
                    <div className="flex items-center gap-0.5">
                        <button
                            className="p-2.5 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-2xl transition-all"
                            title="Joindre un fichier"
                        >
                            <Paperclip size={20} className="-rotate-45" />
                        </button>
                        <button
                            className="p-2.5 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-2xl transition-all"
                            title="Entrée vocale"
                        >
                            <Mic size={20} />
                        </button>
                    </div>

                    <div className="flex items-center pr-1">
                        {isStreaming ? (
                            <button
                                onClick={onStop}
                                className="w-9 h-9 bg-danger/20 text-danger hover:bg-danger hover:text-white rounded-full flex items-center justify-center transition-all animate-pulse"
                            >
                                <Square size={12} fill="currentColor" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isStreaming || disabled}
                                className="w-9 h-9 bg-white text-black hover:bg-qblue-bright hover:text-white rounded-full flex items-center justify-center transition-all disabled:opacity-5 disabled:grayscale active:scale-95 group shadow-lg"
                            >
                                <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center select-none">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/5">Souveraineté Digitale · Québec AI</span>
            </div>
        </div>
    );
};
