import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Bot, Terminal } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const AIChatWidget: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'System online. Organic Intelligence interface ready. Awaiting command input.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(input);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <GlassCard className="flex flex-col h-full min-h-[600px] bg-slate-50" noPadding>
      {/* Header - Solid Technical Look */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cobalt-50 rounded-md border border-cobalt-100 text-cobalt-600">
            <Terminal size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">Gemini Core v3.0</h3>
            <p className="text-xs text-slate-500 font-mono">Neural Link Active</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-200 font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Online
        </div>
      </div>

      {/* Messages Area - High Contrast */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Avatar/Icon Label */}
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">
                    {msg.role === 'user' ? 'Operator' : 'System'}
                </span>
                
                {/* Message Bubble */}
                <div
                className={`p-4 rounded-lg text-sm leading-relaxed shadow-sm border ${
                    msg.role === 'user'
                    ? 'bg-cobalt-600 text-white border-cobalt-700 rounded-tr-none'
                    : 'bg-white text-slate-800 border-slate-200 rounded-tl-none font-medium'
                }`}
                >
                {msg.text}
                </div>
                
                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex flex-col items-start max-w-[85%]">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">System</span>
                <div className="bg-white p-4 rounded-lg rounded-tl-none border border-slate-200 flex items-center gap-3 shadow-sm">
                <Loader2 className="animate-spin text-cobalt-600" size={16} />
                <span className="text-xs text-slate-600 font-mono">Processing query...</span>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Solid and Defined */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter command or query..."
            className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-md pl-4 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cobalt-500 focus:border-cobalt-500 transition-all font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-cobalt-600 text-white rounded-md hover:bg-cobalt-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm border border-cobalt-700"
          >
            <Send size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="mt-2 text-center">
            <p className="text-[10px] text-slate-400 font-mono">AI output generated by Gemini-3-Flash. Verify critical data.</p>
        </div>
      </div>
    </GlassCard>
  );
};