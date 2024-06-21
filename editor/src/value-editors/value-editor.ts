import { ModelActivator, ValueModel, ValueContext, I18n, SimpleEvent } from 'sequential-workflow-editor-model';
import { ValueEditorFactoryResolver } from './value-editor-factory-resolver';
import { Component } from '../components/component';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ValueEditor<TValueModel extends ValueModel = ValueModel> extends Component {
	onIsHiddenChanged?: SimpleEvent<boolean>;
	controlView?: HTMLElement;
	reloadDependencies?: () => void;
	isHidden?: () => boolean;
}

export type ValueEditorFactory<TValueModel extends ValueModel = ValueModel> = (
	context: ValueContext<TValueModel>,
	services: EditorServices
) => ValueEditor<TValueModel>;

export interface EditorServices {
	valueEditorFactoryResolver: ValueEditorFactoryResolver;
	activator: ModelActivator;
	i18n: I18n;
}
