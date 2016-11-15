import { Component } from '@angular/core';
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
        <accordion [closeOthers]="true" >
            <accordion-group [isOpen]="true" panelClass="panel-primary">
                <div accordion-heading>Metric</div>
                <kairos-metric 
                [metricName]="parsedQuery.metrics[0].name" 
                (metricNameChane)="assignOrDelete('metrics[0].name',$event)"
                [parsedSelectedTagObject]="parsedQuery.metrics[0].tags" 
                (selectedTagObjectChange)="assignOrDelete('metrics[0].tags',$event)"
                [parsedAggregatorObjectList]="parsedQuery.metrics[0].aggregators"
                (aggregatorObjectListChange)="assignOrDelete('metrics[0].aggregators',$event)"
                ></kairos-metric>
            </accordion-group>
        </accordion>
        <div class="panel panel-primary">
            <div class="panel-heading"><h4 class="panel-title">
                Json Query 
                <i *ngIf="jsonEditorDisabled" (click)="jsonEditorDisabled=false;jsonarea.focus()" class="glyphicon glyphicon-pencil json-editor-icon"></i>
            </h4></div>
            <textarea #jsonarea class="form-control json-area" rows="10"
                (blur)="parse(jsonarea.value); jsonEditorDisabled=true;" 
                (dblclick)="jsonEditorDisabled=false;" 
                [ngModel]="generatedQuery | json" 
                [readonly]="jsonEditorDisabled"
            ></textarea>
        </div>
    </div>
  `,
    styles: [`
    .json-area {
        resize:vertical;
    }

    .json-area[readonly] {
        cursor:pointer;
    }

    .json-editor-icon {
        cursor: pointer;
        float: right;
    }

    .kairos-container {
        margin: 5px 5px;
        max-width: 1000px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    accordion-group:last-child >>> .panel{
        margin-bottom: 20px;
    }
  `]
})
export class QueryComponent {
    public jsonEditorDisabled: boolean;

    public generatedQuery: {};

    public parsedQuery: {};

    public constructor() {
        this.jsonEditorDisabled = true;
        this.parsedQuery = {
            start_relative: { value: 1, unit: 'hours' },
            metrics: [{
                name: "kairosdb.datastore.query_time",
                tags: { host: ['RD-PC'] },
                aggregators: [{ name: 'test' }]
            }]
        };
        this.generatedQuery = _.cloneDeep(this.parsedQuery);
    }


    assignOrDelete(field, value) {
        if (value === undefined || value === null || value === '') {
            _.unset(this.generatedQuery, field);
        }
        else {
            _.set(this.generatedQuery, field, value);
        }
    }

    parse(jsonQuery: string) {
        console.log('parse()')
        try {
            this.parsedQuery = JSON.parse(jsonQuery);
            this.generatedQuery = _.cloneDeep(this.parsedQuery);
        }
        catch (e) {
            // TODO display 'invalid json'
        }
    }

}