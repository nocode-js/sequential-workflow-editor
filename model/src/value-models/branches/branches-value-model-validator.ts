import { Branches } from 'sequential-workflow-model';
import { BranchesValueModel } from './branches-value-model';
import { ValueContext } from '../../context';
import { ValidationResult, createValidationSingleError } from '../../model';

export function branchesValueModelValidator<TBranches extends Branches>(
	context: ValueContext<BranchesValueModel<TBranches>>
): ValidationResult {
	const configuration = context.model.configuration;
	const branches = context.getValue();

	if (typeof branches !== 'object') {
		return createValidationSingleError(context.i18n('branches.mustBeObject', 'The value must be object'));
	}
	const branchNames = Object.keys(branches);
	if (branchNames.length === 0) {
		return createValidationSingleError(context.i18n('branches.empty', 'No branches defined'));
	}
	if (!configuration.dynamic) {
		const configurationBranchNames = Object.keys(configuration.branches);
		if (branchNames.length !== configurationBranchNames.length) {
			return createValidationSingleError(context.i18n('branches.invalidLength', 'Invalid number of branches'));
		}
		const missingBranchName = configurationBranchNames.find(branchName => !branchNames.includes(branchName));
		if (missingBranchName) {
			return createValidationSingleError(
				context.i18n('branches.missingBranch', 'Missing branch: :name', { name: missingBranchName })
			);
		}
	}
	return null;
}
