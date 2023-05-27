const SEPARATOR = '/';

export class Path {
	public static create(path: string[] | string): Path {
		if (typeof path === 'string') {
			path = path.split(SEPARATOR);
		}
		return new Path(path);
	}

	public static root(): Path {
		return new Path([]);
	}

	private constructor(public readonly parts: string[]) {}

	public read<TValue = unknown>(object: object): TValue {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let result = object as any;
		for (const part of this.parts) {
			result = result[part];
			if (result === undefined) {
				throw new Error(`Cannot read path: ${this.parts.join(SEPARATOR)}`);
			}
		}
		return result as TValue;
	}

	public write<TValue = unknown>(object: object, value: TValue) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let result = object as any;
		for (let i = 0; i < this.parts.length - 1; i++) {
			result = result[this.parts[i]];
			if (result === undefined) {
				throw new Error(`Cannot write path: ${this.toString()}`);
			}
		}
		result[this.last()] = value;
	}

	public equals(other: Path | string): boolean {
		if (typeof other === 'string') {
			other = Path.create(other);
		}
		return this.parts.length === other.parts.length && this.startsWith(other);
	}

	public add(part: string): Path {
		return new Path([...this.parts, part]);
	}

	public last(): string {
		if (this.parts.length === 0) {
			throw new Error('Root path has no last part');
		}
		return this.parts[this.parts.length - 1];
	}

	public startsWith(other: Path | string): boolean {
		if (typeof other === 'string') {
			other = Path.create(other);
		}

		if (this.parts.length < other.parts.length) {
			return false;
		}
		for (let i = 0; i < other.parts.length; i++) {
			if (this.parts[i] !== other.parts[i]) {
				return false;
			}
		}
		return true;
	}

	public toString(): string {
		return this.parts.join(SEPARATOR);
	}
}
