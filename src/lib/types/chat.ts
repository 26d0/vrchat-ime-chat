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
