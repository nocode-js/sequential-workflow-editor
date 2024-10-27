import { EditorToolboxSorter, ToolboxGroup } from '../editor-provider-configuration';

export const sortToolboxGroups: EditorToolboxSorter = (groups: ToolboxGroup[]) => {
	groups.forEach(group => {
		group.steps.sort((a, b) => a.name.localeCompare(b.name));
	});
	groups.sort((a, b) => a.name.localeCompare(b.name));
};
