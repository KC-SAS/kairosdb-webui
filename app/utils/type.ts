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
            let defaultValue = ''

            if (property.options !== undefined &&
                (defaultValue = property.options.find(opt => opt.toLowerCase() === property.defaultValue.toString().toLowerCase())))
                return defaultValue;
            else
                return (property.options !== undefined && property.options.length > 0) ? property.options[0] : ''
        case 'array':
            return property.defaultValue.slice(1, -1);
        case 'boolean':
            return property.defaultValue == 'true';
    }
    return property.defaultValue;
}

export function validate(prop: PsViewProperty, value: any) {
    if (!prop.validations) return;

    prop.validations.forEach(validation => {
        if (validation.type.toString().toLowerCase() !== 'js'.toLowerCase()) {
            prop.error = `Validation can't evaluate expression type [${validation.type.toString()}]`
            return;
        }

        let res = false;
        try { res = eval(`((value) => ${validation.expression})(${value})`); }
        catch (e) {}

        if (!res) prop.error = validation.message.toString();
        else prop.error = '';
    })
}
