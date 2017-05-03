import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import * as _ from 'lodash';
import { QueryService } from '../../query.service'
import { PsViewProperty } from '../../model/ps';
import * as property from '../../utils/property'
import * as validation from '../../utils/validation'

// PS stands for Processing Stage

@Component({
    moduleId: module.id,
    selector: 'kairos-ps-field',
    templateUrl: 'generic-ps-field.component.html',
    styleUrls: ['generic-ps-field.component.css']
})
export class PsFieldComponent implements OnChanges, OnInit {
    @Input()
    public psProperty: PsViewProperty;

    public fieldValue: any;
    public valueArray: any[];
    public suggestions: string[];

    @Output()
    public change = new EventEmitter<void>();

    @Input()
    public tagValuesForNames: {};

    public constructor() {
        this.psProperty = new PsViewProperty();
        this.valueArray = [];
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['psProperty'] || changes['tagValuesForNames']) {
            let isArray = property.isType(this.psProperty, 'array');

            this.fieldValue = property.getDefault(this.psProperty);

            if (isArray) {
                this.valueArray = (this.fieldValue) ? this.fieldValue.toString().split(',') : [];
                this.fieldValue = '';

                this.suggestions = (this.psProperty.autocomplete) ? _.keys(this.tagValuesForNames) : [];
            }

            this.psProperty.value = (isArray) ? this.valueArray : this.fieldValue;
            this.validate();
        }
    }

    ngOnInit() {
    }

    onPropertyInputChange() {
        this.validate();
        if (this.psProperty.type.toUpperCase() !== 'array'.toUpperCase()) {
            this.psProperty.value = this.fieldValue;
            this.change.emit();
        }
    }

    onEnter() {
        if (property.isType(this.psProperty, 'array')) {
            if (this.fieldValue) {
                this.valueArray.push(this.fieldValue);
                this.psProperty.value = this.valueArray;
                this.change.emit();
                this.fieldValue = '';
            }
        }
    }

    removeSelectedTag(idx: number) {
        _.pullAt(this.valueArray, idx);
        this.psProperty.value = this.valueArray;
        this.change.emit();
    }

    isValidField(prop: PsViewProperty, type: string): boolean {
        if (!prop) { return false }
        switch (type.toLowerCase())
        {
            case 'textarea':
                return property.isType(prop, 'string') && prop.multiline
            case 'simple_array':
                return property.isType(prop, 'array') && prop.autocomplete === undefined
            case 'typeahead':
                return property.isType(prop, 'array') && prop.autocomplete !== undefined
            case 'select':
                return property.isType(prop, 'enum')
            case 'checkbox':
                return property.isType(prop, 'boolean')
            case 'input':
                return !property.isType(prop, 'array', 'enum', 'boolean') && prop.multiline === undefined
            case 'array':
                return property.isType(prop, 'array')
        }
        return false
    }

    validate() {
        let type = this.psProperty.type;
        if (type.toUpperCase() == 'int'.toUpperCase() && !validation.isInteger(this.fieldValue)) {
            this.psProperty.error = 'Invalid integer';
        }
        else if (type.toUpperCase() == 'long'.toUpperCase() && !validation.isLong(this.fieldValue)) {
            this.psProperty.error = 'Invalid long';
        }
        else if (type.toUpperCase() == 'double'.toUpperCase() && !validation.isDouble(this.fieldValue)) {
            this.psProperty.error = 'Invalid double';
        }
        else {
            this.psProperty.error = undefined;
        }
        // TODO use validation field
    }
}
