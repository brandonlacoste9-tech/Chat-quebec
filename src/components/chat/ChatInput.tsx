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
        <div className="w-full max-w-[800px] mx-auto px-6 pb-6 pt-2">
            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden focus-within:border-qblue-bright/30 transition-all">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question... (Shift+Entrée pour nouvelle ligne)"
                    className="w-full bg-transparent border-none focus:ring-0 text-white/90 p-5 pr-16 resize-none min-h-[64px] max-h-[220px] scrollbar-none text-[15.5px] placeholder:text-white/20 transition-all font-medium leading-relaxed"
                    rows={1}
                    disabled={isStreaming || disabled}
                />

                <div className="flex items-center justify-between px-5 pb-4">
                    <div className="flex items-center gap-1.5">
                        <button className="p-2.5 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Joindre un fichier">
                            <Paperclip size={18} />
                        </button>
                        <button className="p-2.5 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Saisie vocale">
                            <Mic size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {isStreaming ? (
                            <button
                                onClick={onStop}
                                className="w-11 h-11 bg-danger text-white rounded-[18px] flex items-center justify-center transition-all animate-pulse"
                            >
                                <Square size={18} fill="white" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isStreaming || disabled}
                                className="w-11 h-11 bg-qblue-bright hover:bg-white text-white hover:text-qblue rounded-[18px] flex items-center justify-center transition-all disabled:opacity-20 shadow-lg active:scale-95 group"
                            >
                                <Send size={18} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
