
export interface PdfLink {
  source: string;
  url: string;
}

export interface Book {
  title: string;
  author: string;
  summary: string;
  coverImageUrl: string;
  pdfLinks: PdfLink[];
}

export interface BotResponse {
  reply: string;
  books: Book[];
}

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
  LOADING = 'loading',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text?: string;
  books?: Book[];
}
