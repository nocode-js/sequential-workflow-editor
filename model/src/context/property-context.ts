import { Properties, Step } from 'sequential-workflow-model';
import { DefinitionModel, PropertyModel } from '../model';
import { ValueType } from '../types';
import { readPropertyValue } from './read-property-value';

export class PropertyContext<TProperties extends Properties = Properties> {
	public static create<TProps extends Properties = Properties>(
		object: object,
		propertyModel: PropertyModel,
		definitionModel: DefinitionModel
	): PropertyContext<TProps> {
		return new PropertyContext<TProps>(object, propertyModel, definitionModel);
	}

	private constructor(
		public readonly object: object,
		private readonly propertyModel: PropertyModel,
		private readonly definitionModel: DefinitionModel
	) {}

	/**
	 * @returns the type of the step, or `null` if the object is root.
	 */
	public readonly tryGetStepType = (): string | null => {
		const type = (this.object as Step).type;
		return type ? type : null;
	};

	/**
	 * Get the value of a property by name.
	 * @param name The name of the property.
	 * @returns The value of the property.
	 */
	public readonly getPropertyValue = <Key extends keyof TProperties>(name: Key): TProperties[Key] => {
		return readPropertyValue(name, this.propertyModel, this.object);
	};

	/**
	 * @returns The supported value types for variables.
	 */
	public readonly getValueTypes = (): ValueType[] => {
		return this.definitionModel.valueTypes;
	};

	/**
	 * Format a property value using a formatter function.
	 * @param name The name of the property.
	 * @param formatter The formatter function.
	 * @param undefinedValue The value to return if the property value is `null` or `undefined`.
	 */
	public readonly formatPropertyValue = <Key extends keyof TProperties>(
		name: Key,
		formatter: (value: NonNullable<TProperties[Key]>) => string,
		undefinedValue?: string
	): string => {
		const value = this.getPropertyValue(name);
		if (value === undefined || value === null) {
			return undefinedValue || '?';
		}
		return formatter(value);
	};
}
