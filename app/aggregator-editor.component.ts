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
        <i class="glyphicon glyphicon-info-sign"></i>
        {{currentAggregatorDescription?.metadata?.description}}
    </alert>

    <div *ngFor="let aggregatorProperty of currentAggregatorProperties" class="aggregator-property-group">  
        <button #propButton (click)="onPropertyNameClick(propButton,aggregatorProperty)" type="button" [class.custom-disabled]="!aggregatorProperty.optional" [class.active]="aggregatorProperty.active" class="btn btn-default aggregator-property-name">
            {{aggregatorProperty.label || aggregatorProperty.name}}
        </button> 
        <div *ngIf="aggregatorProperty.active" class="aggregator-property-input">
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
        text-align: center;
    }
    .aggregator-info-box .glyphicon {
        padding-right: 5px;
    }

    .aggregator-info-icon {
        width: 100%;
        padding-bottom: 15px;
        padding-top: 5px;
        margin-top: -5px;
        position: relative;
        font-size: small;
        color: #595555;
    }

    .aggregator-info-icon .glyphicon {
        position: absolute;
        right: 0px;
        
    }

/* CSS copied */
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
  `]
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

    private previousAggregatorName: string;

    private currentAggregatorDescription: {};
    private currentAggregatorProperties: {}[];

    public constructor() {
        this.aggregatorDescriptions = new Array<{}>();
        this.currentAggregatorProperties = new Array<{}>();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        // called only when the change
        if(changes['aggregatorObject'] || changes['aggregatorDescriptions']){
            this.aggregatorObjectNameChange();
        } 
    }

    private aggregatorObjectNameChange() {
        // adapt aggregatorObject model and currentAggregatorProperties when the aggegator name changes
        if (this.aggregatorDescriptions && this.aggregatorObject && this.previousAggregatorName !== this.aggregatorObject['name']) {
            this.previousAggregatorName = this.aggregatorObject['name'];
            this.currentAggregatorDescription = _.find(this.aggregatorDescriptions, description => description['structure']['name'] === this.aggregatorObject['name']);
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
                            subProperty['active'] = _.get(this.aggregatorObject,subProperty['name'])!==undefined || !subProperty['optional'];
                            newAggregatorProperties.push(subProperty);
                        });
                    }
                    else {
                        property['name'] = propertyName;
                        property['active'] = _.get(this.aggregatorObject,property['name'])!==undefined || !property['optional'];
                        newAggregatorProperties.push(property);
                    }
                });

            }
            this.currentAggregatorProperties = newAggregatorProperties;
        }
    }

    ngOnInit() {
    }

    updateAggregatorObject(){
        this.currentAggregatorProperties.forEach(property => {
            if(property['active']){
                _.set(this.aggregatorObject,property['name'],property['value']);
            }
            else{
                _.unset(this.aggregatorObject,property['name']);
            }
        });
        this.aggregatorObjectChange.emit(this.aggregatorObject);
    }

    onPropertyNameClick(propButton,aggregatorProperty){
        propButton.blur();
        aggregatorProperty.active=!aggregatorProperty.active;
        this.updateAggregatorObject();
    }


}