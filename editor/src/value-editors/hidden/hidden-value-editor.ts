import { ValueModel } from 'sequential-workflow-editor-model';
import { ValueEditor } from '../value-editor';
import { valueEditorContainerComponent } from '../../components';

export function hiddenValueEditor(): ValueEditor<ValueModel> {
	const container = valueEditorContainerComponent([]);
	return {
		view: container.view,
		isHidden: () => true
	};
}
