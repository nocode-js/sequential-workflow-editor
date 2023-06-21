import { NumberValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { validationErrorComponent } from '../../components/validation-error-component';
import { rowComponent } from '../../components/row-component';
import { inputComponent } from '../../components/input-component';

export const numberValueEditorId = 'number';

export function numberValueEditor(context: ValueContext<NumberValueModel>): ValueEditor<NumberValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	const startValue = String(context.getValue());
	const input = inputComponent(startValue, {
		type: 'number'
	});
	input.onChanged.subscribe(value => {
		const num = value.length > 0 ? Number(value) : NaN;
		context.setValue(num);
		validate();
	});

	const row = rowComponent([input.view]);

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view
	};
}
