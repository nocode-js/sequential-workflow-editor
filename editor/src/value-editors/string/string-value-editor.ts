import { StringValueModel, ValueModelContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { rowComponent } from '../../components/row-component';
import { inputComponent } from '../../components/input-component';

export const stringValueEditorId = 'string';

export function stringValueEditor(context: ValueModelContext<StringValueModel>): ValueEditor<StringValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	const startValue = context.getValue();
	const input = inputComponent(startValue);
	input.onChanged.subscribe(value => {
		context.setValue(value);
		validate();
	});

	const row = rowComponent([input.view]);

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view,
		validate
	};
}
