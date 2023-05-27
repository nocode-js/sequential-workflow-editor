import { ModelActivator, ValueModel, ValueModelContext } from 'sequential-workflow-editor-model';
import { Component } from '../components/component';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ValueEditor<TValueModel extends ValueModel = ValueModel> extends Component {
	controlView?: HTMLElement;
	validate(): void;
}

export type ValueEditorFactory<TValueModel extends ValueModel = ValueModel> = (
	context: ValueModelContext<TValueModel>,
	services: EditorServices
) => ValueEditor<TValueModel>;

export type ValueEditorFactoryResolver = (valueModelId: string) => ValueEditorFactory;

export interface EditorServices {
	valueEditorFactoryResolver: ValueEditorFactoryResolver;
	activator: ModelActivator;
}
