<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initTheme, watchSystemTheme } from '$lib/stores/ThemeStore';
	
	let { children } = $props();
	
	// Initialize theme on component mount
	onMount(() => {
		// Initialize theme based on system preference
		initTheme();
		
		// Watch for system theme changes
		const cleanup = watchSystemTheme();
		
		// Cleanup when component is destroyed
		return cleanup;
	});
</script>

{@render children()}
