import { Designer, Uid } from 'sequential-workflow-designer';
import { EditorProvider, StringValueEditorEditorExtension } from 'sequential-workflow-editor';
import { definitionModel } from './model/definition-model';

import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';
import './app.css';

export class App {
	public static create(): App {
		const placeholder = document.getElementById('designer') as HTMLElement;

		const editorProvider = EditorProvider.create(definitionModel, {
			uidGenerator: Uid.next,
			extensions: [
				StringValueEditorEditorExtension.create({
					editorId: 'string-magic',
					class: 'string-magic-editor'
				})
			]
		});

		const designer = Designer.create(placeholder, editorProvider.activateDefinition(), {
			controlBar: true,
			editors: {
				rootEditorProvider: () => {
					const editor = document.createElement('div');
					editor.innerHTML =
						'This demo showcases all the supported editors by the <a href="https://github.com/nocode-js/sequential-workflow-editor">Sequential Workflow Editor</a>.<br /><br />' +
						'Start exploring by clicking on each step.';
					return editor;
				},
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
			}
		});

		if (location.hash) {
			const type = location.hash.substring(1).toLowerCase();
			const step = designer.getDefinition().sequence.find(s => s.type.toLowerCase() === type);
			if (step) {
				designer.selectStepById(step.id);
			}
		}

		return new App();
	}
}

document.addEventListener('DOMContentLoaded', App.create, false);
