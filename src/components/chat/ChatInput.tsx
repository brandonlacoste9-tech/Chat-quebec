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
        <div className="w-full max-w-[800px] mx-auto px-4 pb-8 pt-2">
            <div className="relative group">
                {/* Glow Effect on Focus */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-qblue/20 to-accent/20 rounded-[30px] blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>

                <div className="relative bg-[#111111] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden focus-within:border-white/20 focus-within:bg-[#141414] transition-all duration-300">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Écrivez votre message... (Maj+Entrée pour nouvelle ligne)"
                        className="w-full bg-transparent border-none focus:ring-0 text-white/90 p-6 pr-16 resize-none min-h-[70px] max-h-[220px] scrollbar-none text-[16px] placeholder:text-white/20 transition-all font-medium leading-relaxed"
                        rows={1}
                        disabled={isStreaming || disabled}
                    />

                    <div className="flex items-center justify-between px-5 pb-4">
                        <div className="flex items-center gap-1">
                            <button
                                className="p-2.5 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-xl transition-all duration-200"
                                title="Joindre un fichier"
                            >
                                <Paperclip size={19} />
                            </button>
                            <button
                                className="p-2.5 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-xl transition-all duration-200"
                                title="Dictée vocale"
                            >
                                <Mic size={19} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {isStreaming ? (
                                <button
                                    onClick={onStop}
                                    className="w-10 h-10 bg-danger/80 hover:bg-danger text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-danger/20"
                                >
                                    <Square size={16} fill="white" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isStreaming || disabled}
                                    className="w-10 h-10 bg-white text-black hover:bg-qblue-bright hover:text-white rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-10 disabled:grayscale shadow-lg active:scale-90 group/btn"
                                >
                                    <Send size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimal Sovereignty Hint */}
            <div className="mt-4 flex justify-center items-center gap-2 opacity-10 pointer-events-none">
                <span className="text-[9px] font-black uppercase tracking-[3px]">Souveraineté Digitale du Québec</span>
            </div>
        </div>
    );
};
