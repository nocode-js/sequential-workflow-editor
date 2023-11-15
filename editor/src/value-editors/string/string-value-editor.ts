import { StringValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { rowComponent } from '../../components/row-component';
import { InputComponent, inputComponent } from '../../components/input-component';
import { TextareaComponent, textareaComponent } from '../../components/textarea-component';
import { StringValueEditorConfiguration } from './string-value-editor-configuration';

export const stringValueEditorId = 'string';

const defaultMultiline = 4;

export function createStringValueEditor(configuration?: StringValueEditorConfiguration) {
	return (context: ValueContext<StringValueModel>): ValueEditor<StringValueModel> => {
		function validate() {
			validation.setDefaultError(context.validate());
		}

		const startValue = context.getValue();
		const multiline = context.model.configuration.multiline;

		const input: InputComponent | TextareaComponent = multiline
			? textareaComponent(startValue, {
					rows: multiline === true ? defaultMultiline : multiline
			  })
			: inputComponent(startValue);

		input.onChanged.subscribe(value => {
			context.setValue(value);
			validate();
		});

		const row = rowComponent([input.view], {
			class: configuration?.class
		});

		const validation = validationErrorComponent();
		const container = valueEditorContainerComponent([row.view, validation.view]);

		validate();

		return {
			view: container.view
		};
	};
}
