<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Trash2, Clock, X } from 'lucide-svelte';
  import type { ChatMessage, GroupedMessage } from '$lib/types/chat';

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

  function filterMessages(messages: GroupedMessage[], query: string): GroupedMessage[] {
    if (!query.trim()) {
      return messages;
    }
    
    const lowerQuery = query.toLowerCase();
    return messages.filter(message => 
      message.text.toLowerCase().includes(lowerQuery)
    );
  }

  function handleMessageClick(messageText: string) {
    if (onMessageClick) {
      onMessageClick(messageText);
    }
  }

  const groupedMessages = $derived(groupMessages(messages));
  const filteredMessages = $derived(filterMessages(groupedMessages, searchQuery));
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
    <ScrollArea class="h-full w-full">
      {#if filteredMessages.length === 0}
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
          {#each filteredMessages as message}
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
        </div>
      {/if}
    </ScrollArea>
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
