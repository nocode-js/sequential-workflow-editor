import { I18n, SimpleEvent, ValueContext } from 'sequential-workflow-editor-model';
import { Html } from '../core/html';
import { dynamicListComponent } from './dynamic-list-component';

interface TestItem {
	id: number;
}

function testItemComponentFactory(item: TestItem, _: I18n, index: number) {
	const view = Html.element('span', {
		class: `test-item-${item.id}`
	});
	view.setAttribute('data-index', String(index));
	return {
		view,
		onItemChanged: new SimpleEvent<TestItem>(),
		onDeleteClicked: new SimpleEvent<void>(),
		validate: () => {
			/* ... */
		}
	};
}

describe('DynamicListComponent', () => {
	const context = {
		validate() {
			return null;
		}
	} as ValueContext;

	it('starts with initial items', () => {
		const component = dynamicListComponent([{ id: 123 }, { id: 456 }], testItemComponentFactory, context);
		const children = component.view.children;

		expect(children.length).toBe(3);
		expect(children[0].className).toBe('test-item-123');
		expect(children[0].getAttribute('data-index')).toBe('0');
		expect(children[1].className).toBe('test-item-456');
		expect(children[1].getAttribute('data-index')).toBe('1');
		expect(children[2].className).toBe('swe-validation-error');
	});

	it('adds new items', () => {
		const component = dynamicListComponent([], testItemComponentFactory, context);
		const children = component.view.children;

		expect(children.length).toBe(1);
		expect(children[0].className).toBe('swe-validation-error');

		component.add({ id: 135 });

		expect(children.length).toBe(2);
		expect(children[0].className).toBe('test-item-135');
		expect(children[0].getAttribute('data-index')).toBe('0');
		expect(children[1].className).toBe('swe-validation-error');

		component.add({ id: 246 });

		expect(children.length).toBe(3);
		expect(children[0].className).toBe('test-item-135');
		expect(children[0].getAttribute('data-index')).toBe('0');
		expect(children[1].className).toBe('test-item-246');
		expect(children[1].getAttribute('data-index')).toBe('1');
		expect(children[2].className).toBe('swe-validation-error');
	});

	it('shows empty message, when items appear, then message disappears', () => {
		const component = dynamicListComponent([], testItemComponentFactory, context, {
			emptyMessage: 'List is empty'
		});
		const children = component.view.children;

		expect(children.length).toBe(2);
		expect(children[0].textContent).toBe('List is empty');
		expect(children[1].className).toBe('swe-validation-error');

		component.add({ id: 543 });

		expect(children.length).toBe(2);
		expect(children[0].className).toBe('test-item-543');
		expect(children[1].className).toBe('swe-validation-error');
	});
});
