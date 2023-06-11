import { NullableVariableDefinitionValueModel, ValueModelContext } from 'sequential-workflow-editor-model';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { Html } from '../../core/html';
import { rowComponent } from '../../components/row-component';

export const nullableVariableDefinitionValueEditorId = 'nullableVariableDefinition';

export function nullableVariableDefinitionValueEditor(
	context: ValueModelContext<NullableVariableDefinitionValueModel>
): ValueEditor<NullableVariableDefinitionValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	const input = Html.element('input', {
		class: 'swe-input swe-stretched',
		type: 'text'
	});
	input.value = context.getValue()?.name || '';

	const row = rowComponent([input]);

	input.addEventListener('input', () => {
		context.setValue({
			name: input.value,
			type: context.model.configuration.valueType
		});
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
