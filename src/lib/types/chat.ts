export interface ChatMessage {
  id: number;
  text: string;
  timestamp: Date;
  status: 'sent'; // Always 'sent' since UDP doesn't provide delivery confirmation
}

export interface GroupedMessage {
  text: string;
  timestamps: Date[];
  latestTimestamp: Date;
}

export interface ChatStoreState {
  messages: ChatMessage[];
  isInitialized: boolean;
}

export interface SearchResult {
  messages: ChatMessage[];
  query: string;
  total_count: number;
  has_more: boolean;
}

export interface PaginatedResult {
  messages: ChatMessage[];
  total_count: number;
  has_more: boolean;
  page: number;
  page_size: number;
}
