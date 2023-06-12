import { ValueEditorFactory } from './value-editor';
import { stringValueEditor, stringValueEditorId } from './string/string-value-editor';
import { numberValueEditor, numberValueEditorId } from './number/number-value-editor';
import { variableDefinitionsValueEditor, variableDefinitionsValueEditorId } from './variable-definitions/variable-definitions-value-editor';
import { nullableVariableValueEditor, nullableVariableValueEditorId } from './nullable-variable/nullable-variable-value-editor';
import {
	nullableVariableDefinitionValueEditor,
	nullableVariableDefinitionValueEditorId
} from './nullable-variable-definition/variable-definition-value-editor';
import { anyVariablesValueEditor, anyVariablesValueEditorId } from './any-variables/any-variables-value-editor';
import { dynamicValueEditor, dynamicValueEditorId } from './dynamic/dynamic-value-editor';
import { choiceValueEditor, choiceValueEditorId } from './choice/choice-value-editor';
import { branchesValueModelId, sequenceValueModelId } from 'sequential-workflow-editor-model';
import { nullableAnyVariableValueEditor, nullableAnyVariableValueEditorId } from './nullable-any-variable/nullable-any-variable-editor';
import { booleanValueEditor, booleanValueEditorId } from './boolean/boolean-value-editor';

const editors: { id: string; factory: ValueEditorFactory | null }[] = [
	{ id: anyVariablesValueEditorId, factory: anyVariablesValueEditor as ValueEditorFactory },
	{ id: booleanValueEditorId, factory: booleanValueEditor as ValueEditorFactory },
	{ id: choiceValueEditorId, factory: choiceValueEditor as ValueEditorFactory },
	{ id: nullableAnyVariableValueEditorId, factory: nullableAnyVariableValueEditor as ValueEditorFactory },
	{ id: dynamicValueEditorId, factory: dynamicValueEditor as ValueEditorFactory },
	{ id: nullableVariableValueEditorId, factory: nullableVariableValueEditor as ValueEditorFactory },
	{ id: nullableVariableDefinitionValueEditorId, factory: nullableVariableDefinitionValueEditor as ValueEditorFactory },
	{ id: stringValueEditorId, factory: stringValueEditor as ValueEditorFactory },
	{ id: numberValueEditorId, factory: numberValueEditor as ValueEditorFactory },
	{ id: variableDefinitionsValueEditorId, factory: variableDefinitionsValueEditor as ValueEditorFactory },
	{ id: sequenceValueModelId, factory: null },
	{ id: branchesValueModelId, factory: null }
];

export class ValueEditorEditorFactoryResolver {
	public static resolve(valueModelId: string): ValueEditorFactory {
		const editor = editors.find(editor => editor.id === valueModelId);
		if (!editor || !editor.factory) {
			throw new Error(`Value model id: ${valueModelId} is not supported`);
		}
		return editor.factory;
	}

	public static isHidden(valueModelId: string): boolean {
		const editor = editors.find(editor => editor.id === valueModelId);
		return editor ? editor.factory === null : false;
	}
}
