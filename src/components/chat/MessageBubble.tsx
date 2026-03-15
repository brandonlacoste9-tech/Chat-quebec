'use client';

import React, { useState } from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
    message: Message;
    agentName: string;
    onFeedback?: (type: 'up' | 'down') => void;
    onRegenerate?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agentName, onFeedback }) => {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group w-full animate-in fade-in slide-in-from-top-1 duration-300">
            <div className={cn('flex w-full gap-3 py-4', isUser ? 'justify-end' : 'justify-start')}>
                {!isUser && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                        <Sparkles size={14} />
                    </div>
                )}

                <div className={cn('min-w-0', isUser ? 'max-w-[78%]' : 'flex-1')}>
                    {!isUser && (
                        <div className="mb-1 flex items-center gap-2">
                            <span className="text-xs font-medium text-white/85">{agentName}</span>
                            <span className="text-[11px] text-white/35">{message.time}</span>
                        </div>
                    )}

                    <div
                        className={cn(
                            'relative text-[15px] leading-7 text-white/90',
                            isUser
                                ? 'rounded-3xl bg-[#303030] px-4 py-3 text-white'
                                : 'rounded-2xl px-1 py-0.5',
                        )}
                    >
                        {message.role === 'assistant' ? (
                            <div className="prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#171717] prose-code:rounded prose-code:bg-white/10 prose-code:px-1 prose-code:text-white">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        )}

                        {message.streaming && (
                            <span className="ml-1 inline-block h-4 w-2 animate-pulse align-middle bg-white/55" />
                        )}
                    </div>

                    {!isUser && !message.streaming && message.content.length > 0 && (
                        <div className="mt-2 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                                onClick={handleCopy}
                                title="Copier la réponse"
                                className="p-1 text-white/40 transition hover:text-white"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                            <div className="h-3.5 w-px bg-white/15" />
                            <button
                                onClick={() => onFeedback?.('up')}
                                title="Bonne réponse"
                                className={cn(
                                    'p-1 transition',
                                    message.feedback === 'up'
                                        ? 'text-emerald-400'
                                        : 'text-white/40 hover:text-white',
                                )}
                            >
                                <ThumbsUp size={14} />
                            </button>
                            <button
                                onClick={() => onFeedback?.('down')}
                                title="Réponse à améliorer"
                                className={cn(
                                    'p-1 transition',
                                    message.feedback === 'down'
                                        ? 'text-rose-400'
                                        : 'text-white/40 hover:text-white',
                                )}
                            >
                                <ThumbsDown size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
