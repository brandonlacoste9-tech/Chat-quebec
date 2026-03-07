'use client';

import React, { useState } from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
    message: Message;
    agentName: string;
    onFeedback?: (type: 'up' | 'down') => void;
    onRegenerate?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agentName, onFeedback, onRegenerate }) => {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn(
            "group flex flex-col max-w-[800px] mx-auto w-full px-4 animate-in fade-in slide-in-from-top-2 duration-300",
            isUser ? "items-end" : "items-start"
        )}>
            {/* Header label */}
            <div className="flex items-center gap-2 mb-2 px-1">
                <span className={cn(
                    "text-[10px] uppercase font-black tracking-widest",
                    isUser ? "text-qblue-bright" : "text-white/40"
                )}>
                    {isUser ? "VOUS" : agentName}
                </span>
                <span className="text-[10px] text-white/20 font-medium">{message.time}</span>
            </div>

            {/* Bubble content */}
            <div className={cn(
                "relative max-w-[90%] text-[15px] leading-relaxed transition-all",
                isUser
                    ? "bg-qblue text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md"
                    : "bg-[#1a1a1a] text-white/90 px-6 py-4 rounded-3xl rounded-tl-sm border border-white/5 shadow-sm"
            )}>
                {message.role === 'assistant' ? (
                    <div className="prose prose-invert max-w-none prose-p:my-0 prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-white/5 prose-code:text-accent prose-code:bg-white/5 prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap font-medium">{message.content}</p>
                )}

                {/* Cursor for streaming */}
                {message.streaming && (
                    <span className="inline-block w-2 h-4 bg-white/40 ml-1 animate-pulse align-middle" />
                )}
            </div>

            {/* Actions for assistant messages */}
            {!isUser && !message.streaming && message.content.length > 0 && (
                <div className="flex items-center gap-3 mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleCopy} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all">
                        {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                    <div className="flex items-center gap-1 border-l border-white/5 pl-2 ml-1">
                        <button onClick={() => onFeedback?.('up')} className={cn("p-1.5 hover:bg-white/5 rounded-lg transition-all", message.feedback === 'up' ? "text-success bg-success/10" : "text-white/40 hover:text-white")}>
                            <ThumbsUp size={14} />
                        </button>
                        <button onClick={() => onFeedback?.('down')} className={cn("p-1.5 hover:bg-white/5 rounded-lg transition-all", message.feedback === 'down' ? "text-danger bg-danger/10" : "text-white/40 hover:text-white")}>
                            <ThumbsDown size={14} />
                        </button>
                    </div>
                    {onRegenerate && (
                        <button onClick={onRegenerate} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all ml-1">
                            <RotateCw size={14} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
