import { ComponentType, Step } from 'sequential-workflow-model';
import { Path } from '../core/path';
import { StepModel } from '../model';
import { stringValueModel } from '../value-models';
import { PropertyModelBuilder } from './property-model-builder';
import { CircularDependencyDetector } from './circular-dependency-detector';
import { buildLabel } from '../core/label-builder';

const namePath = Path.create(['name']);

export class StepModelBuilder<TStep extends Step> {
	protected readonly circularDependencyDetector = new CircularDependencyDetector();
	private readonly nameBuilder = new PropertyModelBuilder<string>(namePath, this.circularDependencyDetector);
	private readonly propertyBuilder: PropertyModelBuilder[] = [];

	public constructor(protected readonly type: string, private readonly componentType: ComponentType) {
		if (!type) {
			throw new Error('Step type is empty');
		}
		if (!componentType) {
			throw new Error('Component type is empty');
		}
	}

	public name(): PropertyModelBuilder<string, TStep['properties']> {
		return this.nameBuilder;
	}

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
				stringValueModel({
					defaultValue: buildLabel(this.type),
					minLength: 1
				})
			);
		}
		return {
			type: this.type,
			componentType: this.componentType,
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
