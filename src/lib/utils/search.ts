import { invoke } from '@tauri-apps/api/core';
import type { ChatMessage, SearchResult, PaginatedResult } from '$lib/types/chat';

export async function searchMessages(
  messages: ChatMessage[], 
  query: string, 
  page: number = 0, 
  pageSize: number = 50
): Promise<SearchResult> {
  try {
    // Convert ChatMessage to the format expected by Rust
    const rustMessages = messages.map(msg => ({
      text: msg.text,
      timestamp: msg.timestamp.toISOString()
    }));

    const result = await invoke<{
      messages: {text: string, timestamp: string}[], 
      query: string,
      total_count: number,
      has_more: boolean
    }>('search_messages', {
      messages: rustMessages,
      query: query,
      page: page,
      page_size: pageSize
    });

    // Convert timestamp strings back to Date objects and preserve full ChatMessage structure
    const convertedMessages: ChatMessage[] = result.messages.map((rustMsg, index) => {
      // Find the original message to preserve id and status
      const originalMsg = messages.find(msg => 
        msg.text === rustMsg.text && 
        msg.timestamp.toISOString() === rustMsg.timestamp
      );
      
      return originalMsg || {
        id: Date.now() + index, // Generate a temporary ID if not found
        text: rustMsg.text,
        timestamp: new Date(rustMsg.timestamp),
        status: 'sent' as const
      };
    });

    return {
      messages: convertedMessages,
      query: result.query,
      total_count: result.total_count,
      has_more: result.has_more
    };
  } catch (error) {
    console.error('Search failed:', error);
    // Fallback to simple client-side filtering
    const lowerQuery = query.toLowerCase();
    const filteredMessages = query.trim() 
      ? messages.filter(msg => msg.text.toLowerCase().includes(lowerQuery))
      : messages;
    
    // Apply pagination to fallback results
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedMessages = filteredMessages.slice(start, end);
    
    return {
      messages: paginatedMessages,
      query,
      total_count: filteredMessages.length,
      has_more: end < filteredMessages.length
    };
  }
}

export async function getMessagesPaginated(
  messages: ChatMessage[], 
  page: number, 
  pageSize: number
): Promise<PaginatedResult> {
  try {
    // Convert ChatMessage to the format expected by Rust
    const rustMessages = messages.map(msg => ({
      text: msg.text,
      timestamp: msg.timestamp.toISOString()
    }));

    const result = await invoke<{
      messages: {text: string, timestamp: string}[],
      total_count: number,
      has_more: boolean,
      page: number,
      page_size: number
    }>('get_messages_paginated', {
      messages: rustMessages,
      page: page,
      page_size: pageSize
    });

    // Convert timestamp strings back to Date objects
    const convertedMessages: ChatMessage[] = result.messages.map((rustMsg, index) => {
      const originalMsg = messages.find(msg => 
        msg.text === rustMsg.text && 
        msg.timestamp.toISOString() === rustMsg.timestamp
      );
      
      return originalMsg || {
        id: Date.now() + index,
        text: rustMsg.text,
        timestamp: new Date(rustMsg.timestamp),
        status: 'sent' as const
      };
    });

    return {
      messages: convertedMessages,
      total_count: result.total_count,
      has_more: result.has_more,
      page: result.page,
      page_size: result.page_size
    };
  } catch (error) {
    console.error('Pagination failed:', error);
    // Fallback to simple client-side pagination
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedMessages = messages.slice(start, end);
    
    return {
      messages: paginatedMessages,
      total_count: messages.length,
      has_more: end < messages.length,
      page,
      page_size: pageSize
    };
  }
}
