import { MyDefinition } from './model/definition-model';
import { RawInputData } from './playground';

const version = 3;
const definitionKey = `definition_${version}`;
const inputDataKey = `inputData_${version}`;

export interface AppState {
	definition: MyDefinition;
	inputData: RawInputData;
}

export class AppStorage {
	public static tryGet(): AppState | null {
		const definition = localStorage[definitionKey];
		const inputData = localStorage[inputDataKey];
		if (definition && inputData) {
			return {
				definition: JSON.parse(definition),
				inputData: JSON.parse(inputData)
			};
		}
		return null;
	}

	public static set(definition: MyDefinition, inputData: RawInputData) {
		localStorage[definitionKey] = JSON.stringify(definition);
		localStorage[inputDataKey] = JSON.stringify(inputData);
	}
}
