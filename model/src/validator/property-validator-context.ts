import { Properties, PropertyValue } from 'sequential-workflow-model';
import { PropertyModel } from '../model';
import { DefinitionContext } from '../context';
import { readPropertyValue } from '../context/read-property-value';

export class PropertyValidatorContext<TValue extends PropertyValue = PropertyValue, TProperties extends Properties = Properties> {
	public static create<TVal extends PropertyValue, TProps extends Properties>(
		propertyModel: PropertyModel<TVal>,
		definitionContext: DefinitionContext
	): PropertyValidatorContext<TVal, TProps> {
		return new PropertyValidatorContext<TVal, TProps>(propertyModel, definitionContext);
	}

	protected constructor(private readonly model: PropertyModel<TValue>, private readonly definitionContext: DefinitionContext) {}

	public getValue(): TValue {
		return this.model.path.read(this.definitionContext.object) as TValue;
	}

	public getPropertyValue<Key extends keyof TProperties>(name: Key): TProperties[Key] {
		return readPropertyValue(name, this.model, this.definitionContext.object);
	}
}

/**
 * @deprecated Use `PropertyValidatorContext` instead.
 */
export class CustomValidatorContext<
	TValue extends PropertyValue = PropertyValue,
	TProperties extends Properties = Properties
> extends PropertyValidatorContext<TValue, TProperties> {}
