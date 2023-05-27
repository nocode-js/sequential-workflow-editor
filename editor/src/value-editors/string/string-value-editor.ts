import { StringValueModel, ValueModelContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { Html } from '../../core/html';
import { rowComponent } from '../../components/row-component';

export const stringValueEditorId = 'string';

export function stringValueEditor(context: ValueModelContext<StringValueModel>): ValueEditor<StringValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	const input = Html.element('input', {
		class: 'swe-input swe-stretched',
		type: 'text'
	});
	input.value = context.getValue();

	input.addEventListener('input', () => {
		context.setValue(input.value);
		validate();
	});

	const row = rowComponent([input]);

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view,
		validate
	};
}
