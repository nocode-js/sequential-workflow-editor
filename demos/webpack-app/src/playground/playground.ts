import { SimpleEvent, ValueKnownType, ValueType, VariableDefinition, VariableDefinitions } from 'sequential-workflow-editor-model';
import { MyDefinition } from './model/definition-model';
import { VariableState } from './machine/services/variables-service';

export class Playground {
	public static create() {
		const logs = document.getElementById('logs') as HTMLTextAreaElement;
		const inputList = document.getElementById('inputs') as HTMLElement;
		const outputList = document.getElementById('outputs') as HTMLElement;
		return new Playground(logs, inputList, outputList);
	}

	private readonly inputData: Record<string, string> = {};
	private inputVariables?: VariableDefinition[];
	private readonly outputData: Record<string, string> = {};
	private outputFields: Record<string, HTMLInputElement> = {};
	public readonly onInputChanged = new SimpleEvent<void>();

	private constructor(
		private readonly logs: HTMLTextAreaElement,
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

	public readInputVariables(): VariableState {
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
		this.logs.value = '';
	}

	public log(message: string) {
		this.logs.value = `${message}\n` + this.logs.value;
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
		case ValueKnownType.string:
			return text;
		case ValueKnownType.number: {
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
