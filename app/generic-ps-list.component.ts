import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { PsEditorComponent } from './generic-ps-editor.component'

import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { PsProperty, PsDescriptor } from './model/ps';
import * as _ from 'lodash';

// PS stands for Processing Stage

@Component({
    selector: 'kairos-ps-list',
    template: `
<table>
<td class="ps-name-column">
    <div *ngFor="let psObject of generatedPsObjectList; let idx = index">
        <div class="input-group agregator-name">
            <select class="form-control ps-select" [(ngModel)]="workingPsObjectList[idx].name" (ngModelChange)="onPsNameChange(idx,$event)">
                <option *ngFor="let psDescription of psDescriptor?.properties;" [value]="psDescription?.name">
                    {{psDescription?.label || psDescription?.name || 'Invalid'}}
                </option>
            </select>
            <button #currentSelectButton type="button" (click)="deletePs(idx)" class="btn btn-default form-control ps-state" aria-label="...">
                <span class="glyphicon glyphicon-remove"></span>
            </button>
	        <button #currentSelectButton type="button" (click)="currentSelectButton.blur();selectionChange(idx)" [class.active]="idx===selectedPsIndex" class="btn btn-default form-control ps-state" aria-label="...">
                <span class="glyphicon glyphicon-pencil"></span>
            </button>
        </div>
        <div *ngIf="idx<generatedPsObjectList.length-1" class="glyphicon glyphicon-arrow-down ps-arrow"></div>
    </div>
</td>
<td *ngFor="let psObject of workingPsObjectList; let idx = index" [class.no-display]="idx!==selectedPsIndex" class="ps-display-area">
    <kairos-ps-editor 
        [psDescriptor]="psDescriptor" 
        [psObject]="psObject"
        [tagValuesForNames]="tagValuesForNames"
        (psObjectChange)="onPsEdit(idx,$event)"
    ></kairos-ps-editor>
</td>
</table>
  `,
    styles: [`
    table {
        width: 100%;
    }
    .ps-state {
        width: 32px;
        margin-left: -1px;
        padding-left: 1px;
        padding-right: 1px;
    }
    .ps-select, .ps-arrow {
        width: 150px;
    }
    .ps-arrow {
        text-align: center;
        padding: 5px
    }
    .ps-name-column {
        width: 220px;
    }
    .ps-display-area {
        vertical-align: top;
    }
    .ps-property-group {
        padding-bottom: 15px;
    }
    .ps-info-box {
        font-size: small;
        text-align: center;
    }
    .ps-info-box .glyphicon {
        padding-right: 5px;
    }

    .ps-info-icon {
        width: 100%;
        padding-bottom: 15px;
        padding-top: 5px;
        margin-top: -5px;
        position: relative;
        font-size: small;
        color: #595555;
    }

    .ps-info-icon .glyphicon {
        position: absolute;
        right: 0px;
        
    }

    .no-display {
        display: none;
    }
  `]
})
export class PsListComponent implements OnChanges, OnInit {
    @Input()
    public parsedPsObjectList: PsProperty[];

    public workingPsObjectList: PsProperty[];

    public generatedPsObjectList: PsProperty[];


    @Output()
    public psObjectListChange = new EventEmitter<PsProperty[]>();

    public selectedPsIndex: number;

    @Input()
    public psDescriptor: PsDescriptor;

    @Input()
    public tagValuesForNames: {};

    @ViewChildren(PsEditorComponent) psEditorComponents: QueryList<PsEditorComponent>;

    public constructor(public queryService: QueryService) {
        this.generatedPsObjectList = [];
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        // if(changes['psDescriptor']){}
        if (changes['parsedPsObjectList']) {
            this.selectedPsIndex = undefined;
            this.workingPsObjectList = _.map<PsProperty,PsProperty>(this.parsedPsObjectList, property => property) || [];
            this.generatedPsObjectList = _.map<PsProperty,PsProperty>(this.parsedPsObjectList, property => property) || [];
        }
    }

    ngOnInit() {
    }

    addNew() {
        let defaultPsName: string = _.get<string>(this.psDescriptor,'properties[0].name');
        this.workingPsObjectList.push(new PsProperty(defaultPsName));
        this.generatedPsObjectList.push(new PsProperty(defaultPsName));
        this.psObjectListChange.emit(this.generatedPsObjectList);
        this.selectedPsIndex = this.workingPsObjectList.length - 1;
    }

    selectionChange(idx: number) {
        if (idx !== this.selectedPsIndex && idx < this.generatedPsObjectList.length) {
            this.selectedPsIndex = idx;
        }
        else {
            this.selectedPsIndex = undefined;
        }
    }

    deletePs(idx: number) {
        if (idx === this.selectedPsIndex && idx < this.generatedPsObjectList.length) {
            this.selectedPsIndex = undefined;
        }
        else if (this.selectedPsIndex && idx < this.selectedPsIndex) {
            this.selectedPsIndex--;
        }
        _.pullAt(this.generatedPsObjectList, idx);
        _.pullAt(this.workingPsObjectList, idx);
        this.psObjectListChange.emit(this.generatedPsObjectList);
    }

    onPsNameChange(idx, name) {
        let newPsObject = _.cloneDeep(this.generatedPsObjectList[idx]);
        newPsObject.name = name;
        this.psEditorComponents.toArray()[idx].psChanged(newPsObject);
        this.psEditorComponents.toArray()[idx].updatePsObject();
        this.psObjectListChange.emit(this.generatedPsObjectList);
    }

    onPsEdit(idx, newPsObject) {
        this.generatedPsObjectList[idx] = newPsObject;
        this.psObjectListChange.emit(this.generatedPsObjectList);
    }

}

