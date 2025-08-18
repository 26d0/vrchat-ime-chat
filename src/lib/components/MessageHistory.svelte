<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Trash2, Clock, X, MoreHorizontal } from 'lucide-svelte';
  import type { ChatMessage, GroupedMessage, SearchResult } from '$lib/types/chat';
  import { searchMessages, getMessagesPaginated } from '$lib/utils/search';

  interface Props {
    messages: ChatMessage[];
    onClearHistory: () => void;
    onDeleteMessage?: (messageText: string) => void;
    searchQuery?: string;
    onMessageClick?: (messageText: string) => void;
  }

  let { messages, onClearHistory, onDeleteMessage, searchQuery = '', onMessageClick }: Props = $props();
  let tooltipVisible = $state(false);
  let tooltipContent = $state<Date[]>([]);
  let tooltipPosition = $state({ x: 0, y: 0 });
  let tooltipTarget = $state<HTMLElement | null>(null);
  let isSearching = $state(false);
  let isLoadingMore = $state(false);
  let displayedMessages = $state<ChatMessage[]>([]);
  let hasMore = $state(true);
  let currentPage = $state(0);
  let totalCount = $state(0);
  let lastSearchQuery = $state('');
  
  const PAGE_SIZE = 50;

  function formatDate(date: Date) {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function groupMessages(messages: ChatMessage[]): GroupedMessage[] {
    const grouped = new Map<string, GroupedMessage>();
    
    messages.forEach(message => {
      const existing = grouped.get(message.text);
      if (existing) {
        existing.timestamps.push(message.timestamp);
        if (message.timestamp > existing.latestTimestamp) {
          existing.latestTimestamp = message.timestamp;
        }
      } else {
        grouped.set(message.text, {
          text: message.text,
          timestamps: [message.timestamp],
          latestTimestamp: message.timestamp
        });
      }
    });

    return Array.from(grouped.values()).sort((a, b) => 
      b.latestTimestamp.getTime() - a.latestTimestamp.getTime()
    );
  }

  function showTooltip(event: MouseEvent, timestamps: Date[]) {
    if (timestamps.length <= 1) return;
    
    tooltipContent = timestamps.sort((a, b) => b.getTime() - a.getTime());
    
    // Calculate tooltip position with bounds checking
    const tooltipWidth = 300; // estimated max width
    const tooltipHeight = 150; // estimated max height
    const padding = 10;
    
    let x = event.clientX + padding;
    let y = event.clientY - padding;
    
    // Adjust horizontal position if tooltip would go off screen
    if (x + tooltipWidth > window.innerWidth) {
      x = event.clientX - tooltipWidth - padding;
    }
    
    // Adjust vertical position if tooltip would go off screen
    if (y + tooltipHeight > window.innerHeight) {
      y = event.clientY - tooltipHeight - padding;
    }
    
    // Ensure tooltip doesn't go off the left or top edge
    if (x < padding) {
      x = padding;
    }
    if (y < padding) {
      y = event.clientY + padding;
    }
    
    tooltipPosition = { x, y };
    tooltipVisible = true;
    tooltipTarget = event.target as HTMLElement;
  }

  function hideTooltip() {
    tooltipVisible = false;
    tooltipTarget = null;
  }

  // Load initial messages or search results
  async function loadMessages(query: string = '', page: number = 0, append: boolean = false): Promise<void> {
    if (page === 0) {
      isSearching = true;
    } else {
      isLoadingMore = true;
    }
    
    try {
      let result: SearchResult;
      
      if (query.trim()) {
        result = await searchMessages(messages, query, page, PAGE_SIZE);
      } else {
        const paginatedResult = await getMessagesPaginated(messages, page, PAGE_SIZE);
        result = {
          messages: paginatedResult.messages,
          query: '',
          total_count: paginatedResult.total_count,
          has_more: paginatedResult.has_more
        };
      }
      
      if (append && page > 0) {
        displayedMessages = [...displayedMessages, ...result.messages];
      } else {
        displayedMessages = result.messages;
      }
      
      hasMore = result.has_more;
      totalCount = result.total_count;
      
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      isSearching = false;
      isLoadingMore = false;
    }
  }

  // Load more messages when scrolling to bottom
  async function loadMoreMessages(): Promise<void> {
    if (isLoadingMore || !hasMore) return;
    
    currentPage += 1;
    await loadMessages(searchQuery, currentPage, true);
  }

  // Handle scroll events for infinite scrolling
  function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    // Load more when user scrolls near the bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMoreMessages();
    }
  }

  // Reset pagination when search query changes
  $effect(() => {
    if (searchQuery !== lastSearchQuery) {
      currentPage = 0;
      lastSearchQuery = searchQuery;
      loadMessages(searchQuery, 0, false);
    }
  });

  // Initial load when messages change
  $effect(() => {
    if (messages.length > 0) {
      currentPage = 0;
      loadMessages(searchQuery, 0, false);
    }
  });

  function handleMessageClick(messageText: string) {
    if (onMessageClick) {
      onMessageClick(messageText);
    }
  }

  // Group the displayed messages
  const groupedMessages = $derived(groupMessages(displayedMessages));
