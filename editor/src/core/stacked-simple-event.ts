import { SimpleEvent, SimpleEventListener } from 'sequential-workflow-editor-model';

export class StackedSimpleEvent<T> {
	private readonly event = new SimpleEvent<T[]>();

	private readonly stack: T[] = [];
	private to: ReturnType<typeof setTimeout> | null = null;

	public push(value: T) {
		this.stack.push(value);

		if (this.to) {
			return;
		}

		this.to = setTimeout(() => {
			this.to = null;
			this.event.forward(this.stack);
			this.stack.length = 0;
		});
	}

	public subscribe(listener: SimpleEventListener<T[]>) {
		this.event.subscribe(listener);
	}
}
