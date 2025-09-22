
import React from 'react';
import type { ChatMessage } from '../types';
import { MessageSender } from '../types';
import BookCard from './BookCard';
import { BookOpenIcon } from './Icons';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;
  const isBot = message.sender === MessageSender.BOT;
  const isLoading = message.sender === MessageSender.LOADING;

  if (isLoading) {
    return (
      <div className="flex justify-start animate-fade-in-up">
        <div className="flex items-center space-x-2 bg-gray-200 dark:bg-brand-surface-dark p-3 rounded-2xl rounded-bl-none max-w-xs lg:max-w-md">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl max-w-xs lg:max-w-md shadow-md ${
            isUser
              ? 'bg-brand-purple text-white rounded-br-none'
              : 'bg-gray-100 dark:bg-brand-surface-dark text-gray-900 dark:text-gray-100 rounded-bl-none'
          }`}
        >
          {message.text}
        </div>
        {isBot && message.books && message.books.length > 0 && (
          <div className="mt-2 w-full flex flex-col items-start">
              <div className="flex space-x-4 overflow-x-auto p-2 w-full max-w-xs lg:max-w-md scrollbar-hide">
                  {message.books.map((book, index) => (
                      <div key={index} className="flex-shrink-0">
                          <BookCard book={book} />
                      </div>
                  ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
