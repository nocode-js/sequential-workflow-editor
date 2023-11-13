import { Properties, PropertyValue } from 'sequential-workflow-model';
import { Path } from '../core/path';
import { PropertyValidator, PropertyModel, ValueModelFactory } from '../model';
import { CircularDependencyDetector } from './circular-dependency-detector';
import { buildLabel } from '../core/label-builder';

export class PropertyModelBuilder<TValue extends PropertyValue = PropertyValue, TProperties extends Properties = Properties> {
	private _value?: ValueModelFactory<TValue, object, TProperties>;
	private _label?: string;
	private _hint?: string;
	private _dependencies: Path[] = [];
	private _validator?: PropertyValidator;

	public constructor(
		private readonly path: Path,
		private readonly circularDependencyDetector: CircularDependencyDetector
	) {}

	/**
	 * @returns `true` if the model of the value is set, otherwise `false`.
	 */
	public hasValue(): boolean {
		return !!this._value;
	}

	/**
	 * Sets the model of the value.
	 * @param valueModelFactory The factory function that creates the model of the value.
	 * @example `builder.value(stringValueModel({ defaultValue: 'Some value' }));`
	 */
	public value(valueModelFactory: ValueModelFactory<TValue, object, TProperties>): this {
		if (this._value) {
			throw new Error(`Model is already set for ${this.path.toString()}`);
		}
		this._value = valueModelFactory;
		return this;
	}

	/**
	 * Sets the label of the property.
	 * @param label The label of the property.
	 * @example `builder.label('Foo');`
	 */
	public label(label: string): this {
		this._label = label;
		return this;
	}

	/**
	 * Sets the hint of the property. The hint is displayed in the property editor.
	 * @param hint The hint of the property.
	 * @example `builder.hint('This is a hint');`
	 */
	public hint(hint: string): this {
		this._hint = hint;
		return this;
	}

	/**
	 * Sets which properties the property depends on. Values of dependent properties are available in the custom validator.
	 * @param propertyName Name of the property in the step.
	 */
	public dependentProperty(propertyName: keyof TProperties): this {
		const propName = String(propertyName);
		const path = Path.create(['properties', propName]);
		if (this._dependencies.some(dep => dep.equals(path))) {
			throw new Error(`Dependency ${propName} is already set`);
		}
		this._dependencies.push(path);
		this.circularDependencyDetector.check(this.path, path);
		return this;
	}

	/**
	 * Sets the custom validator of the property.
	 * @param validator The custom validator of the property.
	 * @example `builder.customValidator({ validate(context) { return 'error'; } });`
	 */
	public validator(validator: PropertyValidator<TValue, TProperties>): this {
		if (this._validator) {
			throw new Error('Custom validator is already set');
		}
		this._validator = validator;
		return this;
	}

	public build(): PropertyModel<TValue> {
		if (!this._value) {
			throw new Error(`Model is not set for ${this.path.toString()}`);
		}

		return {
			path: this.path,
			label: this._label || this.getDefaultLabel(),
			hint: this._hint,
			dependencies: this._dependencies,
			validator: this._validator,
			value: this._value.create(this.path)
		};
	}

	private getDefaultLabel(): string {
		return buildLabel(this.path.last());
	}
}
