import { ValueEditorFactory } from './value-editor';
import { createStringValueEditor, stringValueEditorId } from './string/string-value-editor';
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
import { branchesValueModelId, sequenceValueModelId, stringDictionaryValueModelId } from 'sequential-workflow-editor-model';
import { nullableAnyVariableValueEditor, nullableAnyVariableValueEditorId } from './nullable-any-variable/nullable-any-variable-editor';
import { booleanValueEditor, booleanValueEditorId } from './boolean/boolean-value-editor';
import { generatedStringValueEditor, generatedStringValueEditorId } from './generated-string/generated-string-value-editor';
import { stringDictionaryValueEditor } from './string-dictionary/string-dictionary-value-editor';
import { hiddenValueEditor } from './hidden/hidden-value-editor';
import { EditorExtension } from '../editor-extension';

const defaultMap: ValueEditorMap = {
	[anyVariablesValueEditorId]: anyVariablesValueEditor as ValueEditorFactory,
	[booleanValueEditorId]: booleanValueEditor as ValueEditorFactory,
	[choiceValueEditorId]: choiceValueEditor as ValueEditorFactory,
	[nullableAnyVariableValueEditorId]: nullableAnyVariableValueEditor as ValueEditorFactory,
	[dynamicValueEditorId]: dynamicValueEditor as ValueEditorFactory,
	[generatedStringValueEditorId]: generatedStringValueEditor as ValueEditorFactory,
	[nullableVariableValueEditorId]: nullableVariableValueEditor as ValueEditorFactory,
	[nullableVariableDefinitionValueEditorId]: nullableVariableDefinitionValueEditor as ValueEditorFactory,
	[stringValueEditorId]: createStringValueEditor() as ValueEditorFactory,
	[stringDictionaryValueModelId]: stringDictionaryValueEditor as ValueEditorFactory,
	[numberValueEditorId]: numberValueEditor as ValueEditorFactory,
	[variableDefinitionsValueEditorId]: variableDefinitionsValueEditor as ValueEditorFactory,
	[sequenceValueModelId]: hiddenValueEditor,
	[branchesValueModelId]: hiddenValueEditor
};

type ValueEditorMap = Record<string, ValueEditorFactory | null>;

export class ValueEditorFactoryResolver {
	public static create(extensions?: EditorExtension[]): ValueEditorFactoryResolver {
		let map: ValueEditorMap;
		if (extensions) {
			map = { ...defaultMap };
			extensions.forEach(extension => {
				if (extension.valueEditors) {
					extension.valueEditors.forEach(e => (map[e.editorId] = e.factory));
				}
			});
		} else {
			map = defaultMap;
		}
		return new ValueEditorFactoryResolver(map);
	}

	private constructor(private readonly map: ValueEditorMap) {}

	public resolve(valueModelId: string, editorId: string | undefined): ValueEditorFactory {
		const id = editorId ?? valueModelId;
		const editor = this.map[id];
		if (!editor) {
			throw new Error(`Editor id ${id} is not supported`);
		}
		return editor;
	}
}
