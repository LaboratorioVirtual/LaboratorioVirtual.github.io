<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

	interface Props {
		items: Array<{
			id: string;
			label: string;
			checked: boolean;
		}>;

		onchange: (value: boolean) => void;
	}

	let { items, onchange }: Props = $props();
</script>

<div class="grid grid-cols-[max-content__min-content] items-center gap-2">
	{#each items as { id, label, checked }}
		<Label
			for={id}
			class="justify-self-end">{label}</Label
		>
		<Switch
			{id}
			{checked}
			onCheckedChange={onchange}
		/>
	{/each}
</div>
