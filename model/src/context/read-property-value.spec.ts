import { Path } from '../core';
import { PropertyModel } from '../model';
import { readPropertyValue } from './read-property-value';

describe('readPropertyValue', () => {
	const model = {
		dependencies: [Path.create('properties/blue'), Path.create('properties/green')]
	} as unknown as PropertyModel;
	const object = {
		properties: {
			blue: 1,
			green: {
				red: 2
			},
			black: 3
		}
	};

	it('reads correctly', () => {
		const blue = readPropertyValue('blue', model, object);
		expect(blue).toBe(1);

		const green = readPropertyValue('green', model, object);
		expect(green).toEqual({ red: 2 });
	});

	it('throws error if property is not registered as dependency', () => {
		expect(() => readPropertyValue('black', model, object)).toThrowError('Property black is not registered as dependency');
	});
});
