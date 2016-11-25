import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

// TODO: clean because copied from the ng2-select style
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
    padding-right: 25px;
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
    selector: 'kairos-tag-editor',
    template: `
<div class="form-inline form-group category-section">
    <div class="has-feedback form-group">
            <label>Name</label>
		    <input
            [(ngModel)]="tagName"
            (ngModelChange)="tagNameChange.emit(tagName)"
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
        (click)="delete.emit()">&times;
    </a>
</div>
  `,
    styles: [labelStyles, `
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
  `]
})
export class TagEditorComponent implements OnChanges, OnInit {

    @Input()
    public tagValuesForNames: {};
    @Input()
    public selectedTagValues: string[];
    @Input()
    public tagName: string;

    @Output()
    public selectedTagValuesChange = new EventEmitter<string[]>();
    @Output()
    public tagNameChange = new EventEmitter<string>();
    @Output()
    public delete = new EventEmitter<void>();

    public tagNames: string[];
    public unselectedTagValues: string[];
    public refreshingMetricNames: boolean;
    public tagValue: string;

    public constructor(private queryService: QueryService) {
        // initialize empty arrays for typeahead component
        this.tagNames = [];
        this.unselectedTagValues = [];
        this.selectedTagValues = [];
        this.tagValuesForNames = {};
    }


    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['tagValuesForNames']) {
            this.tagNames = _.keys(this.tagValuesForNames) || [];
        }
        if (this.tagValuesForNames[this.tagName]) {
            this.unselectedTagValues = _.difference(this.tagValuesForNames[this.tagName], this.selectedTagValues);
        }
    }

    ngOnInit() {
    }

    removeSelectedTag(item: string) {
        let index = this.selectedTagValues.indexOf(item);
        this.selectedTagValues.splice(index, 1);
        if (this.tagValuesForNames
            && this.tagValuesForNames[this.tagName]
            && _.includes(this.tagValuesForNames[this.tagName],item)
            && !_.includes(this.unselectedTagValues,item)) {
            this.unselectedTagValues.push(item);
        }
        this.selectedTagValuesChange.emit(this.selectedTagValues);
    }

    addSelectedTag(item: string) {
        this.selectedTagValues.push(item);
        let index = this.unselectedTagValues.indexOf(item);
        this.unselectedTagValues.splice(index, 1);
        this.selectedTagValuesChange.emit(this.selectedTagValues);
    }

    onTagNameUpdate() {
        if (this.tagValuesForNames && this.tagValuesForNames[this.tagName]) {
            this.unselectedTagValues = _.difference(this.tagValuesForNames[this.tagName], this.selectedTagValues);
        }
        else {
            this.unselectedTagValues = [];
        }
    }

}

