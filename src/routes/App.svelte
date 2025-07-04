<script lang="ts">
  import { onMount } from 'svelte';
  import TitleBar from '$lib/components/TitleBar.svelte';
  import MessageInput from '$lib/components/MessageInput.svelte';
  import MessageHistory from '$lib/components/MessageHistory.svelte';
  import { ChatStore } from '$lib/stores/ChatStore';

  // Initialize chat store
  const chatStore = new ChatStore();
  
  // Reactive state for UI updates
  let isInitialized = $state(false);
  let messages = $state(chatStore.messages);
  let isSending = $state(false);
  let searchQuery = $state('');
  let autofillMessage = $state<string | undefined>(undefined);
  
  // Subscribe to store updates
  let unsubscribe: (() => void) | null = null;

  // Initialize store and setup auto-save on component mount
  onMount(() => {
    // Subscribe to store updates
    unsubscribe = chatStore.subscribe(() => {
      isInitialized = chatStore.isInitialized;
      messages = [...chatStore.messages]; // Create new array reference for reactivity
      isSending = chatStore.isSending;
    });

    chatStore.initialize();

    // Save data before window closes
    const handleBeforeUnload = () => {
      chatStore.handleBeforeUnload();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(async () => {
      if (chatStore.isInitialized && chatStore.messages.length > 0) {
        try {
          await chatStore.saveHistory();
          console.log('Auto-save completed');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, 30000);
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(autoSaveInterval);
      if (unsubscribe) unsubscribe();
    };
  });

  // Handle message sending
  function handleSendMessage(message: string) {
    chatStore.addMessage(message);
  }

  // Handle clearing history
  function handleClearHistory() {
    chatStore.clearHistory();
  }

  // Handle deleting a single message
  function handleDeleteMessage(messageText: string) {
    chatStore.deleteMessage(messageText);
  }

  // Handle search query change
  function handleSearchQueryChange(query: string) {
    searchQuery = query;
  }

  // Handle message click for autofill
  function handleMessageClick(messageText: string) {
    autofillMessage = messageText;
    // Reset autofill after a brief moment to allow the effect to trigger
    setTimeout(() => {
      autofillMessage = undefined;
    }, 100);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
  <!-- Custom title bar -->
  <TitleBar />
  
  <!-- Main content -->
  <div class="p-4 flex flex-col" style="height: calc(100vh - 40px);">
    <div class="w-full max-w-2xl mx-auto flex-1 flex flex-col space-y-6">
      <!-- Message input component -->
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={!isInitialized}
        isSending={isSending}
        onSearchQueryChange={handleSearchQueryChange}
        autofillMessage={autofillMessage}
      />

      <!-- Message history component -->
      <MessageHistory 
        messages={messages} 
        onClearHistory={handleClearHistory}
        onDeleteMessage={handleDeleteMessage}
        searchQuery={searchQuery}
        onMessageClick={handleMessageClick}
      />
    </div>
  </div>
</div>
