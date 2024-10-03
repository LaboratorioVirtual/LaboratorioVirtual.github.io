<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import DatePicker from '$lib/components/date-picker.svelte';
	import Chart from '$lib/components/chart.svelte';

	import type { DateValue } from '@internationalized/date';

	let data: Array<RawData> | undefined = $state();

	let value: DateValue | undefined = $state(undefined);

	let loading = $state(false);

	async function fetchData() {
		if (!value) throw new Error('Value is undefined');

		loading = true;

		const response = await fetch(`https://labvirtual-api.vercel.app/?date=${value}`);

		if (!response.ok) {
			loading = false;
			throw new Error('Failed to fetch data');
		}

		data = await response.json();
		loading = false;
	}
</script>

<div class="flex justify-center gap-7">
	<DatePicker bind:value />
	<Button onclick={fetchData}>Gráfico</Button>
</div>

{#if loading}
	<div class="flex flex-col items-center">
		<img
			src="/loading.svg"
			alt="Loading..."
			width="800"
		/>
	</div>
{:else if data}
	<Chart bind:data />
{:else}
	<p class="text-center text-4xl">Selecione uma data</p>
{/if}
