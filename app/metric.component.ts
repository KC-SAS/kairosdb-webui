import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import { TagEditorComponent } from './tag-editor.component';
import * as _ from 'lodash';

@Component({
    selector: 'kairos-metric',
    template: `

<table >
<tr>
	<td class="label-col">
        <span >Name </span >
    </td>
    <td class="input-col">
        <div class="has-feedback">
		    <input
            #metricNameField
            [(ngModel)]="metricName"
            [typeahead]="metricNames"
		    [typeaheadOptionsLimit]="10"
            [typeaheadMinLength]="0"
            (typeaheadOnSelect)="onMetricNameUpdate();"
            (blur)="onMetricNameUpdate()"
		    placeholder="Enter metric name"
            class="form-control ui-select-search">
		    <i class="glyphicon glyphicon-menu-down form-control-feedback"></i>
	    </div>
    </td>
    <td>
        <button type="button" class="btn btn-default" (click)="refreshMetricNames()" >
            <i class="glyphicon glyphicon-refresh" [class.icon-refresh-animate]="refreshingMetricNames" > </i>
        </button>
    </td>
</tr>
</table>

<!-- TAGS -->
<div class="category-header">
    <h5 class="category-title">Tags</h5> 
    <button type="button" class="btn btn-default category-add" (click)="tagListComponent.addNew()"><i class="glyphicon glyphicon-plus"></i></button>
    <div class="category-error alert alert-danger" *ngIf="duplicatedTagNames?.length>0">
        <span class="glyphicon glyphicon-remove"></span>
        Duplicated tag name <em>{{duplicatedTagNames?.join()}}</em>. <a (click)=tagListComponent.merge()>Click here to merge</a>
    </div>
</div>
<div class="category-body">
    <kairos-tag-list #tagListComponent
        [parsedSelectedTagObject]="parsedSelectedTagObject" 
        (selectedTagObjectChange)="selectedTagObjectChange.emit($event)"
        [metricName]="metricName"
        [tagValuesForNames]="tagValuesForNames"
        (error)="duplicatedTagNames=$event"
        >
    </kairos-tag-list>
</div>

<!-- AGGREGATORS -->
<div class="category-header">
    <h5 class="category-title">Aggregators</h5> 
    <button type="button" (click)="aggregatorListComponent.addNew()" class="btn btn-default category-add"><i class="glyphicon glyphicon-plus"></i></button>
</div>
<kairos-aggregator-list #aggregatorListComponent class="category-body"
    [parsedAggregatorObjectList]="parsedAggregatorObjectList" 
    (aggregatorObjectListChange)="aggregatorObjectListChange.emit($event)"
></kairos-aggregator-list>
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

    .category-body {
        margin-bottom: 20px;
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
export class MetricComponent implements OnChanges, OnInit {

    @Input()
    public metric: any;
    @Output()
    metricChange = new EventEmitter<any>();

    @Input()
    public parsedSelectedTagObject: {};
    @Output()
    public selectedTagObjectChange = new EventEmitter<{}>();

    @Input()
    public parsedAggregatorObjectList: {}[];
    @Output()
    public aggregatorObjectListChange = new EventEmitter<{}[]>();

    public metricNames: string[];

    @Input()
    public metricName: string;
    @Output()
    public metricNameChange = new EventEmitter<string>();

    private metricNameSubject: Subject<string>;

    public tagValuesForNames: {};

    public refreshingMetricNames: boolean;

    public constructor(private queryService: QueryService) {
        // initialize empty arrays for typeahead component
        this.metricNames = [];
        this.tagValuesForNames = {};
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if(changes['parsedAggregatorObjectList']){
            console.log('ngOnChanges parsedAggregatorObjectList');
        }
    }

    ngOnInit() {
        this.metricNameSubject = new Subject<string>();
        this.metricNameSubject.debounceTime(400).filter(value => value !== undefined && value !== null && value !== '').subscribe(
            metricName => this.queryService.getTagNameValues(metricName).then(
                resp => { this.tagValuesForNames = resp || {}; }
            )
        );
        this.refreshMetricNames();
    }

    refreshMetricNames() {
        this.refreshingMetricNames = true;
        this.queryService.getMetricNames().then(resp => { this.refreshingMetricNames = false; this.metricNames = resp; });
        this.metricNameSubject.next(this.metricName);
    }

    onMetricNameUpdate() {
        this.metricNameSubject.next(this.metricName);
    }

}

