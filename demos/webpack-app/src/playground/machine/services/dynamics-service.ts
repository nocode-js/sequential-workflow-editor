import {
	Dynamic,
	NullableAnyVariable,
	NullableVariable,
	booleanValueModelId,
	nullableAnyVariableValueModelId,
	nullableVariableValueModelId,
	numberValueModelId,
	stringValueModelId
} from 'sequential-workflow-editor-model';
import { VariablesService } from './variables-service';

export class DynamicsService {
	public constructor(private readonly $variables: VariablesService) {}

	public readAny<TValue>(dynamic: Dynamic<unknown>): TValue {
		switch (dynamic.modelId) {
			case stringValueModelId:
			case numberValueModelId:
			case booleanValueModelId:
				return dynamic.value as TValue;
			case nullableVariableValueModelId:
			case nullableAnyVariableValueModelId: {
				const variable = dynamic.value as NullableVariable | NullableAnyVariable;
				if (!variable || !variable.name) {
					throw new Error('Variable is not set');
				}
				return this.$variables.read<TValue>(variable.name);
			}
		}
		throw new Error(`Dynamic model is not supported: ${dynamic.modelId}`);
	}

	public readString(dynamic: Dynamic<string | NullableVariable>): string {
		const value = this.readAny<string>(dynamic);
		if (typeof value !== 'string') {
			throw new Error('Value is not a string');
		}
		return value;
	}

	public readNumber(dynamic: Dynamic<number | NullableVariable>): number {
		const value = this.readAny<number>(dynamic);
		if (typeof value !== 'number') {
			throw new Error('Value is not a number');
		}
		return value;
	}
}
