import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';


let labelStyles = `
  .ui-select-toggle {
    position: relative;
  }
  
  /* Fix Bootstrap dropdown position when inside a input-group */
  .input-group > .dropdown {
    /* Instead of relative */
    position: static;
  }
  
  .ui-select-match > .btn {
    /* Instead of center because of .btn */
    text-align: left !important;
  }
  
  .ui-select-match > .caret {
    position: absolute;
    top: 45%;
    right: 15px;
  }
  
  .ui-disabled {
    background-color: #eceeef;
    border-radius: 4px;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 0.6;
    top: 0;
    left: 0;
    cursor: not-allowed;
  }
  
  .ui-select-choices {
    width: 100%;
    height: auto;
    max-height: 200px;
    overflow-x: hidden;
    margin-top: 0;
  }
  
  .ui-select-multiple .ui-select-choices {
    margin-top: 1px;
  }
  .ui-select-choices-row>a {
      display: block;
      padding: 3px 20px;
      clear: both;
      font-weight: 400;
      line-height: 1.42857143;
      color: #333;
      white-space: nowrap;
  }
  .ui-select-choices-row.active>a {
      color: #fff;
      text-decoration: none;
      outline: 0;
      background-color: #428bca;
  }
  
  .ui-select-multiple {
    padding-bottom:2px;
    padding-top:4px;
    min-width: 200px;
    max-width: 600px;
    height: auto;
  }
  
  .ui-select-multiple input.ui-select-search {
    background-color: transparent !important; /* To prevent double background when disabled */
    border: none;
    outline: none;
    box-shadow: none;
    height: 1.6666em;
    padding: 0;
    margin-bottom: 3px;
    
  }
  .ui-select-match .close {
      font-size: 1.6em;
      line-height: 0.75;
  }
  
  .ui-select-multiple .ui-select-match-item {
    outline: 0;
    margin: 0 3px 3px 0;
  }
  .ui-select-toggle > .caret {
      position: absolute;
      height: 10px;
      top: 50%;
      right: 10px;
      margin-top: -2px;
  }
`;

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
<div class="category-header">
    <h5 class="category-title">Tags</h5> 
    <button type="button" class="btn btn-default category-add"><i class="glyphicon glyphicon-plus"></i></button>
</div>
<div class="form-inline form-group category-section">
    <div class="has-feedback form-group">
            <label>Name</label>
		    <input
            [(ngModel)]="tagName"
            [typeahead]="tagNames"
		    [typeaheadOptionsLimit]="10"
            [typeaheadMinLength]="0"
            (typeaheadOnSelect)="onTagNameUpdate();"
            (blur)="onTagNameUpdate()"
		    placeholder="Enter tag name"
            class="form-control ui-select-search">
		    <i class="glyphicon glyphicon-menu-down form-control-feedback"></i>
    </div>
    <div class="form-group">
    <label>Value</label>
    <div class="has-feedback ui-select-container ui-select-multiple dropdown form-control open">
        <span class="ui-select-match">
        <span *ngFor="let a of selectedTagValues">
            <span class="ui-select-match-item btn btn-default btn-secondary btn-xs"
                  tabindex="-1"
                  type="button"
                  [ngClass]="{'btn-default': true}">
               <a class="close"
                  style="margin-left: 5px; padding: 0;"
                  (click)="removeSelectedTag(a)">&times;</a>
               <span>{{a}}</span>
           </span>
        </span>
        </span>
  	    <input
            #tagvaluefield
            [(ngModel)]="tagValue"
            [typeahead]="unselectedTagValues"
		    [typeaheadOptionsLimit]="10"
            [typeaheadMinLength]="0"
            (typeaheadOnSelect)="addSelectedTag($event.value);tagvaluefield.value=''"
		    placeholder="Enter tag value"
            class="form-control ui-select-search">
		<i class="glyphicon glyphicon-menu-down form-control-feedback"></i>
    </div>
    </div>
    <a class="close category-delete"
        (click)="remove(a)">&times;
    </a>
</div>


        
  `,
    styles: [labelStyles, `
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
        padding-right: 5px;
        vertical-align: middle;
    }

    .category-add {
        display: inline;
        font-size: 12px;
        padding: 3px;
        
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

    public metricNames: string[];
    public metricName: string;
    private metricNameSubject: Subject<string>;

    public tagValuesForNames: any;
    public tagNames: string[];
    public tagName: string;
    public unselectedTagValues: string[];
    public selectedTagValues: string[];

    public refreshingMetricNames: boolean;

    




    public constructor(private queryService: QueryService) {
        // initialize empty arrays for typeahead component
        this.metricNames = [];
        this.tagNames = [];
        this.unselectedTagValues = [];
        this.selectedTagValues = [];
    }


    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {

    }

    ngOnInit() {
        this.metricNameSubject = new Subject<string>();
        this.metricNameSubject.debounceTime(500).filter(value => value !== undefined && value !== null && value !== '').subscribe(
            metricName => this.queryService.getTagNameValues(metricName).then(
                resp => { this.tagValuesForNames = resp; this.tagNames = _.keys(resp) || [];}
            )
        );
        this.refreshMetricNames();
    }

    refreshMetricNames() {
        this.refreshingMetricNames = true;
        this.queryService.getMetricNames().then(resp => { this.refreshingMetricNames = false; this.metricNames = resp; });
        this.metricNameSubject.next(this.metricName);
    }

    removeSelectedTag(item: string) {
        let index = this.selectedTagValues.indexOf(item);
        this.selectedTagValues.splice(index, 1);
        if(this.tagValuesForNames 
        && this.tagValuesForNames[this.tagName] 
        && this.tagValuesForNames[this.tagName].includes(item)
        && !this.unselectedTagValues.includes(item)){
            this.unselectedTagValues.push(item);
        }
        
    }

    addSelectedTag(item: string) {
        this.selectedTagValues.push(item);
        let index = this.unselectedTagValues.indexOf(item);
        this.unselectedTagValues.splice(index, 1);
    }

    onMetricNameUpdate() {
        this.metricNameSubject.next(this.metricName);
    }

    onTagNameUpdate() {
        if (this.tagValuesForNames && this.tagValuesForNames[this.tagName]) {
            this.unselectedTagValues = _.map<string,string>(this.tagValuesForNames[this.tagName],_.identity); // copy array but not elements (_.clone to copy elements)
            _.difference(this.unselectedTagValues,this.selectedTagValues);
        }
        else {
            this.unselectedTagValues = [];
        }
    }

}

