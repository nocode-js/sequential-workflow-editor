import { ComponentType, Step } from 'sequential-workflow-model';
import { Path } from '../core/path';
import { StepModel, StepValidator } from '../model';
import { createStringValueModel } from '../value-models';
import { PropertyModelBuilder } from './property-model-builder';
import { CircularDependencyDetector } from './circular-dependency-detector';
import { buildLabel } from '../core/label-builder';

const namePath = Path.create(['name']);

export class StepModelBuilder<TStep extends Step> {
	protected readonly circularDependencyDetector = new CircularDependencyDetector();
	private _label?: string;
	private _description?: string;
	private _category?: string;
	private _toolbox = true;
	private _validator?: StepValidator;
	private readonly nameBuilder = new PropertyModelBuilder<string>(namePath, this.circularDependencyDetector);
	private readonly propertyBuilder: PropertyModelBuilder[] = [];

	public constructor(
		protected readonly type: string,
		private readonly componentType: ComponentType
	) {
		if (!type) {
			throw new Error('Step type is empty');
		}
		if (!componentType) {
			throw new Error('Component type is empty');
		}
	}

	/**
	 * Sets the label of the step. This field is used in the toolbox and the editor to display the step.
	 */
	public label(label: string): this {
		this._label = label;
		return this;
	}

	/**
	 * Sets the description of the step.
	 * @param description The description of the step.
	 * @example `builder.description('This step does something useful.');`
	 */
	public description(description: string): this {
		this._description = description;
		return this;
	}

	/**
	 * Sets the category of the step. This field is used in the toolbox to group steps.
	 * @param category The category of the step.
	 * @example `builder.category('Utilities');`
	 */
	public category(category: string): this {
		this._category = category;
		return this;
	}

	/**
	 * Sets whether the step should be displayed in the toolbox. Default is `true`.
	 * @param toolbox Whether the step should be displayed in the toolbox.
	 * @example `builder.toolbox(false);`
	 */
	public toolbox(toolbox: boolean): this {
		this._toolbox = toolbox;
		return this;
	}

	/**
	 * Sets the validator of the step.
	 * @param validator The validator.
	 */
	public validator(validator: StepValidator): this {
		this._validator = validator;
		return this;
	}

	/**
	 * @returns The builder for the `name` property.
	 * @example `builder.name().value(createStringValueModel({ defaultValue: 'Some name' })).label('Name');`
	 */
	public name(): PropertyModelBuilder<string, TStep['properties']> {
		return this.nameBuilder;
	}

	/**
	 * @param propertyName Name of the property in the step.
	 * @returns The builder for the property.
	 * @example `builder.property('foo').value(createStringValueModel({ defaultValue: 'Some value' })).label('Foo');`
	 */
	public property<Key extends keyof TStep['properties']>(
		propertyName: Key
	): PropertyModelBuilder<TStep['properties'][Key], TStep['properties']> {
		const path = Path.create(['properties', String(propertyName)]);
		const builder = new PropertyModelBuilder<TStep['properties'][Key], TStep['properties']>(path, this.circularDependencyDetector);
		this.propertyBuilder.push(builder);
		return builder;
	}

	public build(): StepModel {
		if (!this.nameBuilder.hasValue()) {
			this.nameBuilder.value(
				createStringValueModel({
					defaultValue: buildLabel(this.type),
					minLength: 1
				})
			);
		}
		return {
			type: this.type,
			componentType: this.componentType,
			label: this._label ?? buildLabel(this.type),
			category: this._category,
			description: this._description,
			toolbox: this._toolbox,
			validator: this._validator,
			name: this.nameBuilder.build(),
			properties: this.propertyBuilder.map(builder => builder.build())
		};
	}
}

export function createStepModel<TStep extends Step>(
	type: TStep['type'],
	componentType: TStep['componentType'],
	build: (builder: StepModelBuilder<TStep>) => void
): StepModel {
	const builder = new StepModelBuilder<TStep>(type, componentType);
	build(builder);
	return builder.build();
}
