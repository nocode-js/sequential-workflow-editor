import { Properties } from 'sequential-workflow-model';
import { ValueContext } from '../../context';
import { Path } from '../../core';
import { ValidationResult, ValueModel, ValueModelFactory, createValidationSingleError } from '../../model';
import { GeneratedStringContext } from './generated-string-context';
import { DefaultValueContext } from '../../context/default-value-context';

export interface GeneratedStringValueModelConfiguration<TProperties extends Properties = Properties> {
	label?: string;
	generator(context: GeneratedStringContext<TProperties>): string;
	editorId?: string;
}

export type GeneratedStringVariableValueModel<TProperties extends Properties = Properties> = ValueModel<
	string,
	GeneratedStringValueModelConfiguration<TProperties>
>;

export const generatedStringValueModelId = 'generatedString';

export function createGeneratedStringValueModel<TProperties extends Properties = Properties>(
	configuration: GeneratedStringValueModelConfiguration<TProperties>
): ValueModelFactory<string, GeneratedStringValueModelConfiguration<TProperties>, TProperties> {
	return {
		create: (path: Path) => ({
			id: generatedStringValueModelId,
			label: configuration.label ?? 'Generated string',
			editorId: configuration.editorId,
			path,
			configuration,
			getDefaultValue(context: DefaultValueContext<TProperties>) {
				const subContext = GeneratedStringContext.create(context);
				return configuration.generator(subContext);
			},
			getVariableDefinitions: () => null,
			validate(context: ValueContext<GeneratedStringVariableValueModel<TProperties>, TProperties>): ValidationResult {
				const subContext = GeneratedStringContext.create(context);
				const value = configuration.generator(subContext);
				if (context.getValue() !== value) {
					return createValidationSingleError(
						context.i18n('generatedString.differentValue', 'Generator returns different value than the current value')
					);
				}
				return null;
			}
		})
	};
}
