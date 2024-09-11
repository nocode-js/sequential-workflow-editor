import { NullableVariableValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { validationErrorComponent } from '../../components/validation-error-component';
import { rowComponent } from '../../components/row-component';
import { selectComponent } from '../../components/select-component';
import { formatVariableNameWithType } from '../../core/variable-name-formatter';
import { filterVariablesByType } from '../../core/filter-variables-by-type';

export const nullableVariableValueEditorId = 'nullableVariable';

export function nullableVariableValueEditor(context: ValueContext<NullableVariableValueModel>): ValueEditor<NullableVariableValueModel> {
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
	const variables = filterVariablesByType(context.getVariables(), context.model.configuration.valueType);

	const select = selectComponent({
		stretched: true
	});
	select.setValues([
		context.i18n('nullableVariable.selectType', '- Select: :type -', {
			type: context.model.configuration.valueType
		}),
		...variables.map(variable => formatVariableNameWithType(variable.name, variable.type))
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
		view: container.view
	};
}
