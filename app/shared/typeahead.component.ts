import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'kairos-typeahead',
    template: `
	<div class="form-group has-feedback">
		<template #customItemTemplate let-model="item" let-index="index">
    		<div *ngIf="!typeaheadOptionsLimit || index<typeaheadOptionsLimit-1">{{model}}</div>
			<div *ngIf="index===typeaheadOptionsLimit-1">{{model}}<div style="padding-top:5px;"><b>And others...</b></div></div>
  		</template>
		<input [(ngModel)]="value"
        (ngModelChange)="valueChange.emit(value)"
        [typeahead]="typeaheadSource"
        [typeaheadMinLength]="typeaheadMinLength"
        [typeaheadWaitMs]="typeaheadWaitMs"
        [typeaheadOptionsLimit]="typeaheadOptionsLimit"
        [typeaheadOptionField]="typeaheadOptionField"
        [typeaheadGroupField]="typeaheadGroupField"
        [typeaheadAsync]="typeaheadAsync"
        [typeaheadLatinize]="typeaheadLatinize"
        [typeaheadSingleWords]="typeaheadSingleWords"
        [typeaheadWordDelimiters]="typeaheadWordDelimiters"
        [typeaheadPhraseDelimiters]="typeaheadPhraseDelimiters"
		[typeaheadItemTemplate]="customItemTemplate"
		(typeaheadOnSelect)="typeaheadOnSelect.emit($event)"
        (typeaheadNoResults)="typeaheadNoResults.emit($event)"
        (typeaheadLoading)="typeaheadLoading.emit($event)"
        (blur)="blur.emit($event)"
		placeholder="{{placeholder}}"
        class="form-control">
		<i class="glyphicon glyphicon-menu-down form-control-feedback"></i>
	</div>
  `,
    styles: [`
    * >>> .dropdown-menu {
        max-height: 200px;
        overflow: hidden;
        overflow-y: scroll;
    }
    .form-group {
        margin-bottom: 0px;
    }
  `],
})
export class TypeaheadComponent {
    @Input() 
    public value: string;
    @Output() 
    public valueChange = new EventEmitter<string>();

    @Output()
    public typeaheadLoading = new EventEmitter<boolean>();
    @Output()
    public typeaheadNoResults = new EventEmitter<boolean>();
    @Output()
    public typeaheadOnSelect = new EventEmitter<TypeaheadMatch>();
    @Output()
    public blur = new EventEmitter<any>();

    @Input()
    public typeaheadSource: any;
    @Input()
    public typeaheadMinLength: number;
    @Input()
    public typeaheadWaitMs: number;
    @Input()
    public typeaheadOptionsLimit: number;
    @Input()
    public typeaheadOptionField: string;
    @Input()
    public typeaheadGroupField: string;
    @Input()
    public typeaheadAsync: boolean = null;
    @Input()
    public typeaheadLatinize: boolean = true;
    @Input()
    public typeaheadWordDelimiters: string = ' ';
    @Input()
    public typeaheadSingleWords: boolean = true;
    @Input()
    public typeaheadPhraseDelimiters: string = '\'"';
    @Input()
    public placeholder: string = '';
}