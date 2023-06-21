import { SequentialStep } from 'sequential-workflow-model';
import { MyDefinition } from './model/definition-model';
import { RawInputData } from './playground';
import { AppState } from './storage';

const definition: MyDefinition = {
	properties: {
		inputs: { variables: [{ name: 'loops', type: 'number' }] },
		outputs: { variables: [{ name: 'message', type: 'string' }] }
	},
	sequence: [
		{
			id: 'a282bc1908816678905a3c94049478aa',
			name: '$index < $loops',
			type: 'loop',
			componentType: 'container',
			properties: {
				from: { modelId: 'number', value: 0 },
				operator: '<',
				to: { modelId: 'nullableVariable', value: { name: 'loops' } },
				increment: { modelId: 'number', value: 1 },
				indexVariable: { name: 'index', type: 'number' },
				variables: { variables: [{ name: 'remainder', type: 'number' }] }
			},
			sequence: [
				{
					id: '32529a3fbef39d5e480df8454164edae',
					name: '$remainder = $index % 2',
					type: 'calculate',
					componentType: 'task',
					properties: {
						a: { modelId: 'nullableVariable', value: { name: 'index' } },
						operator: '%',
						b: { modelId: 'number', value: 2 },
						result: { name: 'remainder' }
					}
				},
				{
					id: 'f2f35f162f009e7683cf31c24a1e9589',
					name: 'If $remainder == 0',
					type: 'if',
					componentType: 'switch',
					properties: {
						a: { modelId: 'nullableAnyVariable', value: { name: 'remainder', type: 'number' } },
						operator: '==',
						b: { modelId: 'number', value: 0 }
					},
					branches: {
						true: [
							{
								id: '2cfa6c319e150facd7e43841beca33cb',
								name: 'print true 🌺',
								type: 'log',
								componentType: 'task',
								properties: {
									message: { modelId: 'string', value: '🌺 TRUE 🌺' },
									variables: { variables: [{ name: 'index', type: 'number' }] },
									note: { modelId: 'string', value: '0!' }
								}
							}
						],
						false: [
							{
								id: '9646bc44d1d07898bcdc240c5b3ce198',
								name: 'print false 🌼',
								type: 'log',
								componentType: 'task',
								properties: {
									message: { modelId: 'string', value: '🌼 FALSE 🌼' },
									variables: { variables: [{ name: 'index', type: 'number' }] },
									note: { modelId: 'generatedString', value: 'Dumped 1 variables' }
								}
							}
						]
					}
				}
			]
		} as SequentialStep,
		{
			id: '0a0278f55466c980fcd35d778dc679f4',
			name: 'set output',
			type: 'setStringValue',
			componentType: 'task',
			properties: { variable: { name: 'message' }, value: { modelId: 'string', value: 'Done!' } }
		}
	]
};

const inputData: RawInputData = {
	loops: '2'
};

export const defaultAppState: AppState = {
	definition,
	inputData
};
