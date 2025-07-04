<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Send, MessageSquare, Search } from 'lucide-svelte';

  interface Props {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    isSending?: boolean;
    onSearchQueryChange?: (query: string) => void;
    autofillMessage?: string;
  }

  let { onSendMessage, disabled = false, isSending = false, onSearchQueryChange, autofillMessage }: Props = $props();

  let chatMessage = $state('');
  const maxLength = 144;

  // Handle autofill message
  $effect(() => {
    if (autofillMessage !== undefined) {
      chatMessage = autofillMessage.slice(0, maxLength);
    }
  });

  // Update search query when input changes
  $effect(() => {
    if (onSearchQueryChange) {
      onSearchQueryChange(chatMessage);
    }
  });

  function handleSend() {
    // Allow sending empty messages
    onSendMessage(chatMessage);
    chatMessage = '';
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (target.value.length > maxLength) {
      target.value = target.value.slice(0, maxLength);
      chatMessage = target.value;
    }
  }
</script>

<Card class="shrink-0 w-full">
  <CardContent class="space-y-4">
    <div class="space-y-2">
      <div class="relative w-full">
        <Textarea
          id="message"
          bind:value={chatMessage}
          onkeydown={handleKeydown}
          oninput={handleInput}
          placeholder="VRChatに送信するメッセージを入力してください..."
          rows={4}
          class="resize-none pr-14 w-full focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 h-20"
          maxlength={maxLength}
          {disabled}
        />
        <div class="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
          {chatMessage.length}/{maxLength}
        </div>
        <!-- <Button
          onclick={handleSend}
          disabled={!chatMessage.trim() || disabled || isSending}
          size="sm"
          class="absolute bottom-2 right-2 h-10 w-10 rounded-full p-0 transition-all duration-300 ease-out"
          style="opacity: {chatMessage.trim() ? 1 : 0}; transform: scale({chatMessage.trim() ? 1 : 0.8}); pointer-events: {chatMessage.trim() ? 'auto' : 'none'}; background-color: {isSending ? '#94a3b8' : '#93ca76'};"
        >
          {#if isSending}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {:else}
            <Send class="w-4 h-4" />
          {/if}
        </Button> -->
      </div>
      <p class="text-sm text-gray-500">
        {#if isSending}
          送信中...
        {:else if chatMessage.trim()}
          <span class="flex items-center gap-1">
            <Search class="w-3 h-3" />
            履歴を検索中 | Shift + Enterで改行、Enterで送信
          </span>
        {:else}
          Shift + Enterで改行、Enterで送信
        {/if}
      </p>
    </div>
  </CardContent>
</Card>
