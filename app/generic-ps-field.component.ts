import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { PsViewProperty } from './model/ps';
import * as _ from 'lodash';
import * as validation from './utils/validation'

// PS stands for Processing Stage

const customCheckboxStyle = `
.checkbox label:after, 
.radio label:after {
    content: '';
    display: table;
    clear: both;
}

.checkbox .cr,
.radio .cr {
    position: relative;
    display: inline-block;
    border: 1px solid #a9a9a9;
    border-radius: .25em;
    width: 1.3em;
    height: 1.3em;
    float: left;
    margin-right: .5em;
}

.radio .cr {
    border-radius: 50%;
}

.checkbox .cr .cr-icon,
.radio .cr .cr-icon {
    position: absolute;
    font-size: .8em;
    line-height: 0;
    top: 50%;
    left: 20%;
}

.radio .cr .cr-icon {
    margin-left: 0.04em;
}

.checkbox label input[type="checkbox"],
.radio label input[type="radio"] {
    display: none;
}

.checkbox label input[type="checkbox"] + .cr > .cr-icon,
.radio label input[type="radio"] + .cr > .cr-icon {
    opacity: 0;
    transition: all .1s ease-in;
}

.checkbox label input[type="checkbox"]:checked + .cr > .cr-icon,
.radio label input[type="radio"]:checked + .cr > .cr-icon {
    opacity: 1;
}

.checkbox label input[type="checkbox"]:disabled + .cr,
.radio label input[type="radio"]:disabled + .cr {
    opacity: .5;
}
`;

@Component({
    selector: 'kairos-ps-field',
    template: `
                <!-- property fields -->
                <input *ngIf="checkText(psProperty)" style="width:100%;" class="form-control"
                    [(ngModel)]="fieldValue" 
                    (ngModelChange)="onPropertyInputChange()"
                    (keyup.enter)="onEnter()" />
                <textarea *ngIf="checkText(psProperty,'multiline')" style="width:100%;resize:vertical;" class="form-control"
                    [(ngModel)]="fieldValue" 
                    (ngModelChange)="onPropertyInputChange()"
                    (keyup.enter)="onEnter()"></textarea>
                <kairos-typeahead *ngIf="checkText(psProperty,'typeahead')" class="ui-select-search"
                    [(value)]="fieldValue"
                    (valueChange)="onPropertyInputChange()"
                    [typeaheadSource]="suggestions"
		            [typeaheadOptionsLimit]="100"
                    [typeaheadMinLength]="0"
                    (typeaheadOnSelect)="onEnter();"
                ></kairos-typeahead>
                <select *ngIf="checkBasicTypes(psProperty,'enum')" style="width:inherit;" class="form-control" 
                    [(ngModel)]="fieldValue" 
                    (ngModelChange)="onPropertyInputChange()"
                    (keyup.enter)="onEnter()">
                        <option *ngFor="let psPropertyOption of psProperty.options;" [value]="psPropertyOption">
                            {{psPropertyOption}}
                        </option>
                </select>
                <input *ngIf="checkBasicTypes(psProperty,'integer')" style="width:100px;" class="form-control"
                    [(ngModel)]="fieldValue" 
                    (ngModelChange)="onPropertyInputChange()"
                    (keyup.enter)="onEnter()"/>
                <input *ngIf="checkBasicTypes(psProperty,'long','double')" style="width:200px;" class="form-control"
                    [(ngModel)]="fieldValue" 
                    (ngModelChange)="onPropertyInputChange()"
                    (keyup.enter)="onEnter()"/>
                <div *ngIf="checkBasicTypes(psProperty,'boolean')" class="checkbox">
                    <label style="font-size: 1.0em">
                        <input type="checkbox" value="" [(ngModel)]="fieldValue" (ngModelChange)="onPropertyInputChange()"> 
                        <span class="cr"><i class="cr-icon fa fa-check"></i></span>
                    </label>
                </div>

                <!-- validation text -->
                <div class="fieldValidation" *ngIf="psProperty.error">{{psProperty.error}}</div>

                <!-- array field -->
                <div *ngIf="'array'===psProperty.property_type" class="well ui-select-container ui-select-multiple">
                    <span *ngIf="valueArray?.length===0">Array empty,</span>
                    <span class="ui-select-match">
                        <span *ngFor="let a of valueArray;let idx = index">
                            <span class="ui-select-match-item btn btn-default btn-secondary btn-xs"
                                tabindex="-1"
                                type="button"
                                [ngClass]="{'btn-default': true}">
                                <a class="close"
                                    style="margin-left: 5px; padding: 0;"
                                    (click)="removeSelectedTag(idx)">&times;</a>
                                <span>{{a}}</span>
                            </span>
                        </span>
                    </span>
                    press enter to add the value...
                </div>
`,
    styles: [`
    .ui-select-match > .btn {
    /* Instead of center because of .btn */
    text-align: left !important;
  }
    .ui-select-multiple .ui-select-match-item {
    outline: 0;
    margin: 0 3px 3px 0;
  }
  .ui-select-match > .caret {
    position: absolute;
    top: 45%;
    right: 15px;
  }
  .ui-select-match .close {
      font-size: 1.6em;
      line-height: 0.75;
  }

    .well {
        font-size: small;
        color: #8f8f8f;
        margin-top: 6px;
        padding: 6px;
    }

    ::-webkit-scrollbar { 
        display: none; 
    }

    .checkbox {
        margin: 0px;
    }

    .checkbox label {
        padding: 0px;
    }

    .fieldValidation {
        font-size: x-small;
        color: red;
        margin-bottom: -5px;
    }
  `,
  customCheckboxStyle]
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