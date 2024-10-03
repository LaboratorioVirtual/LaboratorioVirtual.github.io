<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		CalendarDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';

	interface Props {
		value: DateValue | undefined;
	}

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'long'
	});

	let { value = $bindable() }: Props = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		asChild
		let:builder
	>
		<Button
			variant="outline"
			class={cn('w-[280px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate('America/Sao_Paulo')) : 'Selecione uma data'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar
			bind:value
			initialFocus
			locale="pt-BR"
			fixedWeeks
			minValue={new CalendarDate(2022, 2, 11)}
			maxValue={new CalendarDate(2022, 10, 5)}
			placeholder={new CalendarDate(2022, 10, 5)}
		/>
	</Popover.Content>
</Popover.Root>
