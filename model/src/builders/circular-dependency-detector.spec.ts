import { Path } from '../core/path';
import { CircularDependencyDetector } from './circular-dependency-detector';

describe('CircularDependencyDetector', () => {
	let detector: CircularDependencyDetector;

	beforeEach(() => {
		detector = new CircularDependencyDetector();
	});

	it('detects circular dependency', () => {
		detector.check(Path.create('pink'), Path.create('red'));

		expect(() => detector.check(Path.create('red'), Path.create('pink'))).toThrowError('Circular dependency detected: red <-> pink');
	});

	it('does not throw error if there is no circular dependency', () => {
		detector.check(Path.create('green'), Path.create('blue'));
		detector.check(Path.create('green'), Path.create('violet'));
		detector.check(Path.create('red'), Path.create('violet'));
		detector.check(Path.create('black'), Path.create('white'));
	});
});
