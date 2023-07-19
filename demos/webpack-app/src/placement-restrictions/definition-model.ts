import {
	createDefinitionModel,
	createNumberValueModel,
	createSequentialStepModel,
	createStepModel,
	createStringValueModel
} from 'sequential-workflow-editor-model';
import { SequentialStep } from 'sequential-workflow-model';

export interface SocketStep extends SequentialStep {
	type: 'socket';
	componentType: 'container';
	properties: {
		ip: string;
		port: number;
	};
}

export interface WriteSocketStep extends SequentialStep {
	type: 'writeSocket';
	componentType: 'task';
	properties: {
		data: string;
	};
}

export const definitionModel = createDefinitionModel(model => {
	model.root(() => {
		//
	});
	model.steps([
		createSequentialStepModel<SocketStep>('socket', 'container', step => {
			step.property('ip').value(
				createStringValueModel({
					defaultValue: '127.0.0.1'
				})
			);
			step.property('port').value(
				createNumberValueModel({
					defaultValue: 5000
				})
			);
		}),
		createStepModel<WriteSocketStep>('writeSocket', 'task', step => {
			step.property('data').value(
				createStringValueModel({
					defaultValue: 'Hello World!'
				})
			);

			step.validator({
				validate(context) {
					const parentTypes = context.getParentStepTypes();
					return parentTypes.includes('socket') ? null : 'The write socket step must be inside a socket.';
				}
			});
		})
	]);
});
