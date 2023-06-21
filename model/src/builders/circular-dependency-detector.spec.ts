import { Path } from '../core/path';
import { CircularDependencyDetector } from './circular-dependency-detector';

describe('CircularDependencyDetector', () => {
	let detector: CircularDependencyDetector;

	beforeEach(() => {
		detector = new CircularDependencyDetector();
	});

	it('detects circular dependency', () => {
		detector.check(Path.create('pink'), Path.create('red'));

		expect(() => detector.check(Path.create('red'), Path.create('pink'))).toThrowError(
			'It is not allowed to depend on dependency with dependency: red <-> pink'
		);
	});

	it('detects when try to depend on dependency with dependency', () => {
		const a = () => detector.check(Path.create('white'), Path.create('gray'));
		const b = () => detector.check(Path.create('black'), Path.create('white'));
		const c = () => detector.check(Path.create('red'), Path.create('black'));

		const expectedError = 'It is not allowed to depend on dependency with dependency';
		expect(() => {
			a();
			b();
			c();
		}).toThrowError(expectedError);

		expect(() => {
			c();
			a();
			b();
		}).toThrowError(expectedError);

		expect(() => {
			c();
			b();
			a();
		}).toThrowError(expectedError);
	});

	it('does not throw error if there is no circular dependency', () => {
		detector.check(Path.create('green'), Path.create('blue'));
		detector.check(Path.create('green'), Path.create('violet'));
		detector.check(Path.create('red'), Path.create('violet'));
		detector.check(Path.create('black'), Path.create('white'));
	});
});
