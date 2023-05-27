import { Path } from '../core/path';

export class CircularDependencyDetector {
	private readonly dependencies: { source: Path; target: Path }[] = [];

	public check(source: Path, target: Path) {
		if (this.dependencies.some(dep => dep.source.equals(target) && dep.target.equals(source))) {
			throw new Error(`Circular dependency detected: ${source.toString()} <-> ${target.toString()}`);
		}

		this.dependencies.push({ source, target });
	}
}
