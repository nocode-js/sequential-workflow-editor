import { Branches } from 'sequential-workflow-model';
import { createValueContextStub } from '../../test-tools/value-context-stub';
import { BranchesValueModel } from './branches-value-model';
import { branchesValueModelValidator } from './branches-value-model-validator';

describe('branchesValueModelValidator', () => {
	it('returns "No branches defined" if there is not any branch', () => {
		const context = createValueContextStub<BranchesValueModel<Branches>>(
			{},
			{
				branches: {}
			}
		);
		const error = branchesValueModelValidator(context);
		expect(error?.$).toBe('No branches defined');
	});

	it('returns "Missing branch" if branch is missing', () => {
		const context = createValueContextStub<BranchesValueModel<Branches>>(
			{
				true: [],
				zero: []
			},
			{
				branches: {
					true: [],
					false: []
				}
			}
		);
		const error = branchesValueModelValidator(context);
		expect(error?.$).toBe('Missing branch: false');
	});

	it('returns "Invalid number of branches" if there is more branches', () => {
		const context = createValueContextStub<BranchesValueModel<Branches>>(
			{
				true: [],
				false: [],
				error: []
			},
			{
				branches: {
					true: [],
					false: []
				}
			}
		);
		const error = branchesValueModelValidator(context);
		expect(error?.$).toBe('Invalid number of branches');
	});

	it('returns "The value must be object" if there is not any branch', () => {
		const context = createValueContextStub<BranchesValueModel<Branches>>(1234567890, {
			branches: {
				true: [],
				false: []
			}
		});
		const error = branchesValueModelValidator(context);
		expect(error?.$).toBe('The value must be object');
	});

	it('returns null if there is valid branches', () => {
		const context = createValueContextStub<BranchesValueModel<Branches>>(
			{
				true: [],
				false: []
			},
			{
				branches: {
					true: [],
					false: []
				}
			}
		);
		const error = branchesValueModelValidator(context);
		expect(error).toBeNull();
	});
});
