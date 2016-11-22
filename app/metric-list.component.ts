import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { QueryService } from './query.service';
import * as _ from 'lodash';

@Component({
    selector: 'kairos-metric-list',
    template: `
            <accordion [closeOthers]="true" >
                <accordion-group #group *ngFor="let metric of workingMetricList; let idx = index">
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
  `,
    styles: [`
    div[accordion-heading] {
        font-size: smaller;
        font-weight: 600;
        color: #606060;
    }
  `]
})
export class MetricListComponent implements OnChanges, OnInit {
    @Input()
    public parsedMetricList: {}[];

    public workingMetricList: {}[];

    public generatedMetricList: {}[];

    @Output()
    public metricListChange = new EventEmitter<{}[]>();

    public selectedMetricIndex: number;

    ngOnInit() {
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if(changes['parsedMetricList']){
            this.selectedMetricIndex = undefined;
            this.workingMetricList = _.map(this.parsedMetricList,_.identity) || [];
            this.generatedMetricList = _.map(this.parsedMetricList,_.identity) || [];
            this.metricListChange.emit(this.generatedMetricList);
        }
    }

}