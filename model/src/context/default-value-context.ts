import { Properties } from 'sequential-workflow-model';
import { ModelActivator } from '../activator';
import { PropertyModel, ValueModel } from '../model';
import { ValueContext } from './value-context';
import { readPropertyValue } from './read-property-value';

export class DefaultValueContext<TProperties extends Properties = Properties> {
	public static create<TProps extends Properties = Properties>(
		activator: ModelActivator,
		object: object,
		model: PropertyModel
	): DefaultValueContext<TProps> {
		return new DefaultValueContext<TProps>(activator, name => readPropertyValue(name, model, object));
	}

	public static createFromValueContext<TProps extends Properties = Properties>(
		activator: ModelActivator,
		valueContext: ValueContext<ValueModel, TProps>
	): DefaultValueContext<TProps> {
		return new DefaultValueContext(activator, valueContext.getPropertyValue);
	}

	private constructor(
		private readonly activator: ModelActivator,
		public readonly getPropertyValue: <Key extends keyof TProperties>(name: Key) => TProperties[Key]
	) {}

	public readonly activateStep = this.activator.activateStep;
}
