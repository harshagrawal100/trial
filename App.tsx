
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessageToBot } from './services/geminiService';
import type { ChatMessage } from './types';
import { MessageSender } from './types';
import ChatBubble from './components/ChatBubble';
import ThemeToggle from './components/ThemeToggle';
import { SendIcon, BookOpenIcon } from './components/Icons';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chatHistory', [
    { id: 'initial', sender: MessageSender.BOT, text: "Hey! What book are you looking for? I'll see if I can hunt down a PDF for ya. 🕵️‍♀️" }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: MessageSender.USER,
      text: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToBot(input);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: MessageSender.BOT,
        text: botResponse.reply,
        books: botResponse.books,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: MessageSender.BOT,
        text: "Yikes! Something went wrong on my end. Let's try that again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, setMessages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-300">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-brand-surface-dark/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-8 h-8 text-brand-purple"/>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-brand-purple">
            BookBot
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <ChatBubble message={{ id: 'loading', sender: MessageSender.LOADING }} />}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-white/50 dark:bg-brand-surface-dark/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., The Hitchhiker's Guide to the Galaxy"
            className="flex-1 w-full px-4 py-3 bg-gray-100 dark:bg-brand-bg-dark text-gray-900 dark:text-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="p-3 rounded-full text-white bg-gradient-to-br from-neon-pink to-brand-purple disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-neon-pink/50"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6"/>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
