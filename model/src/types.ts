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

export interface AnyVariables {
	variables: AnyVariable[];
}

export enum ValueKnownType {
	string = 'string',
	number = 'number',
	boolean = 'boolean'
}

export type ValueType = ValueKnownType | string;

export interface Dynamic<TValue> {
	modelId: ValueModelId;
	value: TValue;
}

export type ValueModelId = string;
