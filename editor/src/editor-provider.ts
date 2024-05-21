import { Definition, DefinitionWalker, Step } from 'sequential-workflow-model';
import { Editor, EditorValidator } from './editor';
import {
	DefinitionContext,
	DefinitionModel,
	ModelActivator,
	DefinitionValidator,
	Path,
	StepValidatorContext,
	defaultI18n,
	I18n
} from 'sequential-workflow-editor-model';
import { EditorServices, ValueEditorFactoryResolver } from './value-editors';
import {
	GlobalEditorContext,
	RootEditorProvider,
	RootValidator,
	StepEditorContext,
	StepEditorProvider,
	StepLabelProvider,
	StepValidator,
	ToolboxGroup
} from './external-types';
import { EditorProviderConfiguration } from './editor-provider-configuration';
import { EditorHeaderData } from './editor-header';

export class EditorProvider<TDefinition extends Definition> {
	public static create<TDef extends Definition>(
		definitionModel: DefinitionModel<TDef>,
		configuration: EditorProviderConfiguration
	): EditorProvider<TDef> {
		const definitionWalker = configuration.definitionWalker ?? new DefinitionWalker();
		const i18n = configuration.i18n ?? defaultI18n;
		const activator = ModelActivator.create(definitionModel, configuration.uidGenerator);
		const validator = DefinitionValidator.create(definitionModel, definitionWalker);
		const valueEditorFactoryResolver = ValueEditorFactoryResolver.create(configuration.extensions);
		return new EditorProvider(activator, validator, definitionModel, definitionWalker, i18n, valueEditorFactoryResolver, configuration);
	}

	private readonly services: EditorServices = {
		activator: this.activator,
		valueEditorFactoryResolver: this.valueEditorFactoryResolver,
		i18n: this.i18n
	};

	private constructor(
		private readonly activator: ModelActivator<TDefinition>,
		private readonly validator: DefinitionValidator,
		private readonly definitionModel: DefinitionModel,
		private readonly definitionWalker: DefinitionWalker,
		private readonly i18n: I18n,
		private readonly valueEditorFactoryResolver: ValueEditorFactoryResolver,
		private readonly configuration: EditorProviderConfiguration
	) {}

	public createRootEditorProvider(): RootEditorProvider {
		return (definition: Definition, context: GlobalEditorContext): HTMLElement => {
			const rootContext = DefinitionContext.createForRoot(definition, this.definitionModel, this.definitionWalker, this.i18n);
			const editor = Editor.create(null, null, this.definitionModel.root.properties, null, rootContext, this.services);
			editor.onValuesChanged.subscribe(() => {
				context.notifyPropertiesChanged();
			});
			return editor.root;
		};
	}

	public createStepEditorProvider(): StepEditorProvider {
		return (step: Step, context: StepEditorContext, definition: Definition) => {
			const definitionContext = DefinitionContext.createForStep(
				step,
				definition,
				this.definitionModel,
				this.definitionWalker,
				this.i18n
			);
			const stepModel = this.definitionModel.steps[step.type];
			const propertyModels = [stepModel.name, ...stepModel.properties];

			const headerData: EditorHeaderData | null = this.configuration.isHeaderHidden
				? null
				: {
						label: stepModel.label,
						description: stepModel.description
				  };

			let validator: EditorValidator | null = null;
			if (stepModel.validator) {
				const stepValidator = stepModel.validator;
				const stepValidatorContext = StepValidatorContext.create(definitionContext);
				validator = () => stepValidator.validate(stepValidatorContext);
			}

			const editor = Editor.create(headerData, validator, propertyModels, stepModel.type, definitionContext, this.services);

			editor.onValuesChanged.subscribe((paths: Path[]) => {
				const isNameChanged = paths.some(path => path.equals(stepModel.name.value.path));
				if (isNameChanged) {
					context.notifyNameChanged();
					return;
				}
				const areBranchesChanged = paths.some(path => path.equals('branches'));
				if (areBranchesChanged) {
					context.notifyChildrenChanged();
					return;
				}
				context.notifyPropertiesChanged();
			});
			return editor.root;
		};
	}

	public createStepValidator(): StepValidator {
		return (step: Step, _: unknown, definition: Definition): boolean => {
			return this.validator.validateStep(step, definition) === null;
		};
	}

	public createRootValidator(): RootValidator {
		return (definition: Definition): boolean => {
			return this.validator.validateRoot(definition) === null;
		};
	}

	public activateDefinition(): TDefinition {
		return this.activator.activateDefinition();
	}

	public activateStep(type: string): Step {
		return this.activator.activateStep(type);
	}

	public getToolboxGroups(): ToolboxGroup[] {
		const stepModels = Object.values(this.definitionModel.steps);
		const groups: ToolboxGroup[] = [];
		const categories = new Set<string | undefined>(stepModels.map(step => step.category));
		categories.forEach((category: string | undefined) => {
			const name = category ?? this.i18n('toolbox.defaultGroupName', 'Others');
			const groupStepModels = stepModels.filter(step => step.category === category);
			const groupSteps = groupStepModels.map(step => this.activateStep(step.type));
			groupSteps.sort((a, b) => a.name.localeCompare(b.name));
			groups.push({
				name,
				steps: groupSteps
			});
		});
		groups.sort((a, b) => a.name.localeCompare(b.name));
		return groups;
	}

	public createStepLabelProvider(): StepLabelProvider {
		return (step: { type: string }): string => {
			const stepModel = this.definitionModel.steps[step.type];
			return stepModel.label;
		};
	}
}
