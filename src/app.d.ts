// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type RawData = {
		id_sensor: string;
		data: SensorData;
		timestamp: string;
	};

	type SensorData = {
		[key: string]: number;
	};

	type Data = {
		timestamp: Date;
		[key: string]: number | Date;
	};
}

export {};
