'use client';

import React from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
    message: Message;
    // Parlons specific props
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={cn(
            "msg mb-[23px] flex gap-[12px] items-start animate-in fade-in slide-in-from-bottom-2 duration-300",
            isUser ? "flex-row-reverse" : "flex-row"
        )}>
            <div className={cn(
                "mav w-[31px] h-[31px] rounded-[7px] flex items-center justify-center shrink-0 mt-px font-playfair text-[13px] font-bold shadow-sm",
                isUser ? "u bg-cognac border-[1.5px] border-gold-d text-gold-l" : "a bg-gold border-[1.5px] border-gold-l text-bark"
            )}>
                {isUser ? 'M' : 'P'}
            </div>
            
            <div className={cn(
                "mbody flex-1 min-w-0 flex flex-col",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "mwho font-barlow-cond text-[10px] tracking-[2px] uppercase mb-[5px] flex items-center gap-[6px]",
                    isUser ? "u text-cognac-l" : "a text-gold"
                )}>
                    {!isUser && (
                        <>
                            <span>Parlons</span>
                            {message.source && (
                                <span className={cn(
                                    "msrc text-[8px] tracking-[1px] p-[1px_5px] rounded-[3px]",
                                    message.source === 'ollama' ? "ollama text-[#4ade80] bg-[rgba(74,222,128,.1)] border border-[rgba(74,222,128,.2)]" :
                                    message.source === 'deepseek' ? "deepseek text-[#60a5fa] bg-[rgba(96,165,250,.1)] border border-[rgba(96,165,250,.2)]" :
                                    "err text-[#f87171] bg-[rgba(248,113,113,.1)] border border-[rgba(248,113,113,.2)]"
                                )}>
                                    {message.source === 'ollama' ? '🦙 ollama' : message.source === 'deepseek' ? '🌊 deepseek' : '⚠️ erreur'}
                                </span>
                            )}
                        </>
                    )}
                    {isUser && <span>Toé</span>}
                    <span className="mtime text-text-dim text-[9px] tracking-[0.5px] font-barlow lowercase font-normal">{message.time}</span>
                </div>

                <div className={cn(
                    "mtxt text-[14.5px] leading-[1.78] font-light min-w-0",
                    isUser 
                        ? "u bg-[rgba(139,69,19,.13)] border border-[rgba(139,69,19,.22)] p-[11px_15px] rounded-[3px_13px_13px_13px] text-text-main font-normal" 
                        : "a text-text-main"
                )}>
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-invert max-w-none prose-p:mb-[10px] last:prose-p:mb-0 prose-strong:text-gold-l prose-strong:font-semibold prose-code:bg-bark-ll prose-code:border prose-code:border-border-parlons prose-code:p-[1px_6px] prose-code:rounded-[4px] prose-code:text-[12px] prose-code:text-gold-l">
                            {message.streaming && !message.content ? (
                                <div className="dots flex gap-[5px] py-[3px] items-center">
                                    <span className="w-[6px] h-[6px] rounded-full bg-gold opacity-40 animate-pulse" />
                                    <span className="w-[6px] h-[6px] rounded-full bg-gold opacity-40 animate-pulse delay-75" />
                                    <span className="w-[6px] h-[6px] rounded-full bg-gold opacity-40 animate-pulse delay-150" />
                                </div>
                            ) : (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    )}
                    {message.streaming && message.content && (
                        <span className="inline-block w-2 h-4 bg-gold-l/40 ml-1 animate-pulse align-middle" />
                    )}
                </div>
            </div>
        </div>
    );
};
