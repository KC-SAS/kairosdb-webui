import * as _ from 'lodash';

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

    toViewProperty(): PsViewProperty {
        let viewProperty = new PsViewProperty(this.name);
        viewProperty.label = this.label;
        viewProperty.optional = this.optional;
        viewProperty.property_type = this.property_type;
        viewProperty.element_type = this.element_type;
        viewProperty.validations = _.cloneDeep(this.validations); 
        viewProperty.default = this.default;
        viewProperty.description = this.description;
        viewProperty.options = _.cloneDeep(this.options); 
        viewProperty.autocomplete = this.autocomplete;
        viewProperty.multiline = this.multiline;
        return viewProperty;

    }
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