import { createRootModel, createSequenceValueModel, createVariableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { stepModels } from './step-models';

export const rootModel = createRootModel(root => {
	root.sequence().value(
		createSequenceValueModel({
			sequence: stepModels.map(s => s.type)
		})
	);
	root.property('x').value(
		createVariableDefinitionsValueModel({
			defaultValue: {
				variables: [
					{
						name: 'counter',
						type: 'number'
					},
					{
						name: 'userName',
						type: 'string'
					},
					{
						name: 'isEnabled',
						type: 'boolean'
					}
				]
			}
		})
	);
});
