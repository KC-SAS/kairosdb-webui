import { PsViewProperty } from '../model/ps';

export function isType(prop: PsViewProperty, ...types: string[]): boolean {
    if (!prop) { return false }
    for (var type of types) {
        if (prop.type.toLowerCase() === type.toLowerCase()) {
            return true;
        }
    }
    return false;
}

export function getDefault(property: PsViewProperty): any {
    if (property.defaultValue === undefined) {
        return '';
    }
    switch (property.type.toLowerCase()) {
        case 'enum':
            if (property.options !== undefined &&
                property.options.find(opt => opt.toLowerCase() === property.defaultValue.toString().toLowerCase()))
                return property.defaultValue;
            else
                return (property.options !== undefined && property.options.length > 0) ? property.options[0] : ''
        case 'array':
            return property.defaultValue.slice(1, -1);
        case 'boolean':
            return property.defaultValue == 'true';
    }
    return property.defaultValue;
}
