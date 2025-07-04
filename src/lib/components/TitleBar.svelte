<script lang="ts">
  import { onMount } from 'svelte';
  import { Minus, Square, X } from 'lucide-svelte';
  
  let appWindow: any = null;
  let isDragging = false;
  
  onMount(async () => {
    // Import window controls from Tauri
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    appWindow = getCurrentWindow();
  });
  
  // Window control handlers
  async function minimize() {
    if (appWindow) {
      await appWindow.minimize();
    }
  }
  
  async function maximize() {
    if (appWindow) {
      await appWindow.toggleMaximize();
    }
  }
  
  async function close() {
    if (appWindow) {
      await appWindow.close();
    }
  }
  
  // Drag window functionality
  async function startDrag(event: MouseEvent) {
    if (appWindow && event.button === 0) {
      await appWindow.startDragging();
    }
  }
</script>

<!-- Custom title bar -->
<div class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 h-7 select-none">
  <!-- Draggable area -->
  <div 
    class="flex-1 h-full cursor-default"
    role="button"
    tabindex="0"
    on:mousedown={startDrag}
  >
    <div class="flex items-center h-full px-3">
      <span class="text-md font-medium text-gray-700 dark:text-gray-200 wdxl-lubrifont-jp-n-regular">IME Chat</span>
    </div>
  </div>
  
  <!-- Window controls -->
  <div class="flex">
    <!-- Minimize button -->
    <button
      class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      on:click={minimize}
      title="Minimize"
    >
      <Minus class="w-4 h-4 text-gray-600 dark:text-gray-300" />
    </button>
    
    
    <!-- Close button -->
    <button
      class="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
      on:click={close}
      title="Close"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</div>
