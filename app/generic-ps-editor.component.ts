import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import * as validation from './utils/validation'

// PS stands for Processing Stage

@Component({
    selector: 'kairos-ps-editor',
    template: `
<div class="well">
    <div *ngIf="!showAggInfo" class="ps-info-icon text-uppercase">
        {{currentPsDescription?.label || currentPsDescription?.name || 'Invalid'}} {{psDescriptor?.label || ''}}
        <i *ngIf="currentPsDescription?.description" class="glyphicon glyphicon-info-sign" (click)="showAggInfo=true"></i>
    </div>
    <alert *ngIf="showAggInfo && currentPsDescription?.description" class="ps-info-box" [type]="'info'" dismissible="true" (close)="showAggInfo=false">
        <b>General description: </b> {{currentPsDescription?.description}}
    </alert>

    <div *ngFor="let psProperty of currentPsProperties" class="ps-property-group">  
        <button #propButton type="button" class="btn btn-default ps-property-name"
                (click)="onPropertyNameClick(propButton,psProperty)"
                [class.custom-disabled]="!psProperty.optional"
                [class.active]="psProperty.active">
            {{psProperty.label || psProperty.name}}
        </button> 
        <alert *ngIf="showAggInfo && psProperty.description" class="ps-info-box ps-property-input" [type]="'info'">
            {{psProperty.description}}
        </alert>
        <div *ngIf="!showAggInfo && psProperty.active" class="ps-property-input">
                <kairos-ps-field 
                    [psProperty]="psProperty" 
                    (change)="onPropertyInputChange(psProperty)"
                    [tagValuesForNames]="tagValuesForNames"
                ></kairos-ps-field>
        </div>
    </div>

</div>
`,
    styles: [`
    .ps-property-group {
        margin-bottom: 15px;
        display: table;
    }

    .ps-property-input {
        display: table-cell;
        padding-left: 20px;
        vertical-align:middle;
        width: 100%;
    }

    .ps-property-name {
        display: table-cell;
        width: 150px;
        overflow-y: hidden;
        text-overflow: ellipsis;
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
    .custom-disabled {
        pointer-events: none !important;
    }

    .ps-info-box {
        font-size: small;
    }
    .ps-info-box .glyphicon {
        padding-right: 5px;
    }

    .ps-info-icon {
        width: 100%;
        padding-bottom: 15px;
        padding-top: 5px;
        padding-right: 20px;
        margin-top: -5px;
        position: relative;
        font-size: small;
        color: #595555;
    }

    .ps-info-icon .glyphicon {
        position: absolute;
        right: 0px;
        cursor: pointer;
    }

    .fieldValidation {
        font-size: x-small;
        color: red;
        margin-bottom: -5px;
    }
  `],
    styleUrls: ['css/custom-checkbox.css']
})
export class PsEditorComponent implements OnChanges, OnInit {
    @Input()
    public psDescriptor: {};

    @Input()
    public psObject: {};

    @Output()
    public psObjectChange = new EventEmitter<{}>();

    @Input()
    public tagValuesForNames: {};

    public psName: string;

    private currentPsDescription: {};
    private currentPsProperties: {}[];

    public constructor() {
        this.psDescriptor = {};
        this.currentPsProperties = new Array<{}>();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        // called only when the change
        if (changes['psObject'] || changes['psDescriptor']) {
            // console.log('ngOnChanges');
            this.psChanged(this.psObject);
        }
    }

    public psChanged(psObject) {
        if(!this.psDescriptor || !(this.psDescriptor['properties'])){
            this.currentPsProperties = [];
            return;
        }
        this.psName = psObject['name'];
        this.currentPsDescription = _.find(this.psDescriptor['properties'], description => description['name'] === psObject['name']);
        let newPsProperties = new Array<{}>();
        if (this.currentPsDescription && this.currentPsDescription['properties']) {
            this.currentPsDescription['properties'].forEach((propertyDescribed) => {
                let property = _.cloneDeep(propertyDescribed);
                if (property['property_type'] === 'object') {
                    property['properties'].forEach((subPropertyDescribed) => {
                        let subProperty = _.clone(subPropertyDescribed);
                        subProperty['parent_name'] = property.name;
                        let currentVal = _.get(psObject, subProperty['name']);
                        subProperty['active'] = currentVal !== undefined || !subProperty['optional'];
                        subProperty['value'] = currentVal || this.getDefault(subProperty['property_type']);
                        newPsProperties.push(subProperty);
                    });
                }
                else {
                    let currentVal = _.get(psObject, property['name']);
                    property['active'] = currentVal !== undefined || !property['optional'];
                    property['value'] = currentVal || this.getDefault(property['property_type']);
                    newPsProperties.push(property);
                }
            });

        }
        this.currentPsProperties = newPsProperties;
    }

    ngOnInit() {
    }

    private getDefault(propertyType: string): any {
        if (propertyType === 'boolean') {
            return false;
        }

        else {
            return '';
        }

    }

    updatePsObject() {
        let localPsObject = {};
        localPsObject['name'] = this.psName;
        this.currentPsProperties.forEach(property => {
            let propertyName = property['parent_name'] ? property['parent_name']+'.'+property['name'] : property['name'];
            if (property['active']) {
                _.set(localPsObject, propertyName, property['value']);
            }
            else {
                _.unset(localPsObject, propertyName);
            }
        });
        this.psObjectChange.emit(localPsObject);
    }

    onPropertyNameClick(propButton, psProperty) {
        propButton.blur();
        psProperty.active = !psProperty.active;
        this.updatePsObject();
    }

    onPropertyInputChange(psProperty: {}) {
        this.updatePsObject();
    }

    checkBasicTypes(prop:{}, ...types:string[]): boolean {
        if(!prop || !types){
            return false;
        }
        let result = false;
        types.forEach(type => {
            result = result || type===prop['property_type'] || type===prop['element_type'];
        });
        return result;
    }

    checkText(prop:{}, type?:string): boolean {
        if(!prop || ('string'!==prop['property_type'] && 'string'!==prop['element_type'])){
            return false;
        }
        else if(type==='multiline'){
            return prop['multiline']===true;
        }
        else if(type==='autocomplete'){
            return prop['autocomplete']!==undefined;
        }
        else {
            return type==='standard';
        }

    }


}