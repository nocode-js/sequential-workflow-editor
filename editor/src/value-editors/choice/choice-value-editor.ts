import { ChoiceValueModel, ValueModelContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { rowComponent } from '../../components/row-component';
import { selectComponent } from '../../components/select-component';

export const choiceValueEditorId = 'choice';

export function choiceValueEditor(context: ValueModelContext<ChoiceValueModel>): ValueEditor<ChoiceValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	function onSelected(index: number) {
		const value = context.model.configuration.choices[index];
		context.setValue(value);
		validate();
	}

	const select = selectComponent({
		stretched: true
	});
	select.setValues(context.model.configuration.choices);
	const startIndex = context.model.configuration.choices.indexOf(context.getValue());
	select.selectIndex(startIndex);
	select.onSelected.subscribe(onSelected);

	const row = rowComponent([select.view]);

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view,
		validate
	};
}
