import { ModelActivator } from '../activator';
import { createDefinitionModelStub } from './definition-model-stub';

export function createModelActivatorStub(): ModelActivator {
	let index = 0;
	return ModelActivator.create(createDefinitionModelStub(), () => `0x${index++}`);
}
