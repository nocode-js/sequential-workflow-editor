import { createRootModel, sequenceValueModel, variableDefinitionsValueModel } from 'sequential-workflow-editor-model';
import { stepModels } from './step-models';

export const rootModel = createRootModel(root => {
	root.sequence().value(
		sequenceValueModel({
			sequence: stepModels.map(s => s.type)
		})
	);
	root.property('x').value(
		variableDefinitionsValueModel({
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
