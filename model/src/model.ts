import { Definition, Properties, PropertyValue, Sequence } from 'sequential-workflow-model';
import { ValueModelId, ValueType, VariableDefinition } from './types';
import { Path } from './core/path';
import { ValueContext } from './context';
import { CustomValidatorContext } from './validator';
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
	label: string;
	description?: string;
	name: PropertyModel<string>;
	properties: PropertyModels;
}

export type PropertyModels = PropertyModel[];

export interface PropertyModel<TValue extends PropertyValue = PropertyValue, TConfiguration extends object = object> {
	path: Path;
	label: string;
	hint?: string;
	dependencies: Path[];
	customValidator?: CustomValidator<TValue>;
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

export interface ValueModel<
	TValue extends PropertyValue = PropertyValue,
	TConfiguration extends object = object,
	TProperties extends Properties = Properties
> {
	id: ValueModelId;
	path: Path;
	label: string;
	configuration: TConfiguration;
	subModels?: ValueModel[];
	getDefaultValue(context: DefaultValueContext): TValue;
	getVariableDefinitions(context: ValueContext<ValueModel<TValue, TConfiguration, TProperties>>): VariableDefinition[] | null;
	validate(context: ValueContext<ValueModel<TValue, TConfiguration, TProperties>>): ValidationResult;
}

export interface CustomValidator<TValue extends PropertyValue = PropertyValue, TProperties extends Properties = Properties> {
	validate(context: CustomValidatorContext<TValue, TProperties>): string | null;
}

export type ValidationError = Record<string, string | null>;
export type ValidationResult = ValidationError | null;

export function createValidationSingleError(error: string): ValidationResult {
	return {
		$: error
	};
}

export interface ContextVariable {
	name: string;
	type: ValueType;
	stepId: string | null;
	valueModelPath: Path;
}
