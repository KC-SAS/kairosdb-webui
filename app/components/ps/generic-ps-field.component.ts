import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import * as _ from 'lodash';
import { QueryService } from '../../query.service'
import { PsViewProperty } from '../../model/ps';
import * as validation from '../../utils/validation'

// PS stands for Processing Stage

@Component({
    moduleId: module.id,
    selector: 'kairos-ps-field',
    templateUrl: 'generic-ps-field.component.html',
    styleUrls: [ 'generic-ps-field.component.css' ]
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
        if (changes['psProperty']) {
            this.fieldValue = this.psProperty['value'];
            this.validate();
        }
        if (changes['psProperty'] || changes['tagValuesForNames']) {
            console.log('ngOnChanges');
            if (this.psProperty.autocomplete === 'tag_name') {
                console.log(_.keys(this.tagValuesForNames));
                this.suggestions = _.keys(this.tagValuesForNames);
            }
            else {
                this.suggestions = [];
            }
        }
    }

    ngOnInit() {
    }

    onPropertyInputChange() {
        this.validate();
        if (this.psProperty.property_type !== 'array') {
            this.psProperty.value = this.fieldValue;
            this.change.emit();
        }
    }

    onEnter() {
        if (this.psProperty.property_type === 'array') {
            this.valueArray.push(this.fieldValue);
            this.psProperty.value = this.valueArray;
            this.change.emit();
            this.fieldValue = '';
        }
    }

    removeSelectedTag(idx: number) {
        _.pullAt(this.valueArray, idx);
        this.psProperty.value = this.valueArray;
        this.change.emit();
    }

    private getDefault(propertyType: string): any {
        if (propertyType === 'boolean') {
            return false;
        }

        else {
            return '';
        }

    }

    validate() {
        let type = this.psProperty.property_type;
        if (type === 'array') {
            type = this.psProperty.element_type;
        }
        if (type == 'integer' && !validation.isInteger(this.fieldValue)) {
            this.psProperty.error = 'Invalid integer';
        }
        else if (type == 'long' && !validation.isLong(this.fieldValue)) {
            this.psProperty.error = 'Invalid long';
        }
        else if (type == 'double' && !validation.isDouble(this.fieldValue)) {
            this.psProperty.error = 'Invalid double';
        }
        else {
            this.psProperty.error = undefined;
        }
        // TODO use validation field
    }

    checkBasicTypes(prop: PsViewProperty, ...types: string[]): boolean {
        if (!prop || !types) {
            return false;
        }
        let result = false;
        types.forEach(type => {
            result = result || type === prop.property_type || type === prop.element_type;
        });
        return result;
    }

    checkText(prop: PsViewProperty, type?: string): boolean {
        if (!prop || ('string' !== prop.property_type && 'string' !== prop.element_type)) {
            return false;
        }
        else if (prop.multiline === true) {
            return type === 'multiline';
        }
        else if (prop.autocomplete !== undefined) {
            return type === 'typeahead';
        }
        else {
            return true;
        }

    }


}
