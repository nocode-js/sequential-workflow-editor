## O.14.8

This PR adds support for the internationalization of options in the choice value model [#53](https://github.com/nocode-js/sequential-workflow-editor/issues/53).

## O.14.7

Added an `index` argument to the `itemComponentFactory` callback in the `dynamicListComponent` function.

## O.14.6

Added comments to describe the `BranchedStepModelBuilder`, `SequentialStepModelBuilder` and `RootModelBuilder` classes.

## O.14.5

Added comments to describe the `EditorProvider` class.

## 0.14.4

This version exposes the `ToolboxGroup` interface in the `sequential-workflow-editor` package [#46](https://github.com/nocode-js/sequential-workflow-editor/issues/46#issuecomment-2439817733).

## 0.14.3

This version provides the ability to sort the steps in the toolbox in a custom way. By default, the steps are sorted alphabetically.

```ts
EditorProvider.create(definitionModel, {
  // ...
  toolboxSorter(groups: ToolboxGroup[]) {
    // ...
  }
});
```

You can also hide certain steps from the toolbox by using the hidden method in the step builder.

```ts
createStepModel<MyStep>('myStep', 'task', step => {
  step.toolbox(false);
});
```

## 0.14.2

This version adds the `formatPropertyValue` method to the `PropertyValidatorContext` class.

## 0.14.1

This version adds the `formatPropertyValue` method to: `PropertyContext`, `DefaultValueContext`, `ScopedPropertyContext` and `ValueContext` classes.

## 0.14.0

From now, the nullable any variable editor and the nullable variable editor display the expected variable types to select. This version also allows changes to the labels in the dropdown menu of the dynamic value editor.

## 0.13.2

This version adds missing translations for the `variableDefinitions` value editor.

## 0.13.1

This version adds missing translations for the `variableNameValidator` function [#37](https://github.com/nocode-js/sequential-workflow-editor/issues/37).

## 0.13.0

This version introduces several internal changes that allowed for the creation of a new type of editor in the pro version: the hidden dependent value editor.

## 0.12.1

This version normalizes translations.

## 0.12.0

This version introduces the localization feature. Now you can localize the editor to any language you want.

## 0.11.3

This version improves the behavior of the `Dynamic` value editor, when the sub editor contains a control visible in the property header.

## 0.11.2

This version adds a generic type to the `ChoiceValueModel` interface.

## 0.11.1

This version improves support for UMD bundles.

## 0.11.0

This version normalizes names of functions in `ValueContext` and `PropertyValidatorContext` classes.

The `CustomValidatorContext` class is deleted now, please use the `PropertyValidatorContext` class instead.

The `PropertyModelBuilder` class has deleted the `customValidator` function, please use the `validator` function instead.

## 0.10.0

This version deletes all deprecated `*ValueModel` functions. From now, use only `create*ValueModel` functions.

## 0.9.3

Added `hasVariable` and `hasVariables` methods to the `PropertyValidatorContext` class.

## 0.9.2

This version fixes a bug in the `ValueEditorFactoryResolver` class. Now, when an editor is not found, the resolver throws an error.

## 0.9.1

This version exports the `variableNameValidator` function in the `sequential-workflow-editor-model` package.

## 0.9.0

* Improved validation for the `boolean` value model.
* Improved validation for the `branches` value model.
* Internal changes preparing for the upcoming pro version.

## 0.8.0

Updated the `sequential-workflow-model` dependency to the version `0.2.0`.

## 0.7.2

We added a new type of a validator: step validator. It allows to restrict a placement of a step in a definition. For example, you can enforce that a step can be placed only inside a specific step.

```ts
createStepModel<WriteSocketStep>('writeSocket', 'task', step => {
  step.validator({
    validate(context: StepValidatorContext) {
      const parentTypes = context.getParentStepTypes();
      return parentTypes.includes('socket');
        ? null // No errors
        : 'The write socket step must be inside a socket.';
    }
  });
});
```

Additionally we've renamed:

* the `CustomValidatorContext` class to `PropertyValidatorContext`,
* the `customValidator` method of the `PropertyModelBuilder` class to `validator`.

## 0.7.1

This version renames all `*ValueModel` functions to `create*ValueModel`, adding the `create` prefix.

```ts
// Old
stringValueModel({ ... });

// New
createStringValueModel({ ... });
```

This version doesn't introduce breaking changes. The old functions are still available, but they are deprecated.

## 0.7.0

This version changes the license to the MIT license. 🎉

## 0.6.0

* This version brings small visual improvements.
* Added a new value model: string dictionary (`stringDictionaryValueModel({ ... })`). This value model allows you to specify a dictionary of string values.
* The string value model now supports multiline mode.

```ts
stringValueModel({ multiline: true })
stringValueModel({ multiline: 10 })
```

**Breaking changes:**

The createStepEditorProvider() method of the EditorProvider class now returns a new type of editor provider. This method no longer accepts any arguments.

```ts
type StepEditorProvider = (step: Step, context: StepEditorContext, definition: Definition) => HTMLElement;

EditorProvider.createStepEditorProvider(): StepEditorProvider;
```

The `ValueKnownType` enum is renamed to `WellKnownValueType`.

## 0.5.0

The `DefinitionValidator` class supports the validation of the whole definition. Use the `validate` method to validate a definition deeply. This method will validate all steps in the definition at once. Now you may easily validate a definition in the back-end before saving it to the storage.

```ts
const validator = DefinitionValidator.create(definitionModel, definitionWalker);
if (validator.validate(definition)) {
  throw new Error('Invalid definition');
}
```

**Breaking changes:**

* Renamed the `ModelValidator` class to `DefinitionValidator`.

## 0.4.1

* The model validator is improved. Now the validator validates the `name` field of the step as well.
* Adjusted CSS styles.

## 0.4.0

* Added a new value model: `generatedString` (`generatedStringValueEditor({ ... })`). The new value model allows you to generate a string value for some property, depending on the values of other properties. Mainly this feature is designed to generate a step name automatically.
* The `StepModel` interface has one new property: `label`. The label is used to display a step name in the editor and the toolbox.

**Breaking changes:**

* The `ValueModelFactory` type is changed to the interface.
* The `ValueModelContext` class is renamed to `ValueContext`.
* The `VariablesProvider` class skips variables from own step.

## 0.3.2

* The `StepModel` interface has two new properties: `category` and `description`. The category is used to group steps in the toolbox. The description is used to display an additional information about a step in the editor.
* The `PropertyModel` interface has one new property: `hint`. The hint is used to display an additional information about a property in the editor.

## 0.3.1

Added new value model: boolean (`booleanValueModel({ ... })`).

## 0.3.0

* Added a new value model: nullable any variable (`nullableAnyVariableValueModel({ ... })`). This value model allows you to select any variable. Additionally, you can specify a variable type that can be selected by a user.
* Added new optional property: `valueTypes` to `VariableDefinitionsValueModelConfiguration` interface. Now it's possible to force the types of variables during creation of variables by a user.

**Breaking changes:**

* Renamed the `variableType` property to `valueType` in the `NullableVariableValueModelConfiguration` interface.
* Renamed the `variableType` property to `valueType` in the `NullableVariableDefinitionValueModelConfiguration` interface.

## 0.2.1

Fixed bug with removing a message about an empty list.

## 0.2.0

**Breaking changes:**

* The editor displays variables with dollar prefix (`$`).
* The `choices` property is renamed to `models` in the `DynamicValueModelConfiguration` interface.

## 0.1.0

First release! 🚀
