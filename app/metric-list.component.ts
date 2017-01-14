import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { QueryService } from './query.service';
import { _ } from './utils/imports';

@Component({
    selector: 'kairos-metric-list',
    template: `
                <div class="panel panel-default" #group *ngFor="let metric of workingMetricList; let idx = index">
                    <div class="accordion-toggle panel-heading" (click)="onPanelToggle(idx)">
                            {{generatedMetricList[idx]?.name || 'New Metric'}}
                            <button tooltipPopupDelay='1000' tooltip="Delete this metric" type="button" (click)="deleteMetric(idx); $event.stopPropagation();" class="btn btn-default accordion-heading-button pull-right">
                                <i style="top: .5px" class="glyphicon glyphicon-remove"></i>
                            </button>
                            <button tooltipPopupDelay='1000' tooltip="Duplicate this metric" type="button" (click)="duplicateMetric(idx); $event.stopPropagation();" class="btn btn-default accordion-heading-button pull-right">
                                <i style="top: .5px" class="glyphicon glyphicon-duplicate"></i>
                            </button>
                    </div>
                    <div class="panel-body" [class.collapsed]="idx!==selectedMetricIndex">
                        <kairos-metric-editor 
                        [parsedMetricObject]="metric" 
                        (metricObjectChange)="onMetricEdit(idx,$event)"
                        ></kairos-metric-editor>
                    </div>
                </div>
  `,
    styles: [`
    .panel {
        margin: 3px;
    }
    .panel-body {
        overflow: hidden;
        -webkit-transition: all .1s ease;
        -moz-transition: all .1s ease;
        transition: all .1s ease;
    }
    .accordion-toggle {
        font-size: smaller;
        font-weight: 600;
        color: #606060;
        cursor: pointer;
    }
    .accordion-heading-button {
        font-size: smaller;
        color: #606060;
        width: 20px;
        padding: 4px;
        margin-left: 10px
    }
    .collapsed {
        padding-top: 0px;
        padding-bottom: 0px;
        height: 0px;
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

    onPanelToggle(idx:number){
        this.selectedMetricIndex=(this.selectedMetricIndex===idx)?undefined:idx
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

    deleteMetric(idx: number){
        if(idx===this.selectedMetricIndex && idx<this.generatedMetricList.length){
            this.selectedMetricIndex=undefined;
        }
        else if(this.selectedMetricIndex && idx<this.selectedMetricIndex){
            this.selectedMetricIndex--;
        }
        _.pullAt(this.generatedMetricList, idx);
        _.pullAt(this.workingMetricList, idx);
        this.metricListChange.emit(this.generatedMetricList);
    }

    duplicateMetric(idx: number){
        this.workingMetricList.push(_.cloneDeep(this.generatedMetricList[idx]));
        this.generatedMetricList.push(_.cloneDeep(this.generatedMetricList[idx]));
        this.metricListChange.emit(this.generatedMetricList);
    }

}