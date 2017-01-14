import { _ } from '../utils/imports';

// ps stands for Processing Stage

export class PsProperty {
    name: string;

    constructor(name?: string) {
        this.name = name;
    }
}

abstract class AbstractPsProperty extends PsProperty {
    label: string;
    optional: boolean;
    property_type: string;
    element_type: string;
    validations: any[]; // type to be defined
    default: any;
    description: string;
    options: string[];
    autocomplete: string;
    multiline: boolean;
}

export class PsDescribedProperty extends AbstractPsProperty {
    properties: PsDescribedProperty[];
}

export class PsViewProperty extends AbstractPsProperty {
    parent_name: string;
    active: boolean;
    value: any;
    error: string;
}

export class PsDescriptor {
    properties: PsDescribedProperty[];
    validations: any[]; // type to be defined
    name: string;
    description: string;
    label: string;
}

export function toViewProperty(psDescribedProperty: PsDescribedProperty): PsViewProperty {
    let viewProperty = new PsViewProperty(psDescribedProperty.name);
    viewProperty.label = psDescribedProperty.label;
    viewProperty.optional = psDescribedProperty.optional;
    viewProperty.property_type = psDescribedProperty.property_type;
    viewProperty.element_type = psDescribedProperty.element_type;
    viewProperty.validations = _.cloneDeep(psDescribedProperty.validations);
    viewProperty.default = psDescribedProperty.default;
    viewProperty.description = psDescribedProperty.description;
    viewProperty.options = _.cloneDeep(psDescribedProperty.options);
    viewProperty.autocomplete = psDescribedProperty.autocomplete;
    viewProperty.multiline = psDescribedProperty.multiline;
    return viewProperty;
}