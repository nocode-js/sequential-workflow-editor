import { stringStepModel } from './string-step-model';
import { stringDictionaryStepModel } from './string-dictionary-step-model';
import { booleanStepModel } from './boolean-step-model';
import { choiceStepModel } from './choice-step-model';
import { numberStepModel } from './number-step-model';
import { anyVariablesStepModel } from './any-variables-step-model';
import { dynamicStepModel } from './dynamic-step-model';
import { generatedStringStepModel } from './generated-string-step-model';
import { nullableAnyVariableStepModel } from './nullable-any-variable-step-model';
import { nullableVariableStepModel } from './nullable-variable-step-model';
import { nullableVariableDefinitionStepModel } from './nullable-variable-definition-step-model';
import { variableDefinitionsStepModel } from './variable-definitions-step-model';

export const stepModels = [
	anyVariablesStepModel,
	booleanStepModel,
	choiceStepModel,
	dynamicStepModel,
	generatedStringStepModel,
	nullableAnyVariableStepModel,
	nullableVariableDefinitionStepModel,
	nullableVariableStepModel,
	numberStepModel,
	stringDictionaryStepModel,
	stringStepModel,
	variableDefinitionsStepModel
];
