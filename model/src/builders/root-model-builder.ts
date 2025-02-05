import { Definition, Properties, Sequence } from 'sequential-workflow-model';
import { Path } from '../core/path';
import { RootModel } from '../model';
import { PropertyModelBuilder } from './property-model-builder';
import { CircularDependencyDetector } from './circular-dependency-detector';
import { createSequenceValueModel } from '../value-models';

const sequencePath = Path.create(['sequence']);

export class RootModelBuilder<TProperties extends Properties> {
	protected readonly circularDependencyDetector = new CircularDependencyDetector();
	private readonly propertyBuilders: PropertyModelBuilder[] = [];
	private readonly sequenceBuilder = new PropertyModelBuilder<Sequence, TProperties>(sequencePath, this.circularDependencyDetector);

	/**
	 * @param propertyName Name of the property.
	 * @returns The builder for the property.
	 * @example `builder.property('foo').value(createStringValueModel({ defaultValue: 'Some value' })).label('Foo');`
	 */
	public property<Key extends keyof TProperties>(propertyName: Key): PropertyModelBuilder<TProperties[Key], TProperties> {
		const path = Path.create(['properties', String(propertyName)]);
		const builder = new PropertyModelBuilder<TProperties[Key], TProperties>(path, this.circularDependencyDetector);
		this.propertyBuilders.push(builder);
		return builder;
	}

	/**
	 * @returns the builder for the sequence property.
	 * @example `builder.sequence().value(createSequenceValueModel(...));`
	 */
	public sequence(): PropertyModelBuilder<Sequence> {
		return this.sequenceBuilder;
	}

	public build(): RootModel {
		if (!this.sequenceBuilder.hasValue()) {
			this.sequenceBuilder.value(
				createSequenceValueModel({
					sequence: []
				})
			);
		}
		return {
			sequence: this.sequenceBuilder.build(),
			properties: this.propertyBuilders.map(builder => builder.build())
		};
	}
}

export function createRootModel<TDefinition extends Definition>(
	build: (builder: RootModelBuilder<TDefinition['properties']>) => void
): RootModel {
	const builder = new RootModelBuilder<TDefinition['properties']>();
	build(builder);
	return builder.build();
}
