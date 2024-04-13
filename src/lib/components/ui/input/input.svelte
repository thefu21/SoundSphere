<script>
	import { cn } from "$lib/utils.js";
	let className = undefined;
	export let value = undefined;
	export { className as class };
	export let readonly = undefined;
</script>

<div class="relative w-full">
	<input class={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-3 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
            )}
		   bind:value
		   {readonly}
		   on:blur
		   on:change
		   on:click
		   on:focus
		   on:focusin
		   on:focusout
		   on:keydown
		   on:keypress
		   on:keyup
		   on:mouseover
		   on:mouseenter
		   on:mouseleave
		   on:paste
		   on:input
		   on:wheel
		   {...$$restProps}
	/>
	{#if $$slots.default}
		<div class="absolute inset-y-0 left-0 flex items-center pl-2">
			<slot></slot>
		</div>
	{/if}
</div>

