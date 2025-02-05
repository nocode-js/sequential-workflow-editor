import { Sequence, SequentialStep } from 'sequential-workflow-model';
import { StepModelBuilder } from './step-model-builder';
import { createSequenceValueModel } from '../value-models';
import { Path } from '../core/path';
import { StepModel } from '../model';
import { PropertyModelBuilder } from './property-model-builder';

const sequencePath = Path.create('sequence');

export class SequentialStepModelBuilder<TStep extends SequentialStep> extends StepModelBuilder<TStep> {
	private readonly sequenceBuilder = new PropertyModelBuilder<Sequence, TStep['properties']>(
		sequencePath,
		this.circularDependencyDetector
	);

	/**
	 * @returns the builder for the sequence property.
	 * @example `builder.sequence().value(createSequenceValueModel(...));`
	 */
	public sequence(): PropertyModelBuilder<Sequence> {
		return this.sequenceBuilder;
	}

	public build(): StepModel {
		if (!this.sequenceBuilder.hasValue()) {
			this.sequenceBuilder.value(
				createSequenceValueModel({
					sequence: []
				})
			);
		}

		const model = super.build();
		model.properties.push(this.sequenceBuilder.build());
		return model;
	}
}

export function createSequentialStepModel<TStep extends SequentialStep>(
	type: TStep['type'],
	componentType: TStep['componentType'],
	build: (builder: SequentialStepModelBuilder<TStep>) => void
): StepModel {
	const builder = new SequentialStepModelBuilder<TStep>(type, componentType);
	build(builder);
	return builder.build();
}
