import { Definition, DefinitionWalker, Step } from 'sequential-workflow-model';
import { createDefinitionModel, createRootModel, createStepModel } from '../builders';
import { createNumberValueModel } from '../value-models';
import { DefinitionValidator } from './definition-validator';
import { defaultI18n } from '../i18n';

interface FooDefinition extends Definition {
	properties: {
		velocity: number;
	};
}

interface FooStep extends Step {
	properties: {
		delta: number;
	};
}

describe('DefinitionValidator', () => {
	const model = createDefinitionModel<FooDefinition>(builder => {
		builder.root(
			createRootModel(root => {
				root.property('velocity').value(
					createNumberValueModel({
						min: 0
					})
				);
			})
		);

		builder.step(
			createStepModel<FooStep>('move', 'task', step => {
				step.property('delta').value(
					createNumberValueModel({
						max: 0
					})
				);
			})
		);
	});
	const walker = new DefinitionWalker();
	const validator = DefinitionValidator.create(model, walker, defaultI18n);

	it('returns error when root is invalid', () => {
		const def: FooDefinition = {
			sequence: [],
			properties: {
				velocity: -1 // invalid
			}
		};

		const error = validator.validate(def);

		expect(error?.stepId).toEqual(null);
		expect(error?.propertyPath.toString()).toEqual('properties/velocity');
		expect(error?.error.$).toEqual('The value must be at least 0');
	});

	it('returns error when step has invalid delta value', () => {
		const def: FooDefinition = {
			sequence: [
				{
					type: 'move',
					componentType: 'task',
					id: '0x000000',
					name: 'Correct',
					properties: {
						delta: -100
					}
				},
				{
					type: 'move',
					componentType: 'task',
					id: '0xFFFFFF',
					name: 'Invalid!',
					properties: {
						delta: 1 // invalid
					}
				}
			],
			properties: {
				velocity: 100
			}
		};

		const error = validator.validate(def);

		expect(error?.stepId).toEqual('0xFFFFFF');
		expect(error?.propertyPath.toString()).toEqual('properties/delta');
		expect(error?.error.$).toEqual('The value must be at most 0');
	});

	it('returns error when step has invalid name', () => {
		const def: FooDefinition = {
			sequence: [
				{
					type: 'move',
					componentType: 'task',
					id: '0xAAAAAA',
					name: '', // invalid
					properties: {
						delta: 1
					}
				}
			],
			properties: {
				velocity: 100
			}
		};

		const error = validator.validate(def);

		expect(error?.stepId).toEqual('0xAAAAAA');
		expect(error?.propertyPath.toString()).toEqual('name');
		expect(error?.error.$).toEqual('The value must be at least 1 characters long');
	});

	it('returns null when definition is valid', () => {
		const def: FooDefinition = {
			sequence: [
				{
					type: 'move',
					componentType: 'task',
					id: '0x000000',
					name: 'Right',
					properties: {
						delta: -100
					}
				}
			],
			properties: {
				velocity: 100
			}
		};

		const error = validator.validate(def);

		expect(error).toBeNull();
	});

	it('throws error when step type is not supported', () => {
		const def: FooDefinition = {
			sequence: [
				{
					type: 'not_supported_type',
					componentType: 'task',
					id: '0x000000',
					name: 'Right',
					properties: {}
				}
			],
			properties: {
				velocity: 100
			}
		};

		expect(() => validator.validate(def)).toThrowError('Cannot find model for step type: not_supported_type');
	});
});
