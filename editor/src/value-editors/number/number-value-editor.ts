import { NumberValueModel, ValueModelContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { validationErrorComponent } from '../../components/validation-error-component';
import { Html } from '../../core/html';
import { rowComponent } from '../../components/row-component';

export const numberValueEditorId = 'number';

export function numberValueEditor(context: ValueModelContext<NumberValueModel>): ValueEditor<NumberValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	const input = Html.element('input', {
		class: 'swe-input swe-stretched',
		type: 'number'
	});
	input.value = String(context.getValue());

	const row = rowComponent([input]);

	input.addEventListener('input', () => {
		context.setValue(parseInt(input.value, 10));
		validate();
	});

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view,
		validate
	};
}
