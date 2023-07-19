import { Properties, PropertyValue } from 'sequential-workflow-model';
import { ContextVariable, PropertyModel, ValidationResult, ValueModel } from '../model';
import { Path, SimpleEvent } from '../core';
import { DefinitionContext } from './definition-context';
import { readPropertyValue } from './read-property-value';
import { ValueType } from '../types';

export class ValueContext<TValueModel extends ValueModel = ValueModel, TProperties extends Properties = Properties> {
	public static create<TValueModel extends ValueModel>(
		valueModel: TValueModel,
		propertyModel: PropertyModel,
		definitionContext: DefinitionContext
	): ValueContext<TValueModel> {
		return new ValueContext(valueModel, propertyModel, definitionContext);
	}

	public readonly onValueChanged = new SimpleEvent<Path>();

	private constructor(
		public readonly model: TValueModel,
		private readonly propertyModel: PropertyModel,
		private readonly definitionContext: DefinitionContext
	) {}

	public getValue(): ReturnType<TValueModel['getDefaultValue']> {
		return this.model.path.read<ReturnType<TValueModel['getDefaultValue']>>(this.definitionContext.object);
	}

	public setValue(value: ReturnType<TValueModel['getDefaultValue']>) {
		this.model.path.write(this.definitionContext.object, value);
		this.onValueChanged.forward(this.model.path);
	}

	public validate(): ValidationResult {
		return this.model.validate(this);
	}

	public readonly getPropertyValue = <Key extends keyof TProperties>(name: Key): TProperties[Key] => {
		return readPropertyValue(name, this.propertyModel, this.definitionContext.object);
	};

	public getValueTypes(): ValueType[] {
		return this.definitionContext.definitionModel.valueTypes;
	}

	public hasVariable(name: string, valueType: string): boolean {
		return this.getVariables().some(v => v.name === name && v.type === valueType);
	}

	public isVariableDuplicated(name: string): boolean {
		return this.getVariables().filter(v => v.name === name).length > 1;
	}

	public getVariables(): ContextVariable[] {
		return this.definitionContext.parentsProvider.getVariables();
	}

	public createChildContext<TChildModel extends ValueModel<PropertyValue, object, TProperties>>(
		childModel: TChildModel
	): ValueContext<TChildModel> {
		const context = ValueContext.create(childModel, this.propertyModel, this.definitionContext);
		context.onValueChanged.subscribe(this.onValueChanged.forward);
		return context;
	}
}
