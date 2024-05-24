export type I18n = (key: string, defaultValue: string, replacements?: Record<string, string>) => string;

export const defaultI18n: I18n = (_, defaultValue, replacements) => {
	if (replacements) {
		let result = defaultValue;
		Object.keys(replacements).forEach(key => {
			result = result.replace(':' + key, replacements[key]);
		});
		return result;
	}
	return defaultValue;
};
