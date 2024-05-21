import { EditorProvider } from 'sequential-workflow-editor';
import { ChownStep, definitionModel } from './definition-model';
import { Designer, Uid } from 'sequential-workflow-designer';
import { defaultI18n } from 'sequential-workflow-editor-model';

import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';

const designerDict: Record<string, string> = {
	'controlBar.resetView': 'Resetuj widok',
	'controlBar.zoomIn': 'Przybliż',
	'controlBar.zoomOut': 'Oddal',
	'controlBar.turnOnOffDragAndDrop': 'Włącz/wyłącz przeciąganie i upuszczanie',
	'controlBar.deleteSelectedStep': 'Usuń wybrany krok',
	'controlBar.undo': 'Cofnij',
	'controlBar.redo': 'Dalej',
	'smartEditor.toggle': 'Zwiń/rozwiń',
	'toolbox.title': 'Przybornik',
	'toolbox.search': 'Szukaj',
	'contextMenu.select': 'Zaznacz',
	'contextMenu.unselect': 'Odznacz',
	'contextMenu.delete': 'Usuń',
	'contextMenu.resetView': 'Resetuj widok',
	'contextMenu.duplicate': 'Duplikuj',

	// steps
	'step.chown.name': 'Uprawnienia',
	'toolbox.item.chown.label': 'Uprawnienia'
};

const editorDict: Record<string, string> = {
	'toolbox.defaultGroupName': 'Inne',
	'stringDictionary.noItems': 'Brak elementów',
	'stringDictionary.addItem': 'Dodaj element',
	'stringDictionary.key': 'Klucz',
	'stringDictionary.value': 'Wartość',
	'stringDictionary.delete': 'Usuń',
	'stringDictionary.valueTooShort': 'Wartość musi mieć conajmniej :min znaków',
	'stringDictionary.duplicatedKey': 'Klucz jest zduplikowany',
	'stringDictionary.keyIsRequired': 'Klucz jest wymagany',

	'number.valueMustBeNumber': 'Wartość musi być liczbą',
	'number.valueTooLow': 'Wartość musi być minimum :min.',
	'number.valueTooHigh': 'Wartość musi być maximum :max.',

	'boolean.false': 'Fałsz',
	'boolean.true': 'Prawda',

	'string.valueTooShort': 'Wartość musi mieć minimum :min znaków.',
	'string.valueDoesNotMatchPattern': 'Wartość nie pasuje do oczekiwanego wzorca.',

	'dynamic.string.label': 'Tekst',
	'dynamic.number.label': 'Liczba',

	// root
	'root.property:properties/timeout': 'Przekroczenie czasu',
	'root.property:properties/debug': 'Tryb debug',

	// steps
	'step.chown.name': 'Uprawnienia',
	'step.chown.property:name': 'Nazwa',
	'step.chown.property:properties/stringOrNumber': 'Tekst lub liczba',
	'step.chown.property:properties/users': 'Użytkownik'
};

function designerI18n(key: string, defaultValue: string) {
	const translation = designerDict[key];
	if (translation) {
		return translation;
	}
	console.log(`<designer>`, key, defaultValue);
	return defaultValue;
}

function editorI18n(key: string, defaultValue: string, replacements?: { [key: string]: string }) {
	const translation = editorDict[key];
	if (translation) {
		defaultValue = translation;
	} else {
		console.log(`<editor>`, key, defaultValue);
	}
	return defaultI18n(key, defaultValue, replacements);
}

export class App {
	public static create() {
		const placeholder = document.getElementById('designer') as HTMLElement;

		const editorProvider = EditorProvider.create(definitionModel, {
			uidGenerator: Uid.next,
			i18n: editorI18n
		});

		const definition = editorProvider.activateDefinition();
		const step = editorProvider.activateStep('chown') as ChownStep;
		definition.sequence.push(step);

		Designer.create(placeholder, definition, {
			controlBar: true,
			editors: {
				rootEditorProvider: editorProvider.createRootEditorProvider(),
				stepEditorProvider: editorProvider.createStepEditorProvider()
			},
			validator: {
				step: editorProvider.createStepValidator(),
				root: editorProvider.createRootValidator()
			},
			steps: {
				iconUrlProvider: () => './assets/icon-task.svg'
			},
			toolbox: {
				groups: editorProvider.getToolboxGroups(),
				labelProvider: editorProvider.createStepLabelProvider()
			},
			i18n: designerI18n
		});
	}
}

document.addEventListener('DOMContentLoaded', App.create, false);
