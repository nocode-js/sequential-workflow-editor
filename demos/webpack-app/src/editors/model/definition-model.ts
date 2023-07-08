import { createDefinitionModel } from 'sequential-workflow-editor-model';
import { stepModels } from './step-models';
import { rootModel } from './root-model';

export const definitionModel = createDefinitionModel(model => {
	model.valueTypes(['string', 'number', 'boolean']);
	model.root(rootModel);
	model.steps(stepModels);
});
