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
	});
});
