import { NullableVariableValueModel, ValueModelContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { validationErrorComponent } from '../../components/validation-error-component';
import { rowComponent } from '../../components/row-component';
import { selectComponent } from '../../components/select-component';

export const nullableVariableValueEditorId = 'nullableVariable';

export function nullableVariableValueEditor(
	context: ValueModelContext<NullableVariableValueModel>
): ValueEditor<NullableVariableValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	function onChanged(selectedIndex: number) {
		if (selectedIndex === 0) {
			context.setValue(null);
		} else {
			context.setValue({
				name: variables[selectedIndex - 1].name
			});
		}
		validate();
	}

	const startValue = context.getValue();
	const variables = context.getVariables(context.model.configuration.variableType);

	const select = selectComponent({
		stretched: true
	});
	select.setValues([
		'- Select variable -',
		...variables.map(variable => {
			return variable.name;
		})
	]);
	if (startValue) {
		select.selectIndex(variables.findIndex(variable => variable.name === startValue.name) + 1);
	} else {
		select.selectIndex(0);
	}
	select.onSelected.subscribe(index => onChanged(index));

	const row = rowComponent([select.view]);

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view,
		validate
	};
}
