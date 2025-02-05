export interface ChoiceValueModelConfiguration<TValue extends string = string> {
	/**
	 * Label. If not provided, the label is generated from the property name.
	 */
	label?: string;
	/**
	 * Supported choices.
	 */
	choices: TValue[];
	/**
	 * Default value.
	 */
	defaultValue?: TValue;
	/**
	 * Custom editor ID.
	 */
	editorId?: string;
}
