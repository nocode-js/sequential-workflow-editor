import { NullableVariableDefinitionValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { rowComponent } from '../../components/row-component';
import { inputComponent } from '../../components/input-component';

export const nullableVariableDefinitionValueEditorId = 'nullableVariableDefinition';

export function nullableVariableDefinitionValueEditor(
	context: ValueContext<NullableVariableDefinitionValueModel>
): ValueEditor<NullableVariableDefinitionValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	const startValue = context.getValue()?.name || '';
	const input = inputComponent(startValue);
	input.onChanged.subscribe(value => {
		context.setValue({
			name: value,
			type: context.model.configuration.valueType
		});
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
