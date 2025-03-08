import { Properties } from 'sequential-workflow-model';
import { ContextVariable } from '../model';
import { ParentsProvider } from './variables-provider';
import { PropertyContext } from './property-context';
import { ValueType } from '../types';
import { I18n } from '../i18n';

export class ScopedPropertyContext<TProperties extends Properties> {
	public static create<TProps extends Properties>(
		propertyContext: PropertyContext<TProps>,
		parentsProvider: ParentsProvider,
		i18n: I18n
	): ScopedPropertyContext<TProps> {
		return new ScopedPropertyContext<TProps>(propertyContext, i18n, parentsProvider);
	}

	private constructor(
		public readonly propertyContext: PropertyContext<TProperties>,
		public readonly i18n: I18n,
		private readonly parentsProvider: ParentsProvider
	) {}

	public readonly tryGetStepType = this.propertyContext.tryGetStepType;
	public readonly getPropertyValue = this.propertyContext.getPropertyValue;
	public readonly formatPropertyValue = this.propertyContext.formatPropertyValue;
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

	public readonly tryGetVariableType = (variableName: string): ValueType | null => {
		const variable = this.getVariables().find(v => v.name === variableName);
		return variable ? variable.type : null;
	};

	public readonly getVariables = (): ContextVariable[] => {
		return this.parentsProvider.getVariables();
	};
}
