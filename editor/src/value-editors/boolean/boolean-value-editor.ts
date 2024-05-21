import { BooleanValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { rowComponent } from '../../components/row-component';
import { selectComponent } from '../../components/select-component';

export const booleanValueEditorId = 'boolean';

export function booleanValueEditor(context: ValueContext<BooleanValueModel>): ValueEditor<BooleanValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	function onSelected(index: number) {
		context.setValue(index === 1);
		validate();
	}

	const select = selectComponent({
		stretched: true
	});
	select.setValues([context.i18n('boolean.false', 'False'), context.i18n('boolean.true', 'True')]);
	select.selectIndex(context.getValue() ? 1 : 0);
	select.onSelected.subscribe(onSelected);

	const row = rowComponent([select.view]);

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view
	};
}
