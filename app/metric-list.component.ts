import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { QueryService } from './query.service';
import * as _ from 'lodash';

@Component({
    selector: 'kairos-metric-list',
    template: `
            <accordion [closeOthers]="true" >
                <accordion-group #group *ngFor="let metric of workingMetricList; let idx = index" [isOpen]="idx===selectedMetricIndex">
                    <div accordion-heading>
                        {{generatedMetricList[idx]?.name || 'metric '+idx}}
                        <i class="pull-right glyphicon" [ngClass]="{'glyphicon-chevron-down': group?.isOpen, 'glyphicon-chevron-right': !group?.isOpen}"></i>
                    </div>
                    <kairos-metric-editor 
                        [parsedMetricObject]="workingMetricList[idx]"
                        (metricObjectChange)="onMetricEdit(idx,$event)"
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
            this.selectedMetricIndex = this.parsedMetricList ? this.parsedMetricList.length-1 : undefined;
            this.workingMetricList = _.map(this.parsedMetricList,_.identity) || [];
            this.generatedMetricList = _.map(this.parsedMetricList,_.identity) || [];
        }
    }

    onMetricEdit(idx, newMetricObject){
        this.generatedMetricList[idx]=newMetricObject;
        this.metricListChange.emit(this.generatedMetricList);
    }

    addNew() {
        this.workingMetricList.push({});
        this.generatedMetricList.push({});
        this.metricListChange.emit(this.generatedMetricList);
        this.selectedMetricIndex=this.workingMetricList.length-1;
    }

}