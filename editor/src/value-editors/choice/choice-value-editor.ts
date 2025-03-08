import { ChoiceValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { rowComponent } from '../../components/row-component';
import { selectComponent } from '../../components/select-component';
import { createStepI18nPrefix } from '../../core/step-i18n-prefix';

export const choiceValueEditorId = 'choice';

export function choiceValueEditor(context: ValueContext<ChoiceValueModel>): ValueEditor<ChoiceValueModel> {
	function validate() {
		validation.setDefaultError(context.validate());
	}

	function onSelected(index: number) {
		const value = choices[index];
		context.setValue(value);
		validate();
	}

	const select = selectComponent({
		stretched: true
	});

	const stepType = context.tryGetStepType();
	const i18nPrefix = createStepI18nPrefix(stepType);

	const choices = context.model.configuration.choices;
	const translatedChoices = choices.map(choice => {
		const pathStr = context.model.path.toString();
		const key = `${i18nPrefix}${pathStr}:choice:${choice}`;
		return context.i18n(key, choice);
	});

	select.setValues(translatedChoices);
	const startIndex = choices.indexOf(context.getValue());
	select.selectIndex(startIndex);
	select.onSelected.subscribe(onSelected);

	const row = rowComponent([select.view]);

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view
	};
}
