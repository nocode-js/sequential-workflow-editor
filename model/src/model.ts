import { Definition, Properties, PropertyValue, Sequence } from 'sequential-workflow-model';
import { ValueModelId, ValueType, VariableDefinition } from './types';
import { Path } from './core/path';
import { ValueModelContext } from './context';
import { ModelActivator } from './activator';
import { CustomValidatorContext } from './validator';

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
	name: PropertyModel<string>;
	properties: PropertyModels;
}

export type PropertyModels = PropertyModel[];

export interface PropertyModel<TValue extends PropertyValue = PropertyValue, TConfiguration extends object = object> {
	name: string;
	label: string;
	dependencies: Path[];
	customValidator?: CustomValidator<TValue>;
	value: ValueModel<TValue, TConfiguration>;
}

export type ValueModelFactory<TValueModel extends ValueModel = ValueModel> = (path: Path) => TValueModel;

export type ValueModelFactoryOfValue<TValue extends PropertyValue = PropertyValue> = (path: Path) => ValueModel<TValue, object>;

export interface ValueModel<TValue extends PropertyValue = PropertyValue, TConfiguration extends object = object> {
	id: ValueModelId;
	path: Path;
	configuration: TConfiguration;
	childModels?: ValueModel[];
	getDefaultValue(activator: ModelActivator): TValue;
	getVariableDefinitions(context: ValueModelContext<ValueModel<TValue, TConfiguration>>): VariableDefinition[] | null;
	validate(context: ValueModelContext<ValueModel<TValue, TConfiguration>>): ValidationResult;
}

export interface CustomValidator<TValue extends PropertyValue = PropertyValue, TProperties extends Properties = Properties> {
	validate(context: CustomValidatorContext<TValue, TProperties>): string | null;
}

export type ValidationResult = Record<string, string | null> | null;
export type ValidationSingleError = Record<'$', string>;

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
