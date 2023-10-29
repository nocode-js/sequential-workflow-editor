import { Properties } from 'sequential-workflow-model';
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

	public readonly getPropertyValue = <Key extends keyof TProperties>(name: Key): TProperties[Key] => {
		return readPropertyValue(name, this.propertyModel, this.object);
	};

	public readonly getValueTypes = (): ValueType[] => {
		return this.definitionModel.valueTypes;
	};
}
