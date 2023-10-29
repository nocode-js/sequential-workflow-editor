import { Properties } from 'sequential-workflow-model';
import { ContextVariable } from '../model';
import { ParentsProvider } from './variables-provider';
import { PropertyContext } from './property-context';

export class ScopedPropertyContext<TProperties extends Properties> {
	public static create<TProps extends Properties>(
		propertyContext: PropertyContext<TProps>,
		parentsProvider: ParentsProvider
	): ScopedPropertyContext<TProps> {
		return new ScopedPropertyContext<TProps>(propertyContext, parentsProvider);
	}

	private constructor(public readonly propertyContext: PropertyContext<TProperties>, private readonly parentsProvider: ParentsProvider) {}

	public readonly getPropertyValue = this.propertyContext.getPropertyValue;
	public readonly getValueTypes = this.propertyContext.getValueTypes;

	public readonly hasVariable = (variableName: string, valueType: string | null): boolean => {
		return this.getVariables().some(v => v.name === variableName && (valueType === null || v.type === valueType));
	};

	public readonly findFirstUndefinedVariable = (variableNames: string[]): string | undefined => {
		const variables = new Set(this.getVariables().map(v => v.name));
		return variableNames.find(name => !variables.has(name));
	};

	public readonly isVariableDuplicated = (variableName: string): boolean => {
		return this.getVariables().filter(v => v.name === variableName).length > 1;
	};

	public readonly getVariables = (): ContextVariable[] => {
		return this.parentsProvider.getVariables();
	};
}
