import { Properties, PropertyValue } from 'sequential-workflow-model';
import { ValueModel } from '../model';
import { ValueContext } from '../context';

export class PropertyValidatorContext<TValue extends PropertyValue = PropertyValue, TProperties extends Properties = Properties> {
	public static create<TVal extends PropertyValue, TProps extends Properties>(
		valueContext: ValueContext<ValueModel, TProps>
	): PropertyValidatorContext<TVal, TProps> {
		return new PropertyValidatorContext<TVal, TProps>(valueContext);
	}

	protected constructor(private readonly valueContext: ValueContext<ValueModel, TProperties>) {}

	public readonly getPropertyValue = this.valueContext.getPropertyValue;
	public readonly formatPropertyValue = this.valueContext.formatPropertyValue;
	public readonly getSupportedValueTypes = this.valueContext.getValueTypes;
	public readonly hasVariable = this.valueContext.hasVariable;
	public readonly findFirstUndefinedVariable = this.valueContext.findFirstUndefinedVariable;
	public readonly isVariableDuplicated = this.valueContext.isVariableDuplicated;
	public readonly tryGetVariableType = this.valueContext.tryGetVariableType;
	public readonly getVariables = this.valueContext.getVariables;

	public getValue(): TValue {
		return this.valueContext.getValue() as TValue;
	}
}
