import { SimpleEvent, WellKnownValueType, ValueType, VariableDefinition, VariableDefinitions } from 'sequential-workflow-editor-model';
import { MyDefinition } from './model/definition-model';
import { VariableState } from './machine/services/variables-service';

export type RawInputData = Record<string, string>;

export class Playground {
	public static create(inputData: RawInputData) {
		const logs = document.getElementById('logs') as HTMLElement;
		const inputList = document.getElementById('inputs') as HTMLElement;
		const outputList = document.getElementById('outputs') as HTMLElement;
		return new Playground(logs, inputData, inputList, outputList);
	}

	private inputVariables?: VariableDefinition[];
	private readonly outputData: RawInputData = {};
	private outputFields: Record<string, HTMLInputElement> = {};
	public readonly onInputChanged = new SimpleEvent<void>();

	private constructor(
		private readonly logs: HTMLElement,
		private readonly inputData: RawInputData,
		private readonly inputList: HTMLElement,
		private readonly outputList: HTMLElement
	) {
		// nothing
	}

	public updateVariables(definition: MyDefinition) {
		this.reloadFields(this.inputList, definition.properties.inputs, this.inputData);
		this.inputVariables = definition.properties.inputs.variables;
		this.outputFields = this.reloadFields(this.outputList, definition.properties.outputs, null);
	}

	public readInputData(): RawInputData {
		return this.inputData;
	}

	public readInputVariableState(): VariableState {
		if (!this.inputVariables) {
			throw new Error('Input variables not set');
		}

		return this.inputVariables.reduce<VariableState>((values, definition) => {
			const input = this.inputData[definition.name] || '';
			values[definition.name] = convertInputValue(input, definition.type);
			return values;
		}, {});
	}

	public setOutputVariable(name: string, value: unknown) {
		let str: string;
		if (typeof value === 'string') {
			str = value;
		} else {
			str = JSON.stringify(value);
		}

		this.outputData[name] = str;
		const field = this.outputFields[name];
		if (field) {
			field.value = str;
		}
	}

	public clearLogs() {
		this.logs.innerHTML = '';
	}

	public log(message: string, level: 'info' | 'trace' = 'info') {
		const log = document.createElement('div');
		log.className = `log log-${level}`;
		for (const line of message.split('\n')) {
			const item = document.createElement('div');
			item.innerText = line;
			log.appendChild(item);
		}
		this.logs.appendChild(log);
		this.logs.scrollTop = this.logs.scrollHeight;
	}

	private reloadFields(
		list: HTMLElement,
		definitions: VariableDefinitions,
		data: Record<string, string> | null
	): Record<string, HTMLInputElement> {
		const fields: Record<string, HTMLInputElement> = {};
		list.innerHTML = '';

		for (const definition of definitions.variables) {
			if (!definition.name) {
				continue;
			}
			const row = document.createElement('div');
			row.className = 'variable-row';
			const label = document.createElement('label');
			label.innerText = definition.name;
			const input = document.createElement('input');
			input.type = 'text';
			if (data) {
				input.value = data[definition.name] || '';
				input.addEventListener('blur', () => {
					data[definition.name] = input.value;
					this.onInputChanged.forward();
				});
			} else {
				input.setAttribute('readonly', 'readonly');
			}
			row.appendChild(label);
			row.appendChild(input);
			list.appendChild(row);
			fields[definition.name] = input;
		}
		return fields;
	}
}

function convertInputValue(text: string, type: ValueType): unknown {
	switch (type) {
		case WellKnownValueType.string:
			return text;
		case WellKnownValueType.number: {
			const value = parseFloat(text);
			if (isNaN(value)) {
				throw new Error(`Invalid input number value: ${text || '<empty>'}`);
			}
			return value;
		}
		default:
			throw new Error(`Unknown variable type: ${type}`);
	}
}
