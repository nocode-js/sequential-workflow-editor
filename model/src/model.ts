import { Definition, Properties, PropertyValue, Sequence } from 'sequential-workflow-model';
import { ValueModelId, ValueType, VariableDefinition } from './types';
import { Path } from './core/path';
import { ValueContext } from './context';
import { PropertyValidatorContext, StepValidatorContext } from './validator';
import { DefaultValueContext } from './context/default-value-context';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DefinitionModel<TDefinition extends Definition = Definition> {
	root: RootModel;
	steps: StepModels;
	valueTypes: ValueType[];
}

export interface RootModel {
	sequence: PropertyModel<Sequence>;
	properties: PropertyModels;
}

export type StepModels = Record<string, StepModel>;

export interface StepModel {
	type: string;
	componentType: string;
	category?: string;
	toolbox: boolean;
	label: string;
	description?: string;
	name: PropertyModel<string>;
	properties: PropertyModels;
	validator?: StepValidator;
}

export type PropertyModels = PropertyModel[];

export interface PropertyModel<TValue extends PropertyValue = PropertyValue, TConfiguration extends object = object> {
	path: Path;
	label: string;
	hint?: string;
	dependencies: Path[];
	validator?: PropertyValidator<TValue>;
	value: ValueModel<TValue, TConfiguration, Properties>;
}

export interface ValueModelFactory<
	TValue extends PropertyValue = PropertyValue,
	TConfiguration extends object = object,
	TProperties extends Properties = Properties
> {
	create(path: Path): ValueModel<TValue, TConfiguration, TProperties>;
}

export type ValueModelFactoryFromModel<TValueModel extends ValueModel = ValueModel> = ValueModelFactory<
	ReturnType<TValueModel['getDefaultValue']>,
	TValueModel['configuration']
>;

export interface StepValidator {
	validate(context: StepValidatorContext): string | null;
}

export interface ValueModel<
	TValue extends PropertyValue = PropertyValue,
	TConfiguration extends object = object,
	TProperties extends Properties = Properties
> {
	id: ValueModelId;
	editorId?: string;
	path: Path;
	/**
	 * Default translation for the label.
	 */
	label: string;
	configuration: TConfiguration;
	subModels?: ValueModel[];
	getDefaultValue(context: DefaultValueContext): TValue;
	getVariableDefinitions(context: ValueContext<ValueModel<TValue, TConfiguration, TProperties>>): VariableDefinition[] | null;
	validate(context: ValueContext<ValueModel<TValue, TConfiguration, TProperties>>): ValidationResult;
}

export interface PropertyValidator<TValue extends PropertyValue = PropertyValue, TProperties extends Properties = Properties> {
	validate(context: PropertyValidatorContext<TValue, TProperties>): string | null;
}

export type ValidationError = Record<string, string | null>;
export type ValidationResult = ValidationError | null;

export function createValidationSingleError(error: string): ValidationError {
	return {
		$: error
	};
}

export interface ContextVariable {
	readonly name: string;
	readonly type: ValueType;
	readonly stepId: string | null;
	readonly valueModelPath: Path;
}
