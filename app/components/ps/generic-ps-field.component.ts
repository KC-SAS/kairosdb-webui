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
            this.fieldValue = this.psProperty['value'];

            console.log("a,b,c,d".split(','))

            //TODO: Split not recognize => fieldValue not a string
            if (this.fieldValue && this.isType(this.psProperty, 'array')) {
                this.valueArray = this.fieldValue.split(',')
                this.fieldValue = ''
            }
            this.validate();
            this.suggestions = _.keys(this.tagValuesForNames);
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
        if (this.isType(this.psProperty, 'array')) {
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

    private isType(prop: PsViewProperty, ...types: string[]): boolean {
        if (!prop) { return false }
        for (var type of types) {
            if (prop.type.toLowerCase() === type.toLowerCase()) {
                return true
            }
        }
        return false
    }

    checkField(prop: PsViewProperty, type: string): boolean {
        if (!prop) { return false }
        switch (type.toLowerCase())
        {
            case 'textarea':
                return this.isType(prop, 'string') && prop.multiline
            case 'simple_array':
                return this.isType(prop, 'array') && prop.autocomplete === undefined
            case 'typeahead':
                return this.isType(prop, 'array') && prop.autocomplete !== undefined
            case 'select':
                return this.isType(prop, 'enum')
            case 'checkbox':
                return this.isType(prop, 'boolean')
            case 'input':
                return !this.isType(prop, 'array', 'enum', 'boolean') && prop.multiline === undefined
            case 'array':
                return this.isType(prop, 'array')
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

    private getDefault(propertyType: string): any {
        if (propertyType.toUpperCase() === 'boolean'.toUpperCase()) {
            return false;
        }
        else {
            return '';
        }

    }

    checkBasicTypes(prop: PsViewProperty, ...types: string[]): boolean {
        if (!prop || !types) {
            return false;
        }
        let result = false;
        types.forEach(type => { result = result || type.toUpperCase() === prop.type.toUpperCase(); });
        return result;
    }

    checkText(prop: PsViewProperty, type?: string): boolean {
        if (!prop)
        return false;
        if (prop.type.toUpperCase() === 'array'.toUpperCase()) {
            return type === 'typeahead';
        }
        else if (prop.type.toUpperCase() !== 'string'.toUpperCase()) {
            return false;
        }
        else if (prop.multiline === true) {
            return type === 'multiline';
        }
        else {
            return true;
        }

    }


}
