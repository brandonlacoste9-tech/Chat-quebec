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
        <div className="w-full max-w-[800px] mx-auto px-4 pb-6">
            <div className="relative glass border-border-bright rounded-[24px] shadow-2xl overflow-hidden transition-all duration-300 focus-within:border-accent/40 focus-within:ring-4 focus-within:ring-qblue-glow">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question... (Shift+Entrée pour nouvelle ligne)"
                    className="w-full bg-transparent border-none focus:ring-0 text-text p-5 pr-14 resize-none min-h-[60px] max-h-[180px] scrollbar-none text-[15px] placeholder:text-text-muted transition-all"
                    rows={1}
                    disabled={isStreaming || disabled}
                />

                <div className="flex items-center justify-between px-4 pb-3">
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-text-dim hover:text-text hover:bg-surface-3 rounded-lg transition-all" title="Joindre un fichier (PDF, Image)">
                            <Paperclip size={18} />
                        </button>
                        <button className="p-2 text-text-dim hover:text-text hover:bg-surface-3 rounded-lg transition-all" title="Saisie vocale (Whisper fr-CA)">
                            <Mic size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {input.length > 0 && (
                            <span className="text-[11px] text-text-muted font-medium bg-surface-3 px-2 py-0.5 rounded-md">
                                {input.length} car.
                            </span>
                        )}

                        {isStreaming ? (
                            <button
                                onClick={onStop}
                                className="w-10 h-10 bg-danger hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-danger/20 animate-pulse"
                            >
                                <Square size={16} fill="white" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isStreaming || disabled}
                                className="w-12 h-12 leather-pro stitched-gold hover:scale-105 active:scale-95 rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 shadow-2xl group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Send size={20} className="text-bg font-bold group-hover:rotate-12 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-3 text-center text-[10.5px] text-text-muted flex items-center justify-center gap-4">
                <span>⚜️ IA Souveraine du Québec</span>
                <span className="w-1 h-1 bg-text-muted/30 rounded-full" />
                <span>Données hébergées à Montréal</span>
                <span className="w-1 h-1 bg-text-muted/30 rounded-full" />
                <span>Conforme Loi 25</span>
            </div>
        </div>
    );
};
