import { Path } from '../core';
import { DefinitionModel } from '../model';

export function createDefinitionModelStub(): DefinitionModel {
	const path = Path.create(['sequence']);
	return {
		root: {
			properties: [],
			sequence: {
				path,
				dependencies: [],
				label: 'Stub sequence',
				value: {
					id: 'stub',
					label: 'Stub',
					path,
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
