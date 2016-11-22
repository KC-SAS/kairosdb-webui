import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { AggregatorEditorComponent } from './aggregator-editor.component'

import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';


@Component({
    selector: 'kairos-aggregator-list',
    template: `
<table>
<td class="aggregator-name-column">
    <div *ngFor="let aggregatorObject of generatedAggregatorObjectList; let idx = index">
        <div class="input-group agregator-name">
            <select class="form-control aggregator-select" [(ngModel)]="workingAggregatorObjectList[idx].name" (ngModelChange)="onAggregatorNameChange(idx,$event)">
                <option *ngFor="let aggregatorDescription of aggregatorDescriptions;" [value]="aggregatorDescription?.structure?.name">
                    {{aggregatorDescription?.metadata?.label || aggregatorDescription?.structure?.name || 'Invalid'}}
                </option>
            </select>
            <button #currentSelectButton type="button" (click)="deleteAggregator(idx)" class="btn btn-default form-control aggregator-state" aria-label="...">
                <span class="glyphicon glyphicon-remove"></span>
            </button>
	        <button #currentSelectButton type="button" (click)="currentSelectButton.blur();selectionChange(idx)" [class.active]="idx===selectedAggregatorIndex" class="btn btn-default form-control aggregator-state" aria-label="...">
                <span class="glyphicon glyphicon-pencil"></span>
            </button>
        </div>
        <div *ngIf="idx<generatedAggregatorObjectList.length-1" class="glyphicon glyphicon-arrow-down aggregator-arrow"></div>
    </div>
</td>
<td *ngFor="let aggregatorObject of workingAggregatorObjectList; let idx = index" [class.no-display]="idx!==selectedAggregatorIndex" class="aggregator-display-area">
    <kairos-aggregator-editor 
        [aggregatorDescriptions]="aggregatorDescriptions" 
        [aggregatorObject]="workingAggregatorObjectList[idx]"
        (aggregatorObjectChange)="onAggregatorEdit(idx,$event)"
    ></kairos-aggregator-editor>
</td>
</table>
  `,
    styles: [`
    table {
        width: 100%;
    }
    .aggregator-state {
        width: 32px;
        margin-left: -1px;
        padding-left: 1px;
        padding-right: 1px;
    }
    .aggregator-select, .aggregator-arrow {
        width: 150px;
    }
    .aggregator-arrow {
        text-align: center;
        padding: 5px
    }
    .aggregator-name-column {
        width: 220px;
    }
    .aggregator-display-area {
        vertical-align: top;
    }
    .aggregator-property-group {
        padding-bottom: 15px;
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

    .no-display {
        display: none;
    }
  `]
})
export class AggregatorListComponent implements OnChanges, OnInit {
    @Input()
    public parsedAggregatorObjectList: {}[];

    public workingAggregatorObjectList: {}[];

    public generatedAggregatorObjectList: {}[];


    @Output()
    public aggregatorObjectListChange = new EventEmitter<{}[]>();

    private selectedAggregatorIndex: number;
    public aggregatorDescriptions: {}[];

    @ViewChildren(AggregatorEditorComponent) aggregatorEditorComponents: QueryList<AggregatorEditorComponent>;

    public constructor(public queryService: QueryService) {
        this.generatedAggregatorObjectList = [{name:'test'}];
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if(changes['parsedAggregatorObjectList']){
            this.selectedAggregatorIndex = undefined;
            this.workingAggregatorObjectList = _.map(this.parsedAggregatorObjectList,_.identity) || [];
            this.generatedAggregatorObjectList = _.map(this.parsedAggregatorObjectList,_.identity) || [];
        }
    }

    ngOnInit() {
        this.queryService.getAggregators().then(description => {
            if(description['aggregators']){
                this.aggregatorDescriptions = description['aggregators'];
            }
        });
    }

    addNew() {
        this.workingAggregatorObjectList.push({name:'avg'});
        this.generatedAggregatorObjectList.push({name:'avg'});
        this.aggregatorObjectListChange.emit(this.generatedAggregatorObjectList);
        this.selectedAggregatorIndex=this.workingAggregatorObjectList.length-1;
    }

    selectionChange(idx: number){
        if(idx!==this.selectedAggregatorIndex && idx<this.generatedAggregatorObjectList.length){
            this.selectedAggregatorIndex=idx;
        }
        else{
            this.selectedAggregatorIndex=undefined;
        }
    }

    deleteAggregator(idx: number){
        if(idx===this.selectedAggregatorIndex && idx<this.generatedAggregatorObjectList.length){
            this.selectedAggregatorIndex=undefined;
        }
        else if(this.selectedAggregatorIndex && idx<this.selectedAggregatorIndex){
            this.selectedAggregatorIndex--;
        }
        _.pullAt(this.generatedAggregatorObjectList, idx);
        _.pullAt(this.workingAggregatorObjectList, idx);
        this.aggregatorObjectListChange.emit(this.generatedAggregatorObjectList);
    }

    onAggregatorNameChange(idx,name){
        let newAggregatorObject = _.cloneDeep(this.generatedAggregatorObjectList[idx]);
        newAggregatorObject['name']=name;
        this.aggregatorEditorComponents.toArray()[idx].aggregatorChanged(newAggregatorObject);
        this.aggregatorEditorComponents.toArray()[idx].updateAggregatorObject();
        this.aggregatorObjectListChange.emit(this.generatedAggregatorObjectList);
    }

    onAggregatorEdit(idx, newAggregatorObject){
        this.generatedAggregatorObjectList[idx]=newAggregatorObject;
        this.aggregatorObjectListChange.emit(this.generatedAggregatorObjectList);
    }

}

