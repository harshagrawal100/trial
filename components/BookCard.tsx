
import React from 'react';
import type { Book, PdfLink } from '../types';
import { DownloadIcon } from './Icons';

const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <div className="bg-white dark:bg-brand-surface-dark rounded-2xl shadow-lg overflow-hidden my-2 max-w-sm w-full animate-bounce-in transform transition-transform duration-300 hover:scale-105">
      <img src={book.coverImageUrl || 'https://picsum.photos/400/600'} alt={`Cover for ${book.title}`} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{book.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{book.author}</p>
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-4 h-16 overflow-y-auto">{book.summary}</p>
        <div className="flex flex-col gap-2">
          {book.pdfLinks.length > 0 ? (
            book.pdfLinks.map((link: PdfLink, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-neon-pink to-brand-purple rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 animate-sparkle"
              >
                <span>{link.source}</span>
                <DownloadIcon className="w-5 h-5" />
              </a>
            ))
          ) : (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">No PDF links found for this one, sorry! 😢</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
