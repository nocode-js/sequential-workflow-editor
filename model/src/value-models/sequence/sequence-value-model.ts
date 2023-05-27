import { Sequence } from 'sequential-workflow-model';
import { ValueModel, ValueModelFactory } from '../../model';
import { Path } from '../../core/path';
import { ModelActivator } from '../../activator';

export interface SequenceValueModelConfiguration {
	sequence: string[];
}

export type SequenceValueModel = ValueModel<Sequence, SequenceValueModelConfiguration>;

export const sequenceValueModelId = 'sequence';

export function sequenceValueModel(configuration: SequenceValueModelConfiguration): ValueModelFactory<SequenceValueModel> {
	return (path: Path) => ({
		id: sequenceValueModelId,
		path,
		configuration,
		editorId: null,
		getDefaultValue(activator: ModelActivator): Sequence {
			return configuration.sequence.map(type => activator.activateStep(type));
		},
		getVariableDefinitions: () => null,
		validate: () => null
	});
}
