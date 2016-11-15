import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
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
            <select class="form-control aggregator-select" [(ngModel)]="generatedAggregatorObjectList[idx].name" (ngModelChange)="aggregatorObjectListChange.emit(this.generatedAggregatorObjectList)">
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
<td *ngFor="let aggregatorObject of generatedAggregatorObjectList; let idx = index" [class.no-display]="idx!==selectedAggregatorIndex" class="aggregator-display-area">
    <kairos-aggregator-editor 
        [aggregatorDescriptions]="aggregatorDescriptions" 
        [(aggregatorObject)]="generatedAggregatorObjectList[idx]"
        (aggregatorObjectChange)="aggregatorObjectListChange.emit(this.generatedAggregatorObjectList);"
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

    public generatedAggregatorObjectList: {}[];


    @Output()
    public aggregatorObjectListChange = new EventEmitter<{}[]>();

    private selectedAggregatorIndex: number;
    public aggregatorDescriptions: {}[];

    public constructor(public queryService: QueryService) {
        this.generatedAggregatorObjectList = [{name:'test'}];
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if(changes['parsedAggregatorObjectList']){
            console.log('ngOnChanges parsedAggregatorObjectList');
            this.selectedAggregatorIndex = undefined;
            this.generatedAggregatorObjectList = _.map(this.parsedAggregatorObjectList,_.cloneDeep) || [];
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
        this.generatedAggregatorObjectList.push({name:'avg'});
        this.aggregatorObjectListChange.emit(this.generatedAggregatorObjectList);
        this.selectedAggregatorIndex=this.generatedAggregatorObjectList.length-1;
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
        this.aggregatorObjectListChange.emit(this.generatedAggregatorObjectList);
    }

}

