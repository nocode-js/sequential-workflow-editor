/* global window, document, sequentialWorkflowEditorModel, sequentialWorkflowEditor, sequentialWorkflowDesigner */

const nextId = sequentialWorkflowDesigner.Uid.next;

const rootModel = sequentialWorkflowEditorModel.createRootModel(model => {
	model.property('host').value(sequentialWorkflowEditorModel.createStringValueModel({}));
});

const sendEmailModel = sequentialWorkflowEditorModel.createStepModel('sendEmail', 'task', step => {
	step.property('to').value(sequentialWorkflowEditorModel.createStringValueModel({}));
	step.property('ssl').value(sequentialWorkflowEditorModel.createBooleanValueModel({}));
});

const sqlQueryModel = sequentialWorkflowEditorModel.createStepModel('sqlQuery', 'task', step => {
	step.property('query').value(
		sequentialWorkflowEditorModel.createStringValueModel({
			defaultValue: 'SELECT * FROM table'
		})
	);
});

const definitionModel = sequentialWorkflowEditorModel.createDefinitionModel(model => {
	model.valueTypes(['string']);
	model.root(rootModel);
	model.steps([sendEmailModel, sqlQueryModel]);
});

const editorProvider = sequentialWorkflowEditor.EditorProvider.create(definitionModel, {
	uidGenerator: nextId
});

const startDefinition = {
	properties: {
		host: '127.0.0.1'
	},
	sequence: [
		{
			id: nextId(),
			name: 'Send Email',
			type: 'sendEmail',
			componentType: 'task',
			properties: {
				to: 'test@example.com',
				ssl: false
			}
		}
	]
};

function load() {
	const placeholder = document.getElementById('placeholder');

	sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, {
		toolbox: {
			groups: editorProvider.getToolboxGroups(),
			labelProvider: editorProvider.createStepLabelProvider()
		},
		controlBar: true,
		steps: {},
		editors: {
			rootEditorProvider: editorProvider.createRootEditorProvider(),
			stepEditorProvider: editorProvider.createStepEditorProvider()
		},
		validator: {
			step: editorProvider.createStepValidator(),
			root: editorProvider.createRootValidator()
		}
	});
}

window.addEventListener('load', load, false);
