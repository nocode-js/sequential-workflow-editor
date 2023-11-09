import { Definition, DefinitionWalker, Designer } from 'sequential-workflow-designer';
import { editorProvider } from './editor-provider';
import { AppState, AppStorage } from './storage';
import { Playground } from './playground';
import { executeMachine } from './machine/machine-executor';
import { MyDefinition } from './model/definition-model';
import { defaultAppState } from './default-state';

import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';

export class App {
	public static create(): App {
		const placeholder = document.getElementById('designer') as HTMLElement;

		const startState: AppState = AppStorage.tryGet() ?? defaultAppState;

		const definitionWalker = new DefinitionWalker();
		const designer: Designer<MyDefinition> = Designer.create(placeholder, startState.definition, {
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
				iconUrlProvider: (componentType: string, type: string) => {
					return componentType === 'task' ? './assets/icon-task.svg' : `./assets/icon-${type}.svg`;
				}
			},
			toolbox: {
				groups: editorProvider.getToolboxGroups(),
				labelProvider: editorProvider.createStepLabelProvider()
			},
			undoStackSize: 10,
			definitionWalker
		});

		const playground = Playground.create(startState.inputData);
		const app = new App(definitionWalker, designer, playground);
		designer.onReady.subscribe(app.execute);
		designer.onDefinitionChanged.subscribe(app.execute);
		playground.onInputChanged.subscribe(app.execute);
		return app;
	}

	private constructor(
		private readonly definitionWalker: DefinitionWalker,
		private readonly designer: Designer<MyDefinition>,
		private readonly playground: Playground
	) {}

	private readonly execute = async () => {
		this.playground.clearLogs();

		const definition = this.designer.getDefinition();
		this.playground.updateVariables(definition);
		AppStorage.set(definition, this.playground.readInputData());

		try {
			const inputVariablesState = this.playground.readInputVariableState();

			if (!this.designer.isValid()) {
				throw new Error('Definition is not valid');
			}

			const snapshot = await executeMachine(
				definition,
				inputVariablesState,
				statePath => {
					const name = readStateName(statePath, definition, this.definitionWalker);
					this.playground.log(`state: ${name}`, 'trace');
				},
				log => {
					this.playground.log(log);
				}
			);

			if (snapshot.unhandledError) {
				const error = snapshot.unhandledError as Error;
				this.playground.log(`UNHANDLED ERROR: ${error.message}`);
				return;
			}

			definition.properties.outputs.variables.forEach(variable => {
				if (snapshot.globalState.$variables.isSet(variable.name)) {
					const value = snapshot.globalState.$variables.read(variable.name);
					this.playground.setOutputVariable(variable.name, value);
				}
			});
		} catch (e) {
			const error = e as Error;
			this.playground.log(`FAILED: ${error.message}`);
		}
	};
}

function readStateName(statePath: string[], definition: Definition, walker: DefinitionWalker): string {
	const path = [...statePath].reverse();
	const deepestStepId = path.find(x => x.startsWith('STEP_'))?.substring(5);
	if (deepestStepId) {
		const step = walker.getById(definition, deepestStepId);
		if (path[0].startsWith('STEP_')) {
			return step.name;
		}
		return `${step.name} (${path[0]})`;
	}
	return statePath.join('/');
}

document.addEventListener('DOMContentLoaded', App.create, false);