</script>

<Card class="h-full flex flex-col">
  <!-- <CardHeader class="shrink-0">
    <div class="flex items-center justify-between">
      <CardTitle class="flex items-center gap-2">
        <Clock class="w-5 h-5" />
        送信履歴
      </CardTitle>
    </div>
  </CardHeader> -->
  <CardContent class="flex-1 min-h-0 p-4">
    <div class="h-full w-full overflow-auto" onscroll={handleScroll}>
      {#if isSearching}
        <div class="h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>検索中...</span>
          </div>
        </div>
      {:else if groupedMessages.length === 0 && !hasMore}
        <div class="h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
          <div>
            {#if searchQuery.trim()}
              <p>「{searchQuery}」に一致するメッセージが見つかりません</p>
              <p class="text-sm">別のキーワードで検索してみてください</p>
            {:else}
              <p>まだメッセージがありません</p>
              <p class="text-sm">メッセージを送信すると履歴が表示されます</p>
            {/if}
          </div>
        </div>
      {:else}
        <div class="space-y-3 pr-4">
          {#each groupedMessages as message}
            <div class="flex items-start gap-2">
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <div 
                class="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-gray-200 dark:border-gray-600 flex-1 min-w-0 cursor-pointer"
                onclick={() => handleMessageClick(message.text)}
                role="button"
                tabindex="0"
                title="クリックして入力欄にコピー"
              >
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm break-words leading-relaxed text-gray-800 dark:text-gray-200 flex-1 min-w-0 overflow-wrap-anywhere">{message.text}</p>
                  <span 
                    class="text-xs text-gray-500 dark:text-gray-400 font-mono shrink-0 ml-2"
                    class:cursor-pointer={message.timestamps.length > 1}
                    role="button"
                    tabindex="0"
                    onmouseenter={(e) => showTooltip(e, message.timestamps)}
                    onmouseleave={hideTooltip}
                    onclick={(e) => e.stopPropagation()}
                  >
                    {formatDate(message.latestTimestamp)}
                  </span>
                </div>
              </div>
              {#if onDeleteMessage}
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  onclick={() => onDeleteMessage?.(message.text)}
                  title="削除"
                >
                  <Trash2 class="w-3 h-3" />
                </Button>
              {/if}
            </div>
          {/each}
          
          <!-- Load more indicator -->
          {#if hasMore}
            <div class="flex justify-center py-4">
              {#if isLoadingMore}
                <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-sm">さらに読み込み中...</span>
                </div>
              {:else}
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={loadMoreMessages}
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <MoreHorizontal class="w-4 h-4 mr-2" />
                  さらに表示 ({totalCount - displayedMessages.length}件)
                </Button>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </CardContent>
</Card>

<!-- Tooltip overlay -->
{#if tooltipVisible}
  <div 
    class="fixed z-50 bg-black/90 text-white p-3 rounded-lg shadow-lg max-w-xs"
    style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px; width: 300px;"
  >
    <div class="text-sm font-medium mb-2">送信履歴</div>
    <div class="space-y-1">
      {#each tooltipContent as timestamp}
        <div class="text-xs font-mono">
          {formatDate(timestamp)}
        </div>
      {/each}
    </div>
    <div class="text-xs text-gray-300 mt-2 pt-2 border-t border-gray-600">
      計 {tooltipContent.length} 回送信
    </div>
  </div>
{/if}
