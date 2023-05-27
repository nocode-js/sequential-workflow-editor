import { Step } from 'sequential-workflow-model';
import { createStepModel } from './step-model-builder';

interface BlueStep extends Step {
	type: 'blue';
	properties: {
		red: string;
		pink: string;
	};
}

describe('StepModelBuilder', () => {
	it('throws error when circular dependency is detected', () => {
		expect(() => {
			createStepModel<BlueStep>('blue', 'component', builder => {
				builder.property('pink').dependentProperty('red');
				builder.property('red').dependentProperty('pink');
			});
		}).toThrowError('Circular dependency detected: properties/red <-> properties/pink');
	});
});
