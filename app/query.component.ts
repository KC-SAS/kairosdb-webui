import { Component, OnInit } from '@angular/core';
import { QueryService } from './query.service';
import { QueryStatus } from './model/query-status';
import { Query } from './model/query';
import * as _ from 'lodash';

@Component({
    selector: 'query-builder',
    template: `
    <div class="kairos-container">
        <kairos-timerange 
        [startRelative]="parsedQuery.start_relative" (startRelativeChange)="assignOrDelete('start_relative',$event)"
        [startAbsolute]="parsedQuery.start_absolute" (startAbsoluteChange)="assignOrDelete('start_absolute',$event)"
        [endRelative]="parsedQuery.end_relative" (endRelativeChange)="assignOrDelete('end_relative',$event)"
        [endAbsolute]="parsedQuery.end_absolute" (endAbsoluteChange)="assignOrDelete('end_absolute',$event)"
        [timezone]="parsedQuery.time_zone" (timezoneChange)="assignOrDelete('time_zone',$event)"
        >
        </kairos-timerange>
        <div class="panel panel-primary">
            <div class="panel-heading"><h4 class="panel-title">
                Metrics 
                <i (click)="kairosMetricList.addNew()" tooltipPopupDelay='1000' tooltip="Add new empty metric" style="font-size:small;" class="glyphicon glyphicon-plus panel-header-icon"></i>
            </h4></div>
            <kairos-metric-list #kairosMetricList
                [parsedMetricList]="parsedQuery.metrics" 
                (metricListChange)="assignOrDelete('metrics',$event)"
            ></kairos-metric-list>
        </div>
        <div class="panel panel-primary">
            <div class="panel-heading"><h4 class="panel-title">
                Json Query 
                <i *ngIf="jsonEditorDisabled" (click)="jsonEditorDisabled=false;jsonarea.focus()" tooltipPopupDelay='1000' tooltip="Edit query json directly" class="glyphicon glyphicon-pencil panel-header-icon"></i>
            </h4></div>
            <textarea #jsonarea class="form-control json-area" rows="10"
                (blur)="parse(jsonarea.value); jsonEditorDisabled=true;" 
                (dblclick)="jsonEditorDisabled=false;" 
                [(ngModel)]="displayedQuery" 
                [readonly]="jsonEditorDisabled"
            ></textarea>
        </div>
        <button type="button" class="btn btn-default" (click)="executeQuery()"> Graph !!! </button>
    </div>
    <div class="query-results">
        <kairos-query-status *ngIf="statusModel" [model]="statusModel"></kairos-query-status>
        <kairos-linechart *ngIf="queryResult" [queryResult]="queryResult"></kairos-linechart>
    </div>
  `,
    styles: [`
    .json-area {
        resize:vertical;
    }

    .json-area[readonly] {
        cursor:pointer;
    }

    div[accordion-heading] {
        font-size: smaller;
        font-weight: 600;
        color: #606060;
    }

    .panel-header-icon {
        cursor: pointer;
        float: right;
    }

    .kairos-container {
        margin: 5px 5px;
        max-width: 1000px;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 20px;
    }

    .query-results {
        margin-left: 20px;
        margin-right: 20px; 
    }
  `]
})
export class QueryComponent implements OnInit{

    public queryResult: {}[];
    public statusModel: QueryStatus;

    public jsonEditorDisabled: boolean;

    public generatedQuery: Query;
    public parsedQuery: Query;
    public displayedQuery: string;

    public invalidJson: boolean;

    public constructor(private queryService: QueryService) {
        this.jsonEditorDisabled = true;
    }

    ngOnInit(){
        this.parse(`{
            "start_relative": { "value": 1, "unit": "hours" },
            "metrics": [{
                "name": ""
            }]
        }`);
    }

    assignOrDelete(field, value) {
        if (value === undefined || value === null || value === '') {
            _.unset(this.generatedQuery, field);
        }
        else {
            _.set(this.generatedQuery, field, value);
        }
        this.displayedQuery = this.toPrettyJson(this.generatedQuery);
    }

    parse(jsonQuery: string) {
        try {
            this.parsedQuery = JSON.parse(jsonQuery);
            this.generatedQuery = _.cloneDeep(this.parsedQuery);
            this.displayedQuery = this.toPrettyJson(this.generatedQuery);
        }
        catch (e) {
            // TODO display 'invalid json'
        }
    }

    executeQuery() {
        this.queryResult = undefined;
        let startTime = new Date();
        this.statusModel = {
            status: 'progress',
            response: undefined,
            duration: undefined,
        };
        this.queryService.executeQuery(this.displayedQuery).then(
            (results) => {
                this.queryResult = results;
                this.statusModel = {
                    status: 'success',
                    duration: new Date().getTime() - startTime.getTime(),
                    response: results
                }

            },
            (error) => {
                console.log("query failure in query.component");
                this.statusModel = {
                    status: 'error',
                    duration: new Date().getTime() - startTime.getTime(),
                    response: error
                }
            });
    }

    toPrettyJson(object){
        return JSON.stringify(this.generatedQuery, null, 2);
    }

}