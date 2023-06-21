import { Properties } from 'sequential-workflow-model';
import { Path } from '../core';
import { PropertyModel } from '../model';

export function readPropertyValue<TProperties extends Properties, Key extends keyof TProperties>(
	name: Key,
	model: PropertyModel,
	object: object
): TProperties[Key] {
	const nameStr = String(name);
	const path = Path.create(['properties', nameStr]);

	if (!model.dependencies.some(dep => dep.equals(path))) {
		throw new Error(`Property ${nameStr} is not registered as dependency`);
	}

	return path.read(object);
}
