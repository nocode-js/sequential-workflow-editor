export interface BranchesValueModelConfiguration {
	/**
	 * @description Branches of the branched step. Each branch is a list of step types.
	 */
	branches: Record<string, string[]>;

	/**
	 * @description If true, the branches are dynamic and can be changed by the user.
	 */
	dynamic?: boolean;

	/**
	 * @description Override the default editor for the branches.
	 */
	editorId?: string;
}
