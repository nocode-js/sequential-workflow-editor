import { Sequence } from 'sequential-workflow-model';
import { ValueModel, ValueModelFactoryFromModel } from '../../model';
import { Path } from '../../core/path';
import { DefaultValueContext } from '../../context/default-value-context';

export interface SequenceValueModelConfiguration {
	sequence: string[];
}

export type SequenceValueModel = ValueModel<Sequence, SequenceValueModelConfiguration>;

export const sequenceValueModelId = 'sequence';

export const createSequenceValueModel = (
	configuration: SequenceValueModelConfiguration
): ValueModelFactoryFromModel<SequenceValueModel> => ({
	create: (path: Path) => ({
		id: sequenceValueModelId,
		label: 'Sequence',
		path,
		configuration,
		getDefaultValue(context: DefaultValueContext): Sequence {
			return configuration.sequence.map(type => context.activateStep(type));
		},
		getVariableDefinitions: () => null,
		validate: () => null
	})
});
