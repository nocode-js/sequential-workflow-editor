import {
	Dynamic,
	createBooleanValueModel,
	createStepModel,
	createDynamicValueModel,
	createStringValueModel,
	StringDictionary,
	createStringDictionaryValueModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface DynamicStepModel extends Step {
	type: 'dynamic';
	componentType: 'task';
	properties: {
		example: Dynamic<string | boolean>;
		twoHeaderControls: Dynamic<StringDictionary | string>;
	};
}

export const dynamicStepModel = createStepModel<DynamicStepModel>('dynamic', 'task', step => {
	step.property('example').value(
		createDynamicValueModel({
			models: [createStringValueModel({}), createBooleanValueModel({})]
		})
	);

	step.property('twoHeaderControls').value(
		createDynamicValueModel({
			models: [createStringDictionaryValueModel({}), createStringValueModel({})]
		})
	);
});
