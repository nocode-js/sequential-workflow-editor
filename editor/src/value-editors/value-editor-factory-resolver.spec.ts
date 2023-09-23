import { ValueEditorFactoryResolver } from './value-editor-factory-resolver';

describe('ValueEditorFactoryResolver', () => {
	describe('default', () => {
		const resolver = ValueEditorFactoryResolver.create();

		describe('resolve()', () => {
			it('resolves string', () => {
				const factory = resolver.resolve('string', undefined);
				expect(factory).toBeDefined();
			});

			it('throws error when editor is not found', () => {
				expect(() => resolver.resolve('some_unknown_mode_id', undefined)).toThrowError(
					'Editor id some_unknown_mode_id is not supported'
				);
			});
		});

		describe('isHidden()', () => {
			it('string is not hidden', () => {
				const is = resolver.isHidden('string', undefined);
				expect(is).toBe(false);
			});

			it('"branches" editor is hidden', () => {
				const is = resolver.isHidden('branches', undefined);
				expect(is).toBe(true);
			});

			it('throws error when editor is not found', () => {
				expect(() => resolver.isHidden('some_unknown_mode_id', undefined)).toThrowError(
					'Editor id some_unknown_mode_id is not supported'
				);
			});
		});
	});
});
