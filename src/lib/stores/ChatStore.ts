import { Store } from '@tauri-apps/plugin-store';
import type { ChatMessage } from '$lib/types/chat';
import { sendOscMessage } from '$lib/utils/osc';

export { type ChatMessage } from '$lib/types/chat';

export class ChatStore {
  private store: Store | null = null;
  private readonly STORAGE_KEY = 'chat_history';
  private readonly STORE_FILE = 'chat_history.json';
  
  public isInitialized = false;
  public messages: ChatMessage[] = [];
  public isSending = false;
  
  // Callbacks for reactive updates
  private updateCallbacks: (() => void)[] = [];
  
  private notifyUpdate() {
    this.updateCallbacks.forEach(callback => callback());
  }
  
  public subscribe(callback: () => void) {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  async initialize() {
    try {
      this.store = await Store.load(this.STORE_FILE, { 
        autoSave: true,
        defaults: {}
      });
      this.isInitialized = true;
      await this.loadHistory();
      this.notifyUpdate();
      console.log('ChatStore initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ChatStore:', error);
      this.isInitialized = false;
      this.notifyUpdate();
    }
  }

  async loadHistory() {
    if (!this.store || !this.isInitialized) return;
    
    try {
      const savedHistory = await this.store.get<any[]>(this.STORAGE_KEY);
      if (savedHistory && Array.isArray(savedHistory)) {
        this.messages = savedHistory.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        this.notifyUpdate();
        console.log(`Loaded ${this.messages.length} messages from storage`);
      } else {
        console.log('No saved history found');
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }

  async saveHistory() {
    if (!this.store || !this.isInitialized) {
      console.warn('Store not initialized, skipping save');
      return;
    }
    
    try {
      await this.store.set(this.STORAGE_KEY, this.messages);
      await this.store.save();
      console.log(`Saved ${this.messages.length} messages to storage`);
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  async addMessage(text: string) {
    if (!this.isInitialized) return;
    
    this.isSending = true;
    this.notifyUpdate();
    
    const isEmptyMessage = !text.trim();
    
    // Only add to history if message is not empty
    if (!isEmptyMessage) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        text: text.trim(),
        timestamp: new Date(),
        status: 'sent' // Always mark as sent since UDP doesn't guarantee delivery
      };
      
      this.messages = [newMessage, ...this.messages];
      this.notifyUpdate();
    }
    
    try {
      // Send message via OSC to VRChat (send original text, including empty strings)
      console.log(`[OSC] Sending message to VRChat: "${text}"`);
      await sendOscMessage(text);
      console.log(`[OSC] Message sent to VRChat: "${text}"`);
      
      // Save to storage only if message was added to history
      if (!isEmptyMessage) {
        await this.saveHistory();
        console.log(`Message processed and saved: "${text}"`);
      } else {
        console.log(`Empty message sent to VRChat but not saved to history`);
      }
    } catch (error) {
      console.error('Failed to send OSC message:', error);
    } finally {
      this.isSending = false;
      this.notifyUpdate();
    }
  }

  async clearHistory() {
    this.messages = [];
    this.notifyUpdate();
    try {
      await this.saveHistory();
      console.log('Chat history cleared');
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  async deleteMessage(messageText: string) {
    this.messages = this.messages.filter(msg => msg.text !== messageText);
    this.notifyUpdate();
    try {
      await this.saveHistory();
      console.log(`Message deleted: "${messageText}"`);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }

  async handleBeforeUnload() {
    if (this.store && this.isInitialized) {
      try {
        await this.saveHistory();
        console.log('Data saved before window close');
      } catch (error) {
        console.error('Failed to save data before window close:', error);
      }
    }
  }
}
