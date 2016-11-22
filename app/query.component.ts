import { Component } from '@angular/core';
import { QueryService } from './query.service';
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
                <i *ngIf="jsonEditorDisabled" (click)="jsonEditorDisabled=false;jsonarea.focus()" class="glyphicon glyphicon-plus panel-header-icon"></i>
            </h4></div>
            <div>
                <accordion [closeOthers]="true" >
                <accordion-group #group *ngFor="let metric of parsedQuery.metrics; let idx = index">
                    <div accordion-heading>
                        {{metric.name}}
                        <i class="pull-right glyphicon" [ngClass]="{'glyphicon-chevron-down': group?.isOpen, 'glyphicon-chevron-right': !group?.isOpen}"></i>
                    </div>
                    <kairos-metric-editor 
                        [metricName]="metric.name" 
                        (metricNameChange)="assignOrDelete('metrics['+idx+'].name',$event)"
                        [parsedSelectedTagObject]="metric.tags" 
                        (selectedTagObjectChange)="assignOrDelete('metrics['+idx+'].tags',$event)"
                        [parsedAggregatorObjectList]="metric.aggregators"
                        (aggregatorObjectListChange)="assignOrDelete('metrics['+idx+'].aggregators',$event)"
                    ></kairos-metric-editor>
                </accordion-group>
                </accordion>
            </div>
        </div>
        <div class="panel panel-primary">
            <div class="panel-heading"><h4 class="panel-title">
                Json Query 
                <i *ngIf="jsonEditorDisabled" (click)="jsonEditorDisabled=false;jsonarea.focus()" class="glyphicon glyphicon-pencil panel-header-icon"></i>
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
export class QueryComponent {

    public queryResult: {}[];
    public statusModel: {};

    public jsonEditorDisabled: boolean;

    public generatedQuery: {};
    public parsedQuery: {};
    public displayedQuery: string;

    public invalidJson: boolean;

    public constructor(private queryService: QueryService) {
        this.jsonEditorDisabled = true;
        this.parsedQuery = {
            start_relative: { value: 1, unit: 'hours' },
            metrics: [{
                name: "kairosdb.datastore.query_time",
                tags: { host: ['RD-PC'] }
            }]
        };
        this.generatedQuery = _.cloneDeep(this.parsedQuery);
        this.displayedQuery = this.toPrettyJson(this.generatedQuery);
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
        console.log('parse()')
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
            status: 'progress'
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
                    response: error
                }
            });
    }

    toPrettyJson(object){
        return JSON.stringify(this.generatedQuery, null, 2);
    }

}