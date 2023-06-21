import { StackedSimpleEvent } from './stacked-simple-event';

describe('StackedSimpleEvent', () => {
	let event: StackedSimpleEvent<number>;

	beforeEach(() => {
		event = new StackedSimpleEvent<number>();
	});

	it('should emit an event with a single value when a single value is pushed', done => {
		event.subscribe(values => {
			expect(values).toEqual([1]);
			done();
		});

		event.push(1);
	});

	it('should emit an event with multiple values when multiple values are pushed', done => {
		event.subscribe(values => {
			expect(values).toEqual([1, 2, 3]);
			done();
		});

		event.push(1);
		event.push(2);
		event.push(3);
	});
});
