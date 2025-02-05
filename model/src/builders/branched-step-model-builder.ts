import { BranchedStep, Branches } from 'sequential-workflow-model';
import { StepModelBuilder } from './step-model-builder';
import { StepModel } from '../model';
import { Path } from '../core/path';
import { PropertyModelBuilder } from './property-model-builder';

const branchesPath = Path.create('branches');

export class BranchedStepModelBuilder<TStep extends BranchedStep> extends StepModelBuilder<TStep> {
	private readonly branchesBuilder = new PropertyModelBuilder<Branches>(branchesPath, this.circularDependencyDetector);

	/**
	 * @returns the builder for the branches property.
	 * @example `builder.branches().value(createBranchesValueModel(...));`
	 */
	public branches(): PropertyModelBuilder<Branches, TStep['properties']> {
		return this.branchesBuilder;
	}

	public build(): StepModel {
		if (!this.branchesBuilder.hasValue()) {
			throw new Error(`Branches configuration is not set for ${this.type}`);
		}

		const model = super.build();
		model.properties.push(this.branchesBuilder.build());
		return model;
	}
}

export function createBranchedStepModel<TStep extends BranchedStep>(
	type: TStep['type'],
	componentType: TStep['componentType'],
	build: (builder: BranchedStepModelBuilder<TStep>) => void
): StepModel {
	const builder = new BranchedStepModelBuilder<TStep>(type, componentType);
	build(builder);
	return builder.build();
}
