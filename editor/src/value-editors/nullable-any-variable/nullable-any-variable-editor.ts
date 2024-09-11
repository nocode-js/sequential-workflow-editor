import { NullableAnyVariableValueModel, NullableVariableValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { validationErrorComponent } from '../../components/validation-error-component';
import { rowComponent } from '../../components/row-component';
import { selectComponent } from '../../components/select-component';
import { formatVariableNameWithType } from '../../core/variable-name-formatter';
import { filterVariablesByType } from '../../core/filter-variables-by-type';

export const nullableAnyVariableValueEditorId = 'nullableAnyVariable';

export function nullableAnyVariableValueEditor(
	context: ValueContext<NullableAnyVariableValueModel>
): ValueEditor<NullableVariableValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	function onChanged(selectedIndex: number) {
		if (selectedIndex === 0) {
			context.setValue(null);
		} else {
			const variable = variables[selectedIndex - 1];
			context.setValue({
				name: variable.name,
				type: variable.type
			});
		}
		validate();
	}

	const startValue = context.getValue();
	const variables = filterVariablesByType(context.getVariables(), context.model.configuration.valueTypes);

	const select = selectComponent({
		stretched: true
	});

	const expectedTypes = context.model.configuration.valueTypes ? context.model.configuration.valueTypes.join(', ') : null;
	const actionText = expectedTypes
		? context.i18n('nullableAnyVariable.selectTypes', '- Select: :types -', {
				types: expectedTypes
		  })
		: context.i18n('nullableAnyVariable.select', '- Select -');

	select.setValues([actionText, ...variables.map(variable => formatVariableNameWithType(variable.name, variable.type))]);
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
