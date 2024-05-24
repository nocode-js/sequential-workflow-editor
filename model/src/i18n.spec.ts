import { defaultI18n } from './i18n';

describe('defaultI18n', () => {
	it('returns expected value', () => {
		expect(defaultI18n('key', 'test')).toBe('test');
		expect(
			defaultI18n('key', 'We need :min users', {
				min: '10'
			})
		).toBe('We need 10 users');
		expect(
			defaultI18n('key', 'Your name :name should have :n characters', {
				name: 'Alice',
				n: '4'
			})
		).toBe('Your name Alice should have 4 characters');
	});
});
