'use client';

import React, { useRef, useEffect } from 'react';
import { Send, Square, Mic, Paperclip } from 'lucide-react';
import { useChatStore } from '@/lib/store';

interface ChatInputProps {
    onSend: (text: string) => void;
    onStop: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop }) => {
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
        if (input.trim() && !isStreaming) {
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
            <div className="relative glass border-border-bright rounded-[20px] shadow-2xl overflow-hidden transition-all duration-300 focus-within:border-accent/40 focus-within:ring-4 focus-within:ring-qblue-glow">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question... (Shift+Entrée pour nouvelle ligne)"
                    className="w-full bg-transparent border-none focus:ring-0 text-text p-5 pr-14 resize-none min-h-[60px] max-h-[180px] scrollbar-none text-[15px] placeholder:text-text-muted transition-all"
                    rows={1}
                    disabled={isStreaming}
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
                                className="w-9 h-9 bg-danger hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-danger/20 animate-pulse"
                            >
                                <Square size={16} fill="white" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="w-9 h-9 bg-qblue hover:bg-qblue-bright text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-qblue/20 disabled:bg-surface-3 disabled:text-text-muted disabled:shadow-none translate-y-0 active:scale-95"
                            >
                                <Send size={18} />
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
