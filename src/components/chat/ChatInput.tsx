'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowUp, Square, Mic, Paperclip } from 'lucide-react';
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
        <div className="mx-auto w-full max-w-3xl">
            <div className="relative rounded-[28px] border border-white/15 bg-[#2f2f2f] shadow-2xl transition focus-within:border-white/30">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrivez votre message..."
                    className="w-full resize-none border-none bg-transparent px-5 pb-14 pt-5 text-[16px] leading-relaxed text-white/95 placeholder:text-white/45 focus:ring-0 min-h-[72px] max-h-[220px] scrollbar-none"
                    rows={1}
                    disabled={isStreaming || disabled}
                />

                <div className="absolute bottom-3 left-3 flex items-center gap-1">
                    <button
                        className="rounded-lg p-2 text-white/45 transition hover:bg-white/10 hover:text-white"
                        title="Joindre un fichier"
                    >
                        <Paperclip size={18} className="-rotate-45" />
                    </button>
                    <button
                        className="rounded-lg p-2 text-white/45 transition hover:bg-white/10 hover:text-white"
                        title="Entrée vocale"
                    >
                        <Mic size={18} />
                    </button>
                </div>

                <div className="absolute bottom-3 right-3">
                    {isStreaming ? (
                        <button
                            onClick={onStop}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/15 text-rose-300 transition hover:bg-rose-500 hover:text-white"
                            title="Arrêter la génération"
                        >
                            <Square size={12} fill="currentColor" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isStreaming || disabled}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Envoyer"
                        >
                            <ArrowUp size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-2 px-1 text-center text-xs text-white/50">
                L&apos;IA peut se tromper. Vérifiez les informations importantes.
            </div>
        </div>
    );
};
