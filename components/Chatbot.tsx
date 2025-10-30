
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponseStream, startChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import ChatBubbleOvalLeftEllipsisIcon from './icons/ChatBubbleOvalLeftEllipsisIcon';
import XMarkIcon from './icons/XMarkIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import LoadingSpinner from './LoadingSpinner';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        startChat();
        setMessages([{ role: 'model', content: "Hi there! How can I help you with your course today?" }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = await getChatbotResponseStream(input);
        
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', content: '' }]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = modelResponse;
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Chatbot error:", error);
        setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Open chatbot"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] max-w-md h-[70vh] max-h-[600px] bg-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-in-up">
      <header className="flex items-center justify-between p-4 border-b border-slate-700">
        <h3 className="font-bold text-lg">AI Learning Assistant</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs md:max-w-sm rounded-xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-slate-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].role === 'user' && (
             <div className="flex justify-start">
                <div className="max-w-xs md:max-w-sm rounded-xl px-4 py-2 bg-slate-700 text-slate-200 rounded-bl-none flex items-center">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce mr-1"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce mr-1" style={{animationDelay: '0.1s'}}></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-700 border-slate-600 rounded-full px-4 py-2 text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} className="ml-3 text-purple-400 disabled:text-slate-500 disabled:cursor-not-allowed hover:text-purple-300">
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
