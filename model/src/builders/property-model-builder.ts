import { Properties, PropertyValue } from 'sequential-workflow-model';
import { Path } from '../core/path';
import { CustomValidator, PropertyModel } from '../model';
import { ValueModelFactoryOfValue } from '../model';
import { CircularDependencyDetector } from './circular-dependency-detector';
import { buildLabel } from '../core/label-builder';

export class PropertyModelBuilder<TValue extends PropertyValue = PropertyValue, TProperties extends Properties = Properties> {
	private _value?: ValueModelFactoryOfValue<TValue>;
	private _label?: string;
	private _dependencies: Path[] = [];
	private _customValidator?: CustomValidator;

	public constructor(private readonly path: Path, private readonly circularDependencyDetector: CircularDependencyDetector) {}

	public hasValue(): boolean {
		return !!this._value;
	}

	public value(valueModelFactory: ValueModelFactoryOfValue<TValue>): this {
		if (this._value) {
			throw new Error(`Model is already set for ${this.path.toString()}`);
		}
		this._value = valueModelFactory;
		return this;
	}

	public label(label: string): this {
		this._label = label;
		return this;
	}

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

	public customValidator(customValidator: CustomValidator<TValue, TProperties>): this {
		if (this._customValidator) {
			throw new Error('Custom validator is already set');
		}
		this._customValidator = customValidator;
		return this;
	}

	public build(): PropertyModel<TValue> {
		if (!this._value) {
			throw new Error(`Model is not set for ${this.path.toString()}`);
		}

		return {
			name: this.path.last(),
			label: this._label || this.getDefaultLabel(),
			dependencies: this._dependencies,
			customValidator: this._customValidator,
			value: this._value(this.path)
		};
	}

	private getDefaultLabel(): string {
		return buildLabel(this.path.last());
	}
}
