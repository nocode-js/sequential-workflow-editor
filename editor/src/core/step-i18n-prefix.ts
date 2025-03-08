export function createStepI18nPrefix(stepType: string | null): string {
	return stepType ? `step.${stepType}.property:` : 'root.property:';
}
