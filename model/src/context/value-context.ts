import { Properties, PropertyValue } from 'sequential-workflow-model';
import { PropertyModel, ValidationResult, ValueModel } from '../model';
import { Path, SimpleEvent } from '../core';
import { ScopedPropertyContext } from './scoped-property-context';
import { PropertyContext } from './property-context';
import { DefinitionContext } from './definition-context';
import { I18n } from '../i18n';

export class ValueContext<TValueModel extends ValueModel = ValueModel, TProperties extends Properties = Properties> {
	public static createFromDefinitionContext<TValModel extends ValueModel, TProps extends Properties = Properties>(
		valueModel: TValModel,
		propertyModel: PropertyModel,
		definitionContext: DefinitionContext,
		i18n: I18n
	) {
		const propertyContext = PropertyContext.create<TProps>(definitionContext.object, propertyModel, definitionContext.definitionModel);
		const scopedPropertyContext = ScopedPropertyContext.create<TProps>(propertyContext, definitionContext.parentsProvider, i18n);
		return new ValueContext<TValModel, TProps>(valueModel, scopedPropertyContext);
	}

	public readonly onValueChanged = new SimpleEvent<Path>();

	private constructor(
		public readonly model: TValueModel,
		public readonly scopedPropertyContext: ScopedPropertyContext<TProperties>
	) {}

	public readonly tryGetStepType = this.scopedPropertyContext.tryGetStepType;
	public readonly getPropertyValue = this.scopedPropertyContext.getPropertyValue;
	public readonly formatPropertyValue = this.scopedPropertyContext.formatPropertyValue;
	public readonly getValueTypes = this.scopedPropertyContext.getValueTypes;
	public readonly hasVariable = this.scopedPropertyContext.hasVariable;
	public readonly findFirstUndefinedVariable = this.scopedPropertyContext.findFirstUndefinedVariable;
	public readonly isVariableDuplicated = this.scopedPropertyContext.isVariableDuplicated;
	public readonly tryGetVariableType = this.scopedPropertyContext.tryGetVariableType;
	public readonly getVariables = this.scopedPropertyContext.getVariables;
	public readonly i18n = this.scopedPropertyContext.i18n;

	public readonly getValue = (): ReturnType<TValueModel['getDefaultValue']> => {
		return this.model.path.read<ReturnType<TValueModel['getDefaultValue']>>(this.scopedPropertyContext.propertyContext.object);
	};

	public readonly setValue = (value: ReturnType<TValueModel['getDefaultValue']>) => {
		this.model.path.write(this.scopedPropertyContext.propertyContext.object, value);
		this.onValueChanged.forward(this.model.path);
	};

	public readonly validate = (): ValidationResult => {
		return this.model.validate(this);
	};

	public createChildContext<TChildModel extends ValueModel<PropertyValue, object, TProperties>>(
		childValueModel: TChildModel
	): ValueContext<TChildModel> {
		const context = new ValueContext(childValueModel, this.scopedPropertyContext);
		context.onValueChanged.subscribe(this.onValueChanged.forward);
		return context;
	}
}
