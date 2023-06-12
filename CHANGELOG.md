## 0.3.1

Added new value model: boolean (`booleanValueModel({ ... })`).

## 0.3.0

* Added new value model: nullable any variable (`nullableAnyVariableValueModel({ ... })`). This value model allows you to select any variable. Additionally, you can specify a variable type that can be selected by a user.
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
