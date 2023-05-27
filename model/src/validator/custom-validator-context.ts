import { Properties, PropertyValue } from 'sequential-workflow-model';
import { DefinitionContext } from '../context';
import { PropertyModel } from '../model';
import { Path } from '../core';

export class CustomValidatorContext<TValue extends PropertyValue = PropertyValue, TProperties extends Properties = Properties> {
	public static create<TVal extends PropertyValue, TProps extends Properties>(
		model: PropertyModel<TVal>,
		definitionContext: DefinitionContext
	): CustomValidatorContext<TVal, TProps> {
		return new CustomValidatorContext<TVal, TProps>(model, definitionContext);
	}

	private constructor(private readonly model: PropertyModel<TValue>, private readonly definitionContext: DefinitionContext) {}

	public getValue(): TValue {
		return this.model.value.path.read(this.definitionContext.object);
	}

	public getPropertyValue<Key extends keyof TProperties>(name: Key): TProperties[Key] {
		const nameStr = String(name);
		const path = Path.create(['properties', nameStr]);

		if (!this.model.dependencies.some(dep => dep.equals(path))) {
			throw new Error(`Property ${nameStr} is not registered as dependency`);
		}

		return path.read(this.definitionContext.object);
	}
}
