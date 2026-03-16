'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send, Paperclip, X } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (text: string, image?: string) => void;
    status: { color: string; text: string };
    disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, status, disabled }) => {
    const [input, setInput] = React.useState('');
    const [image, setImage] = React.useState<string | null>(null);
    const { isStreaming } = useChatStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
        }
    }, [input]);

    const handleSend = () => {
        if ((input.trim() || image) && !isStreaming && !disabled) {
            onSend(input, image || undefined);
            setInput('');
            setImage(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="inpwrap max-w-[700px] mx-auto relative px-[21px] md:px-0">
            {image && (
                <div className="img-preview mb-2 relative inline-block animate-in slide-in-from-bottom-2 duration-300">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gold-d/50 shadow-lg">
                        <Image 
                            src={image} 
                            alt="Preview" 
                            fill 
                            className="object-cover" 
                        />
                    </div>
                    <button 
                        onClick={() => setImage(null)}
                        className="absolute -top-2 -right-2 bg-bark-l border border-gold-d/50 rounded-full p-1 text-gold hover:text-gold-l transition-colors"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}
            
            <div className="relative flex items-end gap-2">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
                
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isStreaming || disabled}
                    className="paperclip h-[52px] w-[42px] shrink-0 bg-bark-l border-[1.5px] border-border-parlons rounded-[11px] flex items-center justify-center text-text-muted hover:text-gold hover:border-border-hot transition-all disabled:opacity-50"
                >
                    <Paperclip size={18} />
                </button>

                <div className="relative flex-1">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Écris queq'chose…"
                        className="inpbox w-full bg-bark-l border-[1.5px] border-border-parlons rounded-[11px] p-[12px_55px_12px_18px] text-text-main font-barlow text-[14.5px] font-normal resize-none outline-none min-h-[52px] max-h-[180px] leading-[1.65] transition-all focus:border-border-hot focus:bg-bark-ll placeholder:text-text-dim placeholder:italic shadow-inner"
                        rows={1}
                        disabled={isStreaming || disabled}
                    />
                    <button
                        onClick={handleSend}
                        disabled={(!input.trim() && !image) || isStreaming || disabled}
                        className="sndbtn absolute right-[9px] bottom-[9px] w-[34px] h-[34px] bg-gold border-none rounded-[7px] cursor-pointer flex items-center justify-center text-bark transition-all hover:bg-gold-l hover:scale-[1.05] disabled:bg-bark-mid/50 disabled:text-text-dim disabled:cursor-default disabled:scale-100 shadow-md"
                    >
                        <Send size={15} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
            
            <div className="inpfoot mt-[8px] font-barlow-cond text-[9px] tracking-[1px] text-text-dim text-center uppercase flex items-center justify-center gap-[8px]">
                <span className={cn(
                    "sdot w-[6px] h-[6px] rounded-full shrink-0 transition-all duration-300",
                    status.color === 'green' ? "bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,.6)]" :
                    status.color === 'blue' ? "bg-[#60a5fa] shadow-[0_0_8px_rgba(96,165,250,.6)]" :
                    status.color === 'red' ? "bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,.6)]" :
                    "bg-text-dim"
                )} />
                <span className="stxt">{status.text}</span>
            </div>
        </div>
    );
};
