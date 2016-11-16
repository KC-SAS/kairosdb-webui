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
    public parsedSelectedTagObject: {}; // downstream
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
        this.tagValuesForNames = {};
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['parsedSelectedTagObject']) {
            this.selectedTagArray = _.map(_.keys(this.parsedSelectedTagObject), (key) => { return { name: key, values: _.cloneDeep(this.parsedSelectedTagObject[key]) } });
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
        this.error.emit(_.keys(seenTwice));
        if (_.isEmpty(seenTwice)) {
            this.selectedTagObjectChange.emit(this.selectedTagListToObject());
        }
    }

    merge() {
        let newSelectedTagObject = this.selectedTagListToObject();
        this.selectedTagObjectChange.emit(newSelectedTagObject);
        this.selectedTagArray = _.map(_.keys(newSelectedTagObject), (key) => { return { name: key, values: newSelectedTagObject[key] } });
        this.error.emit([]);
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
        mergedSelectedTags = _.mapValues(mergedSelectedTags, _.uniq);
        return mergedSelectedTags;
    }

}

