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
        <div className="w-full max-w-[800px] mx-auto px-4 pb-8">
            <div className="relative bg-[#161616] border border-white/[0.05] rounded-[24px] shadow-2xl transition-all duration-300 focus-within:border-white/10 group">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrivez votre message ici..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white/90 px-6 pt-7 pb-16 resize-none min-h-[80px] max-h-[240px] scrollbar-none text-[16px] placeholder:text-white/10 font-medium leading-relaxed"
                    rows={1}
                    disabled={isStreaming || disabled}
                />

                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                    <button
                        className="p-2 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-xl transition-all"
                        title="Joindre"
                    >
                        <Paperclip size={18} className="-rotate-45" />
                    </button>
                    <button
                        className="p-2 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-xl transition-all"
                        title="Vocal"
                    >
                        <Mic size={18} />
                    </button>
                </div>

                <div className="absolute bottom-4 right-4">
                    {isStreaming ? (
                        <button
                            onClick={onStop}
                            className="w-9 h-9 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-full flex items-center justify-center transition-all animate-pulse"
                        >
                            <Square size={12} fill="currentColor" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isStreaming || disabled}
                            className="w-9 h-9 bg-white text-black hover:bg-qblue-bright hover:text-white rounded-full flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-95 shadow-xl"
                        >
                            <Send size={15} />
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4 flex justify-center opacity-10 pointer-events-none select-none">
                <span className="text-[8px] font-black uppercase tracking-[5px]">Québec AI OS</span>
            </div>
        </div>
    );
};
