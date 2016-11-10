import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import { TagEditorComponent } from './tag-editor.component';
import * as _ from 'lodash';

@Component({
    selector: 'kairos-tag-list',
    template: `
<kairos-tag-editor *ngFor="let selectedTag of selectedTagArray; let idx = index" 
    [tagValuesForNames]="tagValuesForNames"
    [(tagName)]="selectedTagArray[idx].name" 
    (tagNameChange)="update()"
    [(selectedTagValues)]="selectedTagArray[idx].values" 
    (selectedTagValuesChange)="update()"
    (delete)="selectedTagArray.splice(idx,1);"
></kairos-tag-editor> 
  `,
    styles: [`
  `]
})
export class TagListComponent implements OnChanges, OnInit {
    @Input()
    public selectedTagObject: {};
    @Output()
    public selectedTagObjectChange = new EventEmitter<{}>();

    @Input()
    public metricName: string;

    @Input()
    public tagValuesForNames: {};

    public selectedTagArray: {}[];

    public duplicatedTagNames: string[];

    @Output()
    public error = new EventEmitter<Array<{}>>();

    public constructor(private queryService: QueryService) {
        // initialize empty arrays for typeahead component
        this.selectedTagArray = [];
        this.duplicatedTagNames = [];
        this.selectedTagObject = {};
        this.tagValuesForNames = {};
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['selectedTagObject']) {
            this.selectedTagArray = _.map(_.keys(this.selectedTagObject), (key) => { return { name: key, values: this.selectedTagObject[key] } });
        }
    }

    ngOnInit() {
    }

    addNew() {
        this.selectedTagArray.push({ name: '', values: [] });
    }

    update() {
        let seenOnce = {};
        let seenTwice = {};
        this.selectedTagArray.forEach(function (value, index) {
            let name = value['name'];
            if (seenOnce[name]) {
                seenTwice[name] = true;
            }
            else {
                seenOnce[name] = true;
            }
        });
        this.duplicatedTagNames = _.keys(seenTwice);
        if (this.duplicatedTagNames.length === 0) {
            this.selectedTagObject = this.selectedTagListToObject();
            this.selectedTagObjectChange.emit(this.selectedTagObject);
        }
        else {
            this.error.emit(this.duplicatedTagNames);
        }
    }

    merge() {
        this.selectedTagObject = this.selectedTagListToObject();
        this.selectedTagObjectChange.emit(this.selectedTagObject);
        this.selectedTagArray = _.map(_.keys(this.selectedTagObject), (key) => { return { name: key, values: this.selectedTagObject[key] } });
        this.duplicatedTagNames = [];
        this.error.emit(this.duplicatedTagNames);
    }

    private selectedTagListToObject(): {} {
        let mergedSelectedTags = {};
        this.selectedTagArray.forEach(function (value, index) {
            let name = value['name'];
            if (mergedSelectedTags[name]) {
                mergedSelectedTags[name] = _.concat(mergedSelectedTags[name],value['values']);
            }
            else {
                mergedSelectedTags[name] = value['values'];
            }
        });
        return _.mapValues(mergedSelectedTags, _.uniq);
    }

}

