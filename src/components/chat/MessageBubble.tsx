'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ThumbsUp, ThumbsDown, Copy, RefreshCw, Check } from 'lucide-react';
import { Message } from '@/types/chat';
import { FleurDeLis } from '@/components/ui/FleurDeLis';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MessageBubbleProps {
    message: Message;
    agentName: string;
    onRegenerate?: () => void;
    onFeedback?: (type: 'up' | 'down') => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    agentName,
    onRegenerate,
    onFeedback
}) => {
    const isAi = message.role === 'assistant';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn(
            "w-full px-6 py-1 group animate-in fade-in slide-in-from-bottom-3 duration-300",
            isAi ? "bg-transparent" : "flex flex-row-reverse"
        )}>
            <div className={cn(
                "flex gap-4 max-w-[860px] w-full mx-auto",
                !isAi && "flex-row-reverse"
            )}>
                <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                    isAi
                        ? "bg-gradient-to-br from-qblue to-blue-900 shadow-lg shadow-qblue/15"
                        : "bg-surface-3 border border-border-bright text-[10px] text-text-dim font-bold"
                )}>
                    {isAi ? <FleurDeLis size={16} color="white" /> : "TOI"}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                    <div className={cn("flex items-center gap-2", !isAi && "justify-end")}>
                        <span className="text-[11.5px] font-semibold text-text-dim uppercase tracking-wider">
                            {isAi ? agentName : "Toi"}
                        </span>
                        <span className="text-[10px] text-text-muted">{message.time}</span>
                    </div>

                    <div className={cn(
                        "p-4 rounded-2xl text-[14.5px] leading-relaxed shadow-sm",
                        isAi
                            ? "bg-surface-2 border border-border rounded-tl-none text-text"
                            : "bg-qblue text-white rounded-tr-none px-5"
                    )}>
                        {isAi ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="my-4 rounded-xl overflow-hidden border border-border-bright shadow-lg">
                                                <SyntaxHighlighter
                                                    style={atomDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className={cn("bg-white/10 px-1.5 py-0.5 rounded text-accent font-mono text-[0.9em]", className)} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                                    ul: ({ children }) => <ul className="pl-6 mb-4 list-disc space-y-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="pl-6 mb-4 list-decimal space-y-2">{children}</ol>,
                                    h1: ({ children }) => <h1 className="text-xl font-display font-bold mb-4 mt-6 text-accent">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-lg font-display font-semibold mb-3 mt-5">{children}</h2>,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        ) : (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                        )}

                        {message.streaming && (
                            <span className="typing-cur" />
                        )}
                    </div>

                    {isAi && !message.streaming && (
                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onFeedback?.('up')}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium transition-all hover:bg-surface-3 hover:text-text",
                                    message.feedback === 'up' ? "text-success bg-success/10 border border-success/20" : "text-text-dim"
                                )}
                            >
                                <ThumbsUp size={13} />
                                {message.feedback === 'up' ? "Utile" : ""}
                            </button>
                            <button
                                onClick={() => onFeedback?.('down')}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium transition-all hover:bg-surface-3 hover:text-text",
                                    message.feedback === 'down' ? "text-danger bg-danger/10 border border-danger/20" : "text-text-dim"
                                )}
                            >
                                <ThumbsDown size={13} />
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium text-text-dim transition-all hover:bg-surface-3 hover:text-text"
                            >
                                {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                                {copied ? "Copié!" : "Copier"}
                            </button>
                            {onRegenerate && (
                                <button
                                    onClick={onRegenerate}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium text-text-dim transition-all hover:bg-surface-3 hover:text-text"
                                >
                                    <RefreshCw size={13} />
                                    Régénérer
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
