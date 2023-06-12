import { Path } from '../core';
import { DefinitionModel } from '../model';

export function createDefinitionModelStub(): DefinitionModel {
	return {
		root: {
			properties: [],
			sequence: {
				dependencies: [],
				name: 'stub',
				label: 'Stub sequence',
				value: {
					id: 'stub',
					label: 'Stub',
					path: Path.create(['sequence']),
					configuration: {},
					getDefaultValue: () => [],
					getVariableDefinitions: () => null,
					validate: () => null
				}
			}
		},
		steps: {},
		valueTypes: []
	};
}
