import {
	Dynamic,
	createBooleanValueModel,
	createStepModel,
	createDynamicValueModel,
	createStringValueModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface DynamicStepModel extends Step {
	type: 'dynamic';
	componentType: 'task';
	properties: {
		example: Dynamic<string | boolean>;
	};
}

export const dynamicStepModel = createStepModel<DynamicStepModel>('dynamic', 'task', step => {
	step.property('example').value(
		createDynamicValueModel({
			models: [createStringValueModel({}), createBooleanValueModel({})]
		})
	);
});
