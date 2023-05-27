import { Designer } from 'sequential-workflow-designer';
import { editorProvider } from './editor-provider';
import { tryReadDefinition, saveDefinition } from './storage';
import { Playground } from './playground';
import { executeMachine } from './machine/machine-executor';
import { MyDefinition, definitionModel } from './model/definition-model';

import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';

export class App {
	public static create(): App {
		const placeholder = document.getElementById('designer') as HTMLElement;

		const startDefinition: MyDefinition = tryReadDefinition() ?? editorProvider.activateDefinition();

		const designer: Designer<MyDefinition> = Designer.create(placeholder, startDefinition, {
			controlBar: true,
			editors: {
				globalEditorProvider: editorProvider.createRootEditorProvider(),
				stepEditorProvider: editorProvider.createStepEditorProvider(() => designer.getDefinition())
			},
			validator: {
				step: editorProvider.createStepValidator(),
				root: editorProvider.createRootValidator()
			},
			steps: {},
			toolbox: {
				groups: [
					{
						name: 'Steps',
						steps: Object.keys(definitionModel.steps).map(stepType => editorProvider.activateStep(stepType))
					}
				]
			}
		});

		const playground = Playground.create();
		const app = new App(designer, playground);
		designer.onReady.subscribe(app.execute);
		designer.onDefinitionChanged.subscribe(app.execute);
		playground.onInputChanged.subscribe(app.execute);
		return app;
	}

	private constructor(private readonly designer: Designer<MyDefinition>, private readonly playground: Playground) {}

	private readonly execute = async () => {
		this.playground.clearLogs();

		const definition = this.designer.getDefinition();
		this.playground.updateVariables(definition);
		saveDefinition(definition);

		try {
			const inputVariableValues = this.playground.readInputVariables();

			if (!this.designer.isValid()) {
				throw new Error('Definition is not valid');
			}

			const snapshot = await executeMachine(definition, inputVariableValues, statePath => {
				this.playground.log(`<state: ${statePath}>`);
			});

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

document.addEventListener('DOMContentLoaded', App.create, false);
