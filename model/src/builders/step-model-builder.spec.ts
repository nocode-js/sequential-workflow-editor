import { Step } from 'sequential-workflow-model';
import { createStepModel } from './step-model-builder';
import { StepValidator } from '../model';
import { createNumberValueModel, createStringValueModel } from '../value-models';

interface BlueStep extends Step {
	type: 'blue';
	properties: {
		red: string;
		pink: number;
	};
}

describe('StepModelBuilder', () => {
	it('throws error when circular dependency is detected', () => {
		expect(() => {
			createStepModel<BlueStep>('blue', 'component', builder => {
				builder.property('pink').dependentProperty('red');
				builder.property('red').dependentProperty('pink');
			});
		}).toThrowError('It is not allowed to depend on dependency with dependency: properties/red <-> properties/pink');
	});

	it('sets default value mode for name if not specified', () => {
		const model = createStepModel<BlueStep>('blue', 'component', () => {
			/* ... */
		});

		expect(model.name.path.toString()).toBe('name');
		expect(model.name.value.id).toBe('string');
	});

	it('creates model correctly', () => {
		const validator: StepValidator = {
			validate: () => null
		};

		const model = createStepModel<BlueStep>('blue', 'component', builder => {
			builder.category('Some category');
			builder.description('Some description');
			builder.label('Some label');
			builder.validator(validator);
			builder.name().value(createStringValueModel({}));
			builder.property('red').value(createStringValueModel({}));
			builder.property('pink').value(createNumberValueModel({}));
		});

		expect(model.category).toBe('Some category');
		expect(model.description).toBe('Some description');
		expect(model.label).toBe('Some label');
		expect(model.validator).toBe(validator);
		expect(model.name.path.toString()).toBe('name');
		expect(model.name.value.id).toBe('string');
		expect(model.properties[0].path.toString()).toBe('properties/red');
		expect(model.properties[0].value.id).toBe('string');
		expect(model.properties[1].path.toString()).toBe('properties/pink');
		expect(model.properties[1].value.id).toBe('number');
	});
});
