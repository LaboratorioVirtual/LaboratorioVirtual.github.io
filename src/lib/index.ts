import { parseAbsolute } from '@internationalized/date';

export function processData(data: Array<RawData>) {
	const result: Array<{ [key: string]: number }> = [];
	const groupedResult: Array<{ [key: string]: number }> = [];

	data.forEach((item) => {
		const timestamp = new Date(item.timestamp).getTime();
		const sensorId = item.id_sensor;

		for (const [key, value] of Object.entries(item.data)) {
			result.push({
				timestamp,
				[`${sensorId}+${key}`]: value
			});
		}
	});

	// group by timestamp
	result.forEach((item) => {
		const existing = groupedResult.find((groupedItem) => groupedItem.timestamp === item.timestamp);
		if (existing) {
			Object.assign(existing, item);
		} else {
			groupedResult.push(item);
		}
	});

	// convert timestamp to Date
	return groupedResult.map((item) => {
		const timestampDate = parseAbsolute(
			new Date(item.timestamp).toISOString(),
			'America/Sao_Paulo'
		).toDate();
		return {
			...item,
			timestamp: timestampDate
		};
	}) as Array<Data>;
}

export function formatTime(date: Date) {
	return date.toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit'
	});
}
