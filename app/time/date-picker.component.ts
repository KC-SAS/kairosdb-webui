import {Component, Input, Output, ElementRef, EventEmitter, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'kairos-datepicker',
    template: `
    <div class="input-group">
	    <span class="input-group-addon" id="date">Date</span>
        <input aria-describedby="date" #dateField [(ngModel)]="dateModel" class="form-control" (focus)="showPopup()" (keyup)="onTextEdit(dateField.value)" />
    </div>
    <datepicker class="popup" *ngIf="showDatepicker" [(ngModel)]="dateObject" [showWeeks]="true" ></datepicker>
  `,
    styles: [`
    @keyframes slideDown {
        0% {
            transform:  translateY(-10px);
        }
        100% {
            transform: translateY(0px);
        }
    }
    .form-control {
        width: 150px;
    }
    .popup {
      position: absolute;
      background-color: #fff;
      border-radius: 3px;
      border: 1px solid #ddd;
      height: 251px;
      z-index: 100;
      animation: slideDown 0.1s ease-in-out;
      animation-fill-mode: both;
    }
  `],
})
export class DatePickerComponent implements OnInit{
    public dateObject: Date;

    @Input()
    dateModel: string;
    @Output()
    dateModelChange: EventEmitter<string> = new EventEmitter<string>();
    
    public showDatepicker: boolean = false;

    public constructor(private _eref: ElementRef) {
        document.addEventListener('click', this.offClickHandler.bind(this));
    }

    ngOnInit() {
      this.onTextEdit(this.dateModel);
    }

    showPopup() {
        //console.log('showPopup');
        this.showDatepicker = true;
    }

    hidePopup(event) {
        this.dateModel = moment(this.dateObject).format("YYYY-MM-DD");
        this.showDatepicker = false;
        this.dateModelChange.emit(this.dateModel);
    }

    offClickHandler(event: any) {
        //console.log('offClickHandler');
        if (!this._eref.nativeElement.contains(event.target) && this.showDatepicker) { // check click origin
            this.hidePopup(event);
        }
    }

    onTextEdit(fieldValue) {
        let tempDateObject = moment(fieldValue, "YYYY-MM-DD", true);
        if (tempDateObject.isValid()) {
            this.dateObject = tempDateObject.toDate();
        }
    }

}