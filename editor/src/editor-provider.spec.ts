import { createDefinitionModel, createRootModel } from 'sequential-workflow-editor-model';
import { EditorProvider } from './editor-provider';

describe('EditorProvider', () => {
	it('creates instance', () => {
		const definitionModel = createDefinitionModel(model => {
			model.root(
				createRootModel(() => {
					// empty model.
				})
			);
		});
		const provider = EditorProvider.create(definitionModel, {
			uidGenerator: () => '0x1'
		});

		expect(provider).toBeDefined();
	});
});
