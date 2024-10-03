<script>
	import '../app.css';

	import { page } from '$app/stores';

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<header class="flex justify-center py-3">
	<nav class="flex gap-8">
		<div>
			<a
				href="/"
				class="p-2 text-lg font-bold">Início</a
			>
			{#if $page.url.pathname === '/'}
				<hr
					class="border-2 border-primary"
					style="view-transition-name: page-indicator;"
				/>
			{/if}
		</div>
		<div>
			<a
				href="/dados"
				class="p-2 text-lg font-bold">Dados</a
			>
			{#if $page.url.pathname === '/dados'}
				<hr
					class="border-2 border-primary"
					style="view-transition-name: page-indicator;"
				/>
			{/if}
		</div>
	</nav>
</header>

<main class="mx-auto flex max-w-7xl flex-col gap-8 p-4 lg:gap-16">
	{@render children()}
</main>
