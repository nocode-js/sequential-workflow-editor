import { PropertyValue } from 'sequential-workflow-model';
import { ContextVariable, ValidationResult, ValueModel } from '../model';
import { Path } from '../core/path';
import { DefinitionContext } from './definition-context';
import { SimpleEvent } from '../core/simple-event';

export class ValueModelContext<TValueModel extends ValueModel = ValueModel> {
	public static create<TValueModel extends ValueModel>(
		model: TValueModel,
		definitionContext: DefinitionContext
	): ValueModelContext<TValueModel> {
		return new ValueModelContext(model, definitionContext);
	}

	public readonly onValueChanged = new SimpleEvent<Path>();

	private constructor(public readonly model: TValueModel, public readonly definitionContext: DefinitionContext) {}

	public getValue(): ReturnType<TValueModel['getDefaultValue']> {
		return this.model.path.read<ReturnType<TValueModel['getDefaultValue']>>(this.definitionContext.object);
	}

	public setValue(value: ReturnType<TValueModel['getDefaultValue']>) {
		this.model.path.write(this.definitionContext.object, value);
		this.onValueChanged.forward(this.model.path);
	}

	public getValueTypes(): string[] {
		return this.definitionContext.definitionModel.valueTypes;
	}

	public hasVariable(name: string, valueType: string): boolean {
		const variables = this.definitionContext.variablesProvider.getVariables();
		return variables.some(v => v.name === name && v.type === valueType);
	}

	public isVariableDuplicated(name: string): boolean {
		const variables = this.definitionContext.variablesProvider.getVariables();
		return variables.filter(v => v.name === name).length > 1;
	}

	public getVariables(valueType: string): ContextVariable[] {
		return this.definitionContext.variablesProvider.getVariables().filter(v => v.type === valueType);
	}

	public validate(): ValidationResult {
		return this.model.validate(this);
	}

	public createChildContext<TChildModel extends ValueModel<PropertyValue, object>>(
		childModel: TChildModel
	): ValueModelContext<TChildModel> {
		const context = ValueModelContext.create(childModel, this.definitionContext);
		context.onValueChanged.subscribe(path => this.onValueChanged.forward(path));
		return context;
	}
}
