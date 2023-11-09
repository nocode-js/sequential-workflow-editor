import { EditorProvider } from 'sequential-workflow-editor';
import { SocketStep, definitionModel } from './definition-model';
import { Designer, Uid } from 'sequential-workflow-designer';

import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';

export class App {
	public static create() {
		const placeholder = document.getElementById('designer') as HTMLElement;

		const editorProvider = EditorProvider.create(definitionModel, {
			uidGenerator: Uid.next
		});

		const definition = editorProvider.activateDefinition();
		const loop = editorProvider.activateStep('socket') as SocketStep;
		loop.sequence.push(editorProvider.activateStep('writeSocket'));
		const break_ = editorProvider.activateStep('writeSocket');
		definition.sequence.push(loop);
		definition.sequence.push(break_);

		Designer.create(placeholder, definition, {
			controlBar: true,
			editors: {
				rootEditorProvider: () => {
					const editor = document.createElement('div');
					editor.innerHTML =
						'This example shows how to restrict the placement of steps. The write socket step can only be placed inside a socket step. <a href="https://github.com/nocode-js/sequential-workflow-editor">GitHub</a>';
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
	}
}

document.addEventListener('DOMContentLoaded', App.create, false);
