import { Properties } from 'sequential-workflow-model';
import { ValueContext } from '../../context';
import { GeneratedStringVariableValueModel } from './generated-string-value-model';
import { DefaultValueContext } from '../../context/default-value-context';

export class GeneratedStringContext<TProperties extends Properties = Properties> {
	public static create<TProps extends Properties = Properties>(
		context: ValueContext<GeneratedStringVariableValueModel<TProps>, TProps> | DefaultValueContext<TProps>
	) {
		return new GeneratedStringContext(context);
	}

	private constructor(
		private readonly context:
			| ValueContext<GeneratedStringVariableValueModel<TProperties>, TProperties>
			| DefaultValueContext<TProperties>
	) {}

	public readonly getPropertyValue = this.context.getPropertyValue;
	public readonly formatPropertyValue = this.context.formatPropertyValue;
}
