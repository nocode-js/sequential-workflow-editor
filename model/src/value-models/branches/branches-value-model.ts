import { Branches, Sequence } from 'sequential-workflow-model';
import { ValueModel, ValueModelFactoryFromModel } from '../../model';
import { Path } from '../../core/path';
import { DefaultValueContext } from '../../context/default-value-context';

export interface BranchesValueModelConfiguration {
	/**
	 * @description Branches of the branched step. Each branch is a list of step types.
	 */
	branches: Record<string, string[]>;
}

export type BranchesValueModel<TBranches extends Branches> = ValueModel<TBranches, BranchesValueModelConfiguration>;

type BranchesOf<TConfiguration extends BranchesValueModelConfiguration> = Record<keyof TConfiguration['branches'], Sequence>;

export const branchesValueModelId = 'branches';

export const createBranchesValueModel = <TConfiguration extends BranchesValueModelConfiguration>(
	configuration: TConfiguration
): ValueModelFactoryFromModel<BranchesValueModel<BranchesOf<TConfiguration>>> => ({
	create: (path: Path) => ({
		id: branchesValueModelId,
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
		validate: () => null
	})
});
