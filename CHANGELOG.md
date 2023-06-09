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
