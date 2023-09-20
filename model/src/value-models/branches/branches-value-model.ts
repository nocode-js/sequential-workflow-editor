import { Branches, Sequence } from 'sequential-workflow-model';
import { ValueModel, ValueModelFactoryFromModel } from '../../model';
import { Path } from '../../core/path';
import { DefaultValueContext } from '../../context/default-value-context';
import { BranchesValueModelConfiguration } from './branches-value-model-configuration';
import { branchesValueModelValidator } from './branches-value-model-validator';

export type BranchesValueModel<TBranches extends Branches> = ValueModel<TBranches, BranchesValueModelConfiguration>;

type BranchesOf<TConfiguration extends BranchesValueModelConfiguration> = Record<keyof TConfiguration['branches'], Sequence>;

export const branchesValueModelId = 'branches';

export const createBranchesValueModel = <TConfiguration extends BranchesValueModelConfiguration>(
	configuration: TConfiguration
): ValueModelFactoryFromModel<BranchesValueModel<BranchesOf<TConfiguration>>> => ({
	create: (path: Path) => ({
		id: branchesValueModelId,
		editorId: configuration.editorId,
		label: 'Branches',
		path,
		configuration,
		getDefaultValue(context: DefaultValueContext): BranchesOf<TConfiguration> {
			const branches = Object.keys(configuration.branches).reduce<Branches>((result, branchName) => {
				result[branchName] = configuration.branches[branchName].map(type => context.activateStep(type));
				return result;
			}, {});
			return branches as BranchesOf<TConfiguration>;
		},
		getVariableDefinitions: () => null,
		validate: branchesValueModelValidator
	})
});
