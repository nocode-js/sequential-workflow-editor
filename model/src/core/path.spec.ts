import { Path } from './path';

describe('Path', () => {
	it('creates correctly', () => {
		const p1 = Path.create('a/b/c');

		expect(p1.parts[0]).toBe('a');
		expect(p1.parts[1]).toBe('b');
		expect(p1.parts[2]).toBe('c');
	});

	it('equals() returns correct value', () => {
		const abc = Path.create('a/b/c');
		expect(abc.equals('a/b')).toBe(false);
		expect(abc.equals('a/b/c')).toBe(true);
		expect(abc.equals('a')).toBe(false);
		expect(abc.equals('a/b/c/d')).toBe(false);
	});

	it('startWith() returns correct value', () => {
		const abc = Path.create('a/b/c');
		expect(abc.startsWith('a/b')).toBe(true);
		expect(abc.startsWith('a/b/c')).toBe(true);
		expect(abc.startsWith('a')).toBe(true);

		expect(abc.startsWith('a/b/c/d')).toBe(false);
		expect(abc.startsWith('a/q')).toBe(false);
		expect(abc.startsWith('q/w/e')).toBe(false);
		expect(abc.startsWith('q')).toBe(false);
	});

	it('write() writes correctly', () => {
		const obj = {
			a: {
				b: {
					c: 1
				}
			}
		};

		Path.create('a/b/c').write(obj, 2);
		Path.create('a/b/d').write(obj, 3);

		expect(obj.a.b.c).toBe(2);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((obj.a.b as any).d).toBe(3);
	});
});
