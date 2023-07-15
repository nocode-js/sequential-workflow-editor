import { createDefinitionModel, createRootModel, createStepModel } from '../builders';
import { createNumberValueModel, createStringValueModel } from '../value-models';
import { ModelActivator } from './model-activator';
import { Definition, Step } from 'sequential-workflow-model';

interface TestDefinition extends Definition {
	properties: {
		size: number;
	};
}

interface TestStep extends Step {
	type: 'test';
	componentType: 'task';
	properties: {
		password: string;
	};
}

describe('ModelActivator', () => {
	const definitionModel = createDefinitionModel<TestDefinition>(model => {
		model.root(
			createRootModel<TestDefinition>(root => {
				root.property('size').value(
					createNumberValueModel({
						defaultValue: 20
					})
				);
			})
		);

		model.steps([
			createStepModel<TestStep>('test', 'task', step => {
				step.property('password').value(
					createStringValueModel({
						defaultValue: 'lorem ipsum'
					})
				);
			})
		]);
	});

	it('activates definition correctly', () => {
		const definition = ModelActivator.create(definitionModel, () => '1').activateDefinition();

		expect(definition.properties.size).toBe(20);
		expect(Array.isArray(definition.sequence)).toBe(true);
	});

	it('activates step correctly', () => {
		const uidGenerator = () => '321';
		const step = ModelActivator.create(definitionModel, uidGenerator).activateStep<TestStep>('test');

		expect(step.id).toBe('321');
		expect(step.type).toBe('test');
		expect(step.componentType).toBe('task');
		expect(step.name).toBe('Test');
		expect(step.properties.password).toBe('lorem ipsum');
	});
});
