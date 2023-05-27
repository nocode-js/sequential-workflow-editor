import { VariableDefinitions, createDefinitionModel } from 'sequential-workflow-editor-model';
import { rootModel } from './root-model';
import { dumpVariablesStepModel } from './dump-variables-step-model';
import { logStepModel } from './log-step-model';
import { loopStepModel } from './loop-step-model';
import { setStringValueModel } from './set-string-value-model';
import { Definition } from 'sequential-workflow-model';

export interface MyDefinition extends Definition {
	properties: {
		inputs: VariableDefinitions;
		outputs: VariableDefinitions;
	};
}

export const definitionModel = createDefinitionModel<MyDefinition>(model => {
	model.valueTypes(['string', 'number']);
	model.root(rootModel);
	model.steps([dumpVariablesStepModel, logStepModel, loopStepModel, setStringValueModel]);
});
