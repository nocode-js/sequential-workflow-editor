import { GeneratedStringContext, GeneratedStringVariableValueModel, ValueContext } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { validationErrorComponent } from '../../components/validation-error-component';
import { valueEditorContainerComponent } from '../../components/value-editor-container-component';
import { rowComponent } from '../../components/row-component';
import { inputComponent } from '../../components/input-component';

export const generatedStringValueEditorId = 'generatedString';

export function generatedStringValueEditor(
	context: ValueContext<GeneratedStringVariableValueModel>
): ValueEditor<GeneratedStringVariableValueModel> {
	const generatedContext = GeneratedStringContext.create(context);

	function validate() {
		validation.setDefaultError(context.validate());
	}

	function reloadDependencies() {
		generate();
		validate();
	}

	function generate() {
		const generated = context.model.configuration.generator(generatedContext);
		if (input.getValue() !== generated) {
			input.setValue(generated);
			context.setValue(generated);
		}
	}

	const startValue = context.getValue();
	const input = inputComponent(startValue, {
		isReadonly: true
	});
	const row = rowComponent([input.view]);

	const validation = validationErrorComponent();
	const container = valueEditorContainerComponent([row.view, validation.view]);

	validate();

	return {
		view: container.view,
		reloadDependencies
	};
}
