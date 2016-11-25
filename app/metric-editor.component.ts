import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap';
import { QueryService } from './query.service';
import { DescriptorService } from './descriptors.service';
import { Subject } from 'rxjs/Subject';
import { TagEditorComponent } from './tag-editor.component';
import { Metric } from './model/metric';
import { PsDescriptor } from './model/ps';
import * as _ from 'lodash';

@Component({
    selector: 'kairos-metric-editor',
    template: `
<table>
<tr>
	<td class="label-col">
        <span >Name </span >
    </td>
    <td class="input-col">
        <kairos-typeahead
            #metricNameField
            [value]="parsedMetricObject.name"
            (valueChange)="generatedMetricObject.name=$event;metricObjectChange.emit(generatedMetricObject);"
            [typeaheadSource]="metricNames"
		    [typeaheadOptionsLimit]="100"
            [typeaheadMinLength]="0"
            (typeaheadOnSelect)="onMetricNameUpdate();"
            (blur)="onMetricNameUpdate()"
		    [placeholder]="'Enter metric name'"
            class="ui-select-search">
	    </kairos-typeahead>
    </td>
    <td>
        <button type="button" class="btn btn-default" (click)="refreshMetricNames()" >
            <i class="glyphicon glyphicon-refresh" [class.icon-refresh-animate]="refreshingMetricNames" > </i>
        </button>
    </td>
</tr>
</table>

<!-- TAGS -->
<div class="ps-section">
<div class="category-header">
    <h5 class="category-title">Tag filters</h5> 
    <button type="button" class="btn btn-default category-add" (click)="tagListComponent.addNew()"><i class="glyphicon glyphicon-plus"></i></button>
    <div class="category-error alert alert-danger" *ngIf="duplicatedTagNames?.length>0">
        <span class="glyphicon glyphicon-remove"></span>
        Duplicated tag name <em>{{duplicatedTagNames?.join()}}</em>. <a (click)="tagListComponent.merge()">Click here to merge</a>
    </div>
</div>
<div class="category-body">
    <kairos-tag-list #tagListComponent
        [parsedSelectedTagObject]="parsedMetricObject.tags" 
        (selectedTagObjectChange)="generatedMetricObject.tags=$event;metricObjectChange.emit(generatedMetricObject)"
        [tagValuesForNames]="tagValuesForNames"
        (error)="duplicatedTagNames=$event"
        >
    </kairos-tag-list>
</div>
</div>

<!-- OTHER PROCESSING STAGES (PS) -->
<div class="ps-section" *ngFor="let descriptor of descriptorList; let idx = index" >
    <div class="category-header">
        <h5 class="category-title">{{descriptor.label || descriptor.name}}</h5> 
        <button type="button" (click)="psListComponent.addNew()" class="btn btn-default category-add"><i class="glyphicon glyphicon-plus"></i></button>
    </div>
    <div class="category-body">
        <kairos-ps-list #psListComponent class="category-body"
            [psDescriptor]="descriptor"
            [parsedPsObjectList]="parsedMetricObject[descriptor.name]" 
            [tagValuesForNames]="tagValuesForNames"
            (psObjectListChange)="generatedMetricObject[descriptor.name]=$event;metricObjectChange.emit(generatedMetricObject)"
        ></kairos-ps-list>
    </div>
</div>
  `,
    styles: [`
    td {
        padding: 5px 5px;
    }

    tr {
        padding: 5px 5px;
    }

    table {
        margin-bottom: 15px;
    }

    .category-title{
        display: inline;
        margin-bottom: 0px;
        vertical-align: middle;
    }

    .category-add {
        display: inline;
        font-size: 12px;
        padding: 3px;
        
    }

    .category-error {
        display: inline;
        margin-left: 5px;
        color: #a94442;
        padding: 5px;
    }

    .category-header {
        padding-bottom: 5px;
    }    

    .category-section {
        border-radius: 4px;
        border: 1px solid transparent;
        border-color: #337ab7;
        padding: 12px 6px;
        margin: 3px 0px;
    }

    .category-delete {
        padding: 6px;
    }

    button .glyphicon {
        top: 0px;
    }

    label {
        padding-left: 5px;
        font-weight: 500;
    }

    .label-col {
        width: 50px;
    }

    .input-col {
        width: 500px;
    }

    .ps-section {
        margin-bottom: 20px;
    }

    .ps-section:last-child {
        margin-bottom: 0px;
    }

    .icon-refresh-animate {
        animation-name: rotateThis;
        animation-duration: .5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @keyframes "rotateThis" {
        from { transform: scale( 1 ) rotate( 0deg );   }
        to   { transform: scale( 1 ) rotate( 360deg ); }
    }
  `]
})
export class MetricEditorComponent implements OnChanges, OnInit {

    @Input()
    public parsedMetricObject: Metric;

    public generatedMetricObject: Metric;

    @Output()
    public metricObjectChange = new EventEmitter<Metric>();

    public metricNames: string[];

    private metricNameSubject: Subject<string>;

    public tagValuesForNames: {};

    public refreshingMetricNames: boolean;

    public descriptorList: PsDescriptor[];

    public duplicatedTagNames: string[];

    public constructor(private queryService: QueryService, private descriptorsService: DescriptorService) {
        // initialize empty arrays for typeahead component
        this.metricNames = [];
        this.tagValuesForNames = {};
        this.generatedMetricObject = new Metric();
        this.descriptorList = [];
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if(changes['parsedMetricObject']){
            this.generatedMetricObject = _.cloneDeep(this.parsedMetricObject);
        }
    }

    ngOnInit() {
        this.metricNameSubject = new Subject<string>();
        this.metricNameSubject.debounceTime(400).filter(value => value !== undefined && value !== null && value !== '').subscribe(
            metricName => this.queryService.getTagNameValues(metricName).then(
                resp => { this.tagValuesForNames = resp || {}; }
            )
        );
        this.descriptorsService.getDescriptorList().then(descList => {
            this.descriptorList = descList || [];
        });
        this.refreshMetricNames();
    }

    refreshMetricNames() {
        this.refreshingMetricNames = true;
        this.queryService.getMetricNames().then(resp => { this.refreshingMetricNames = false; this.metricNames = resp; });
        this.metricNameSubject.next(this.generatedMetricObject.name);
    }

    onMetricNameUpdate() {
        this.metricNameSubject.next(this.generatedMetricObject.name);
    }

}

