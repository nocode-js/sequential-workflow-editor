import { VariableDefinitions, createDefinitionModel } from 'sequential-workflow-editor-model';
import { rootModel } from './root-model';
import { logStepModel } from './log-step-model';
import { loopStepModel } from './loop-step-model';
import { setStringValueStepModel } from './set-string-value-step-model';
import { Definition } from 'sequential-workflow-model';
import { ifStepModel } from './if-step-model';
import { calculateStepModel } from './calculate-step-model';
import { convertValueStepModel } from './convert-value-step-model';

export interface MyDefinition extends Definition {
	properties: {
		inputs: VariableDefinitions;
		outputs: VariableDefinitions;
	};
}

export const definitionModel = createDefinitionModel<MyDefinition>(model => {
	model.valueTypes(['string', 'number']);
	model.root(rootModel);
	model.steps([calculateStepModel, convertValueStepModel, ifStepModel, logStepModel, loopStepModel, setStringValueStepModel]);
});
