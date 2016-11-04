import { Component, Input, Output, EventEmitter, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
    selector: 'kairos-timepicker',
    template: `
  <div class="input-group">
	<span class="input-group-addon" id="time">Time</span>
    <input #timeField aria-describedby="time" [ngModel]="timeModel" class="form-control" (focus)="showPopup()" (keyup)="onTextEdit(timeField.value)" (blur)="onBlur()"/>
  </div>
  <div class="popup" *ngIf="showDatepicker">
    <label class="hourLabel">Hour:</label>
    <input #hours class="hourInput"
           (ngModelChange)="onSliderChange($event,'hour')"
           type="range" min="0" max="23" [ngModel]="hour" />
    <label class="minutesLabel">Min:</label>
    <input #minutes class="minutesInput"
           (ngModelChange)="onSliderChange($event,'minute')"
           type="range" min="0" max="59" [ngModel]="minute"/>
    <label class="secondsLabel">Sec:</label>
    <input #seconds class="secondsInput"
           (ngModelChange)="onSliderChange($event,'second')"
           type="range" min="0" max="59" [ngModel]="second"/>
    <label class="millisecondsLabel">Ms:</label>
    <input #milliseconds class="millisecondsInput"
           (ngModelChange)="onSliderChange($event,'millisecond')"
           type="range" min="0" max="999" step="10" [ngModel]="millisecond"/>
  </div>
  `,
   styleUrls: ['app/time-picker.component.css']
})
export class TimePickerComponent implements OnChanges {

    public hour: number;
    public minute: number;
    public second: number;
    public millisecond: number;

    @Input()
    timeModel: string;

    @Output()
    timeModelChange: EventEmitter<string> = new EventEmitter<string>();

    private showDatepicker: boolean = false;

    public constructor(private _eref: ElementRef) {
        document.addEventListener('click', this.offClickHandler.bind(this));
    }

    showPopup() {
        this.showDatepicker = true;
    }

    hidePopup(event) {
        this.showDatepicker = false;
        //this.timeModel = event;
        this.timeModelChange.emit(this.timeModel)
    }

    onSliderChange(event?: Event, unit?: string) {
        if (event && unit) {
            this[unit] = event;
        }
        let secDefined = this.second && this.second != 0;
        let msDefined = this.millisecond && this.millisecond != 0;

        this.timeModel = ("0" + this.hour).slice(-2)
            + ":"
            + ("0" + this.minute).slice(-2)
            + ((secDefined || msDefined) ? ":" + ("0" + this.second).slice(-2) : "")
            + (msDefined ? "." + ("00" + this.millisecond).slice(-3) : "");
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if(changes['timeModel']){
            this.onTextEdit(this.timeModel);
        }
    }

    onTextEdit(fieldValue) {
        let parts = fieldValue.split(":");
        if (parts.length > 1) {
            this.hour = this.parseIntOrZero(parts[0]);
            this.minute = this.parseIntOrZero(parts[1]);
        }

        if (parts.length > 2) {
            let subparts = parts[2].split(".");
            if (subparts.length > 0) {
                this.second = this.parseIntOrZero(subparts[0]);
            }
            if (subparts.length > 1) {
                this.millisecond = this.parseIntOrZero(subparts[1]);
            }
            else {
                this.millisecond = 0;
            }
        }
        else {
            this.second = 0;
            this.millisecond = 0;
        }
    }

    onBlur() {
        this.hour = Math.min(23, this.hour);
        this.minute = Math.min(59, this.minute);
        this.second = Math.min(59, this.second);
        this.millisecond = Math.min(999, this.millisecond);
        this.onSliderChange();
    }

    offClickHandler(event: any) {
        if (!this._eref.nativeElement.contains(event.target) && this.showDatepicker) { // check click origin
            this.hidePopup(event);
        }

    }

    parseIntOrZero(str: string): number {
        let parsing = parseInt(str, 10);
        if (!isNaN(parsing)) {
            return parsing;
        } else {
            return 0;
        }
    }
}