import { Branches, Sequence } from 'sequential-workflow-model';
import { ValueModel, ValueModelFactory } from '../../model';
import { Path } from '../../core/path';
import { ModelActivator } from '../../activator';

export interface BranchesValueModelConfiguration {
	/**
	 * @description Branches of the branched step. Each branch is a list of step types.
	 */
	branches: Record<string, string[]>;
}

export type BranchesValueModel<TBranches extends Branches> = ValueModel<TBranches, BranchesValueModelConfiguration>;

type BranchesOf<TConfiguration extends BranchesValueModelConfiguration> = Record<keyof TConfiguration['branches'], Sequence>;

export const branchesValueModelId = 'workflow.branches';

export function branchesValueModel<TConfiguration extends BranchesValueModelConfiguration>(
	configuration: TConfiguration
): ValueModelFactory<BranchesValueModel<BranchesOf<TConfiguration>>> {
	return (path: Path) => ({
		id: branchesValueModelId,
		label: 'Branches',
		path,
		configuration,
		getDefaultValue(activator: ModelActivator): BranchesOf<TConfiguration> {
			const branches = Object.keys(configuration.branches).reduce<Branches>((result, branchName) => {
				result[branchName] = configuration.branches[branchName].map(type => activator.activateStep(type));
				return result;
			}, {});
			return branches as BranchesOf<TConfiguration>;
		},
		getVariableDefinitions: () => null,
		validate: () => null
	});
}
