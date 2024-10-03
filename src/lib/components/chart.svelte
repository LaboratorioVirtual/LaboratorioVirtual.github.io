<script lang="ts">
	import { Chart, Axis, Spline, Tooltip, Highlight, Svg } from 'layerchart';

	import { scaleTime } from 'd3-scale';

	import { formatTime, processData } from '$lib';
	import { Label } from './ui/label';
	import { Switch } from './ui/switch';

	interface Props {
		data: Array<RawData>;
	}

	const { data = $bindable() }: Props = $props();

	const processed_data = processData(data);

	let data_that_changes = $state(processed_data);

	const colors = ['#01befe', '#ffdd00', '#adff02', '#ff006d', '#8f00ff', '#ff7d00'];
	const keys = Object.keys(data[0].data);
	const sensores = new Set(data.map((d) => d.id_sensor));
	const yAccessor = Object.keys(processed_data[0]).filter((key) => key !== 'timestamp');

	const switches: Record<string, boolean> = $state({});
	for (const sensor of sensores) {
		for (const key of keys) {
			switches[`${sensor}+${key}`] = true;
		}
	}

	function filterData(e: MouseEvent) {
		const target = e.target as HTMLButtonElement;
		switches[target.id] = !switches[target.id];
	}

	$effect(() => {
		data_that_changes = processed_data.map((item) => {
			const filteredItem: Data = { timestamp: item.timestamp };

			for (const key in item) {
				if (key !== 'timestamp' && switches[key]) {
					filteredItem[key] = item[key];
				}
			}

			return filteredItem;
		});
	});
</script>

<div class="flex flex-col gap-4 md:flex-row md:justify-around md:gap-0">
	{#each sensores as sensor, sensor_idx}
		<div class="flex flex-col items-center gap-2">
			<p class="text-lg font-bold">Sensor {sensor_idx + 1}</p>
			<div class="grid gap-1">
				{#each keys as key}
					<div class="grid grid-cols-[auto_max-content] items-center gap-4">
						<Label class="justify-self-end">{key}</Label>
						<Switch
							id={sensor + '+' + key}
							checked={switches[`${sensor}+${key}`]}
							onclick={filterData}
						/>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<div class="h-96 p-4 lg:h-[500px]">
	<Chart
		data={data_that_changes}
		x="timestamp"
		xScale={scaleTime()}
		y={yAccessor}
		yNice={5}
		tooltip={{ mode: 'bisect-x' }}
		padding={{ bottom: 32, left: 32 }}
		xPadding={[10, 0]}
	>
		<Svg>
			{#each sensores as sensor, sensor_idx}
				{#each keys as key, key_idx}
					<Spline
						y={(d) => d[`${sensor}+${key}`]}
						draw
						class="stroke-2"
						stroke={colors[sensor_idx * keys.length + key_idx]}
					/>
				{/each}
			{/each}

			<Axis
				placement="bottom"
				label="Horário"
				labelProps={{ class: 'lg:text-lg font-bold fill-foreground' }}
				rule={{ class: 'stroke-foreground' }}
				tickLabelProps={{
					class: 'fill-foreground text-sm font-bold'
				}}
				format={(d) => formatTime(d)}
			/>
			<Axis
				placement="left"
				label="Valor"
				labelProps={{ class: 'lg:text-lg font-bold fill-foreground' }}
				grid={{ class: 'stroke-foreground/20' }}
				rule={{ class: 'stroke-foreground' }}
				tickLabelProps={{
					class: 'fill-foreground text-sm font-bold'
				}}
			/>

			<Highlight lines />
			{#each sensores as sensor, sensor_idx}
				{#each keys as key, key_idx}
					<Highlight
						y={(d) => d[`${sensor}+${key}`]}
						points={{
							fill: colors[sensor_idx * keys.length + key_idx]
						}}
					/>
				{/each}
			{/each}
		</Svg>

		<Tooltip.Root
			let:data
			class="border-2 border-primary bg-background"
		>
			<Tooltip.Header class="text-base">{formatTime(data.timestamp)}</Tooltip.Header>
			<Tooltip.List class="block space-y-2">
				{#each sensores as sensor, sensor_idx}
					<div>
						<p class="text-base font-bold">Sensor {sensor_idx + 1}</p>
						<div class="grid grid-cols-[auto_min-content] gap-x-1">
							{#each keys as key, key_idx}
								{#if switches[`${sensor}+${key}`]}
									<p>{key}:</p>
									<div class="flex items-center gap-1 justify-self-end">
										<p class="font-bold">{data[`${sensor}+${key}`]}</p>
										<div
											class="size-4 rounded-full"
											style="background-color: {colors[sensor_idx * keys.length + key_idx]}"
										></div>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</Tooltip.List>
		</Tooltip.Root>
	</Chart>
</div>
