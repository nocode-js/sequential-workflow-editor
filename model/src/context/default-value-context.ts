import { Properties } from 'sequential-workflow-model';
import { ModelActivator } from '../activator';
import { PropertyContext } from './property-context';

export class DefaultValueContext<TProperties extends Properties = Properties> {
	public static create<TProps extends Properties = Properties>(
		activator: ModelActivator,
		propertyContext: PropertyContext<TProps>
	): DefaultValueContext<TProps> {
		return new DefaultValueContext<TProps>(activator, propertyContext);
	}

	private constructor(
		private readonly activator: ModelActivator,
		public readonly propertyContext: PropertyContext<TProperties>
	) {}

	public readonly getPropertyValue = this.propertyContext.getPropertyValue;
	public readonly formatPropertyValue = this.propertyContext.formatPropertyValue;
	public readonly activateStep = this.activator.activateStep;
}
