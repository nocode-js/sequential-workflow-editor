import { Definition, DefinitionWalker, Step } from 'sequential-workflow-model';
import { Editor } from './editor';
import { DefinitionContext, DefinitionModel, ModelActivator, ModelValidator, Path } from 'sequential-workflow-editor-model';
import { EditorServices, ValueEditorEditorFactoryResolver } from './value-editors';
import {
	GlobalEditorContext,
	RootEditorProvider,
	RootValidator,
	StepEditorContext,
	StepEditorProvider,
	StepValidator
} from './external-types';
import { EditorProviderConfiguration } from './editor-provider-configuration';

export class EditorProvider<TDefinition extends Definition> {
	public static create<TDef extends Definition>(
		definitionModel: DefinitionModel<TDef>,
		configuration: EditorProviderConfiguration
	): EditorProvider<TDef> {
		const definitionWalker = configuration.definitionWalker ?? new DefinitionWalker();
		const activator = ModelActivator.create(definitionModel, configuration.uidGenerator);
		const validator = ModelValidator.create(definitionModel, definitionWalker);
		return new EditorProvider(activator, validator, definitionModel, definitionWalker);
	}

	private readonly services: EditorServices = {
		activator: this.activator,
		valueEditorFactoryResolver: ValueEditorEditorFactoryResolver.resolve
	};

	private constructor(
		private readonly activator: ModelActivator<TDefinition>,
		private readonly validator: ModelValidator,
		private readonly definitionModel: DefinitionModel,
		private readonly definitionWalker: DefinitionWalker
	) {}

	public createRootEditorProvider(): RootEditorProvider {
		return (definition: Definition, context: GlobalEditorContext): HTMLElement => {
			const rootContext = DefinitionContext.createForRoot(definition, this.definitionModel, this.definitionWalker);
			const typeClassName = 'root';
			const editor = Editor.create(this.definitionModel.root.properties, rootContext, this.services, typeClassName);
			editor.onValueChanged.subscribe((path: Path) => {
				console.log('valueChanged', path.toString());
				context.notifyPropertiesChanged();
			});
			return editor.root;
		};
	}

	public createStepEditorProvider(definitionProvider: () => Definition): StepEditorProvider {
		return (step: Step, context: StepEditorContext) => {
			const definitionContext = DefinitionContext.createForStep(
				step,
				definitionProvider(),
				this.definitionModel,
				this.definitionWalker
			);
			const stepModel = this.definitionModel.steps[step.type];
			const typeClassName = stepModel.type;
			const editor = Editor.create([stepModel.name, ...stepModel.properties], definitionContext, this.services, typeClassName);

			editor.onValueChanged.subscribe((path: Path) => {
				if (path.equals(stepModel.name.value.path)) {
					context.notifyNameChanged();
				} else {
					context.notifyPropertiesChanged();
				}
			});
			return editor.root;
		};
	}

	public createStepValidator(): StepValidator {
		return (step: Step, _: unknown, definition: Definition): boolean => {
			return this.validator.validateStep(step, definition);
		};
	}

	public createRootValidator(): RootValidator {
		return (definition: Definition): boolean => {
			return this.validator.validateRoot(definition);
		};
	}

	public activateDefinition(): TDefinition {
		return this.activator.activateDefinition();
	}

	public activateStep(type: string): Step {
		return this.activator.activateStep(type);
	}
}
