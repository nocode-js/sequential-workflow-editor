import { Path } from '../core/path';

export class CircularDependencyDetector {
	private readonly dependencies: { source: Path; target: Path }[] = [];

	public check(source: Path, target: Path) {
		if (this.dependencies.some(dep => dep.source.equals(target))) {
			throw new Error(`It is not allowed to depend on dependency with dependency: ${source.toString()} <-> ${target.toString()}`);
		}

		this.dependencies.push({ source, target });
	}
}
