import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';


@Component({
    selector: 'kairos-aggregator-editor',
    template: `
<div class="well">
    <div *ngIf="!showAggInfo" class="aggregator-info-icon text-uppercase">
        {{currentAggregatorDescription?.metadata?.label || currentAggregatorDescription?.structure?.name || 'Invalid'}} aggregator
        <i *ngIf="currentAggregatorDescription?.metadata?.description" class="glyphicon glyphicon-info-sign" (click)="showAggInfo=true"></i>
    </div>
    <alert *ngIf="showAggInfo && currentAggregatorDescription?.metadata?.description" class="aggregator-info-box" [type]="'info'" dismissible="true" (close)="showAggInfo=false">
        <b>General description: </b> {{currentAggregatorDescription?.metadata?.description}}
    </alert>

    <div *ngFor="let aggregatorProperty of currentAggregatorProperties" class="aggregator-property-group">  
        <button #propButton type="button" class="btn btn-default aggregator-property-name"
                (click)="onPropertyNameClick(propButton,aggregatorProperty)"
                [class.custom-disabled]="!aggregatorProperty.optional"
                [class.active]="aggregatorProperty.active">
            {{aggregatorProperty.label || aggregatorProperty.name}}
        </button> 
        <alert *ngIf="showAggInfo && aggregatorProperty.description" class="aggregator-info-box aggregator-property-input" [type]="'info'">
            {{aggregatorProperty.description}}
        </alert>
        <div *ngIf="!showAggInfo && aggregatorProperty.active" class="aggregator-property-input">
            <span [ngSwitch]="aggregatorProperty.property_type">
                <input *ngSwitchCase="'text'" style="width:250px;" [(ngModel)]="aggregatorProperty.value" (ngModelChange)="updateAggregatorObject()" class="form-control"/>
                <input *ngSwitchCase="'text-small'" style="width:100px;" [(ngModel)]="aggregatorProperty.value" (ngModelChange)="updateAggregatorObject()" class="form-control"/>
                <input *ngSwitchCase="'text-large'" style="width:100%;" [(ngModel)]="aggregatorProperty.value" (ngModelChange)="updateAggregatorObject()" class="form-control"/>
                <textarea *ngSwitchCase="'textarea'" style="width:100%;resize:vertical;" [(ngModel)]="aggregatorProperty.value" (ngModelChange)="updateAggregatorObject()" class="form-control"></textarea>
                <select *ngSwitchCase="'enum'" style="width:inherit;" class="form-control" [(ngModel)]="aggregatorProperty.value" (ngModelChange)="updateAggregatorObject()">
                    <option *ngFor="let aggregatorPropertyOption of aggregatorProperty.options;" [value]="aggregatorPropertyOption">
                        {{aggregatorPropertyOption}}
                    </option>
                </select>
                <input *ngSwitchCase="'integer'" style="width:100px;" [(ngModel)]="aggregatorProperty.value" (ngModelChange)="updateAggregatorObject()" class="form-control"/>
                <input *ngSwitchCase="'long'" style="width:200px;" [(ngModel)]="aggregatorProperty.value" (ngModelChange)="updateAggregatorObject()" class="form-control"/>
                <div *ngSwitchCase="'boolean'" class="checkbox">
                    <label style="font-size: 1.0em">
                        <input type="checkbox" value="" [(ngModel)]="aggregatorProperty.value" (ngModelChange)="updateAggregatorObject()"> 
                        <span class="cr"><i class="cr-icon fa fa-check"></i></span>
                    </label>
                </div>
                <span *ngSwitchDefault>other</span>
            </span>
        </div>
    </div>

</div>
`,
    styles: [`
    .aggregator-property-group {
        margin-bottom: 15px;
        display: table;
    }

    .aggregator-property-input {
        display: table-cell;
        padding-left: 20px;
        vertical-align:middle;
        width: 100%;
    }

    .aggregator-property-name {
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

    .aggregator-info-box {
        font-size: small;
    }
    .aggregator-info-box .glyphicon {
        padding-right: 5px;
    }

    .aggregator-info-icon {
        width: 100%;
        padding-bottom: 15px;
        padding-top: 5px;
        padding-right: 20px;
        margin-top: -5px;
        position: relative;
        font-size: small;
        color: #595555;
    }

    .aggregator-info-icon .glyphicon {
        position: absolute;
        right: 0px;
        cursor: pointer;
    }
  `],
    styleUrls: ['css/custom-checkbox.css']
})
export class AggregatorEditorComponent implements OnChanges, OnInit {
    active3 = false;
    active4 = false;

    @Input()
    public aggregatorDescriptions: {}[];

    @Input()
    public aggregatorObject: {};

    @Output()
    public aggregatorObjectChange = new EventEmitter<{}>();

    public aggregatorName: string;

    private currentAggregatorDescription: {};
    private currentAggregatorProperties: {}[];

    public constructor() {
        this.aggregatorDescriptions = new Array<{}>();
        this.currentAggregatorProperties = new Array<{}>();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        // called only when the change
        if (changes['aggregatorObject'] || changes['aggregatorDescriptions']) {
            console.log('ngOnChanges');
            this.aggregatorChanged(this.aggregatorObject);
        }
    }

    public aggregatorChanged(aggregatorObject) {
        this.aggregatorName = aggregatorObject['name'];
        this.currentAggregatorDescription = _.find(this.aggregatorDescriptions, description => description['structure']['name'] === aggregatorObject['name']);
        let newAggregatorProperties = new Array<{}>();
        if (this.currentAggregatorDescription && this.currentAggregatorDescription['structure']) {
            let propertyNames = _.keys(this.currentAggregatorDescription['structure']);
            _.pull(propertyNames, 'name')
            propertyNames.forEach((propertyName) => {
                let property = _.clone(this.currentAggregatorDescription['structure'][propertyName]);
                if (typeof property['property_type'] === 'object') {
                    let subPropertiesNames = _.keys(property['property_type']);
                    subPropertiesNames.forEach((subPropertyName) => {
                        let subProperty = _.clone(property['property_type'][subPropertyName]);
                        subProperty['name'] = propertyName + '.' + subPropertyName;
                        let currentVal = _.get(aggregatorObject, subProperty['name']); 
                        subProperty['active'] = currentVal !== undefined || !subProperty['optional'];
                        subProperty['value'] = currentVal || this.getDefault(subProperty['property_type']);
                        newAggregatorProperties.push(subProperty);
                    });
                }
                else {
                    property['name'] = propertyName;
                    let currentVal = _.get(aggregatorObject, property['name']);
                    property['active'] = currentVal !== undefined || !property['optional'];
                    property['value'] = currentVal || this.getDefault(property['property_type']);
                    newAggregatorProperties.push(property);
                }
            });

        }
        this.currentAggregatorProperties = newAggregatorProperties;
    }

    ngOnInit() {
    }

    private getDefault(propertyType:string): any{
        if(propertyType==='boolean'){
            return false;
        }

        else{
            return '';
        }

    }

    updateAggregatorObject() {
        let localAggregatorObject = {};
        localAggregatorObject['name'] = this.aggregatorName;
        this.currentAggregatorProperties.forEach(property => {
            if (property['active']) {
                _.set(localAggregatorObject, property['name'], property['value']);
            }
            else {
                _.unset(localAggregatorObject, property['name']);
            }
        });
        this.aggregatorObjectChange.emit(localAggregatorObject);
    }

    onPropertyNameClick(propButton, aggregatorProperty) {
        propButton.blur();
        aggregatorProperty.active = !aggregatorProperty.active;
        this.updateAggregatorObject();
    }


}