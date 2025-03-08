import { EditorProvider } from 'sequential-workflow-editor';
import { ChownStep, I18nDefinition, definitionModel } from './definition-model';
import { Designer, Uid } from 'sequential-workflow-designer';
import { defaultI18n } from 'sequential-workflow-editor-model';

import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';

const designerDict: Record<string, Record<string, string>> = {
	pl: {
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
		'toolbox.item.chown.label': 'Uprawnienia'
	}
};

const editorDict: Record<string, Record<string, string>> = {
	pl: {
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
		'step.chown.property:properties/users': 'Użytkownik',
		'step.chown.property:properties/mode': 'Tryb',
		'step.chown.property:properties/mode:choice:Read': 'Odczyt',
		'step.chown.property:properties/mode:choice:Write': 'Zapis',
		'step.chown.property:properties/mode:choice:Execute': 'Wykonanie'
	}
};

export class App {
	public static create() {
		const placeholder = document.getElementById('designer') as HTMLElement;
		const langInput = document.getElementById('lang') as HTMLInputElement;
		const app = new App(placeholder, langInput.value);
		app.reload();
		langInput.addEventListener('change', () => {
			app.setLang(langInput.value);
			app.reload();
		});
		return app;
	}

	private designer: Designer<I18nDefinition> | null = null;
	private definition: I18nDefinition | null = null;

	public constructor(private readonly placeholder: HTMLElement, private lang: string) {}

	private readonly designerI18n = (key: string, defaultValue: string) => {
		const dict = designerDict[this.lang];
		if (dict) {
			const translation = dict[key];
			if (translation) {
				return translation;
			}
		}
		console.log(`<designer>`, key, defaultValue);
		return defaultValue;
	};

	private readonly editorI18n = (key: string, defaultValue: string, replacements?: { [key: string]: string }) => {
		const dict = editorDict[this.lang];
		if (dict) {
			const translation = dict[key];
			if (translation) {
				defaultValue = translation;
			} else {
				console.log(`<editor>`, key, defaultValue);
			}
		}
		return defaultI18n(key, defaultValue, replacements);
	};

	public setLang(lang: string) {
		this.lang = lang;
	}

	public reload() {
		if (this.designer) {
			this.designer.destroy();
		}

		const editorProvider = EditorProvider.create(definitionModel, {
			uidGenerator: Uid.next,
			i18n: this.editorI18n
		});

		if (!this.definition) {
			this.definition = editorProvider.activateDefinition();
			const step = editorProvider.activateStep('chown') as ChownStep;
			this.definition.sequence.push(step);
		}

		this.designer = Designer.create(this.placeholder, this.definition, {
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
			i18n: this.designerI18n
		});
		this.designer.onDefinitionChanged.subscribe(d => (this.definition = d));
	}
}

document.addEventListener('DOMContentLoaded', App.create, false);
