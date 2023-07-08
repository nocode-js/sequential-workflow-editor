export interface VariableDefinitions {
	variables: VariableDefinition[];
}

export interface VariableDefinition {
	name: string;
	type: ValueType;
}

export type NullableVariableDefinition = VariableDefinition | null;

export interface Variable {
	name: string;
}

export type NullableVariable = Variable | null;

export interface AnyVariable {
	name: string;
	type: ValueType;
}

export type NullableAnyVariable = AnyVariable | null;

export interface AnyVariables {
	variables: AnyVariable[];
}

export enum WellKnownValueType {
	string = 'string',
	number = 'number',
	boolean = 'boolean'
}

export type ValueType = WellKnownValueType | string;

export interface Dynamic<TValue> {
	modelId: ValueModelId;
	value: TValue;
}

export type ValueModelId = string;

export interface StringDictionary {
	items: StringDictionaryItem[];
}
export interface StringDictionaryItem {
	key: string;
	value: string;
}
